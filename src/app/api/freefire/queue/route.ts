import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refundCredit } from "@/lib/ontop";
import { safeEqual } from "@/lib/crypto";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-worker-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function verifyWorkerSecret(req: Request): boolean {
  const expectedSecret =
    process.env.WORKER_SECRET || "xdarker_worker_token_2026_moimoi";

  const headerSecret = req.headers.get("x-worker-secret");
  if (headerSecret && safeEqual(headerSecret.trim(), expectedSecret.trim())) {
    return true;
  }

  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (safeEqual(bearerToken, expectedSecret.trim())) {
      return true;
    }
  }

  // Chấp nhận request từ localhost trong môi trường dev
  const host = req.headers.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return true;
  }

  return false;
}

/**
 * Endpoint hàng đợi 2 chiều giữa Web mDarker và Chrome Extension / Worker
 * - action=claim: Extension worker nhận việc cần xử lý (chuyển PENDING -> PROCESSING)
 *   Tích hợp Zombie Task Sweeper tự động dọn task treo và hoàn tiền
 * - action=list: Danh sách task gần nhất để theo dõi tiến độ
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // WORKER CLAIM TASK: Lấy task PENDING cũ nhất để xử lý
    if (action === "claim") {
      if (!verifyWorkerSecret(req)) {
        return NextResponse.json(
          { success: false, error: "Mã bí mật Worker không hợp lệ." },
          { status: 401, headers: corsHeaders }
        );
      }

      const now = Date.now();

      // 1. ZOMBIE TASK SWEEPER: Dọn dẹp các task PROCESSING treo > 60 giây do worker crash/ngắt kết nối
      try {
        const staleProcessingTasks = await db.serviceUsageLog.findMany({
          where: {
            serviceType: "FREE_FIRE",
            status: "PROCESSING",
            refunded: false,
            updatedAt: { lt: new Date(now - 60_000) },
          },
          take: 10,
        });

        for (const stale of staleProcessingTasks) {
          let meta: Record<string, any> = {};
          try {
            meta = JSON.parse(stale.metadata || "{}");
          } catch {}

          const updateRes = await db.serviceUsageLog.updateMany({
            where: {
              id: stale.id,
              status: "PROCESSING",
              refunded: false,
            },
            data: {
              status: "FAILED",
              refunded: true,
              metadata: JSON.stringify({
                ...meta,
                resultMessage:
                  "Worker bị ngắt kết nối quá 60s. Task đã bị hủy và hoàn lượt tự động.",
                failedReason: "ZOMBIE_PROCESSING_TIMEOUT",
                sweptAt: new Date().toISOString(),
              }),
            },
          });

          if (updateRes.count > 0 && meta.passId) {
            await refundCredit(meta.passId);
            console.log(
              `[Sweeper] Tự động hoàn 1 credit (passId #${meta.passId}) cho zombie task #${stale.id}`
            );
          }
        }

        // Dọn dẹp thêm các task PENDING bị bỏ quên > 120s nếu worker từng offline
        const stalePendingTasks = await db.serviceUsageLog.findMany({
          where: {
            serviceType: "FREE_FIRE",
            status: "PENDING",
            refunded: false,
            createdAt: { lt: new Date(now - 120_000) },
          },
          take: 10,
        });

        for (const stale of stalePendingTasks) {
          let meta: Record<string, any> = {};
          try {
            meta = JSON.parse(stale.metadata || "{}");
          } catch {}

          const updateRes = await db.serviceUsageLog.updateMany({
            where: {
              id: stale.id,
              status: "PENDING",
              refunded: false,
            },
            data: {
              status: "FAILED",
              refunded: true,
              metadata: JSON.stringify({
                ...meta,
                resultMessage:
                  "Không có Worker khả dụng tiếp nhận sau 120s. Đã tự động hoàn lượt.",
                failedReason: "PENDING_QUEUE_TIMEOUT",
                sweptAt: new Date().toISOString(),
              }),
            },
          });

          if (updateRes.count > 0 && meta.passId) {
            await refundCredit(meta.passId);
            console.log(
              `[Sweeper] Tự động hoàn 1 credit (passId #${meta.passId}) cho pending timeout task #${stale.id}`
            );
          }
        }
      } catch (sweepErr) {
        console.warn("[Sweeper Warning]:", sweepErr);
      }

      // 2. Lấy task PENDING cũ nhất để giao cho worker
      const pendingTask = await db.serviceUsageLog.findFirst({
        where: {
          serviceType: "FREE_FIRE",
          status: "PENDING",
        },
        orderBy: { createdAt: "asc" },
      });

      if (!pendingTask) {
        return NextResponse.json(
          {
            success: true,
            task: null,
            message: "Không có task nào đang chờ xử lý.",
          },
          { headers: corsHeaders }
        );
      }

      // Đánh dấu là PROCESSING để không bị worker khác nhận trùng
      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(pendingTask.metadata || "{}");
      } catch {}

      meta.claimedAt = new Date().toISOString();

      await db.serviceUsageLog.update({
        where: { id: pendingTask.id },
        data: {
          status: "PROCESSING",
          metadata: JSON.stringify(meta),
        },
      });

      const server =
        meta.server ||
        (pendingTask.serviceName.includes("Astute") ? "astute" : "kipas");
      const serverLabel =
        meta.serverLabel ||
        (server === "astute" ? "File Astute" : "File Kipas");

      return NextResponse.json(
        {
          success: true,
          task: {
            id: pendingTask.id,
            uid: pendingTask.targetUser,
            server,
            serverLabel,
            createdAt: pendingTask.createdAt,
          },
        },
        { headers: corsHeaders }
      );
    }

    // LIST QUEUE: Xem danh sách hàng đợi gần đây
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "10"))
    );
    const statusFilter = searchParams.get("status");

    const whereClause: any = {
      serviceType: "FREE_FIRE",
      serviceName: { contains: "Unlock" },
    };
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const items = await db.serviceUsageLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        targetUser: true,
        serviceName: true,
        status: true,
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        queue: items.map((item) => {
          let meta: Record<string, any> = {};
          try {
            meta = JSON.parse(item.metadata || "{}");
          } catch {}
          return {
            id: item.id,
            uid: item.targetUser,
            server:
              meta.server ||
              (item.serviceName.includes("Astute") ? "astute" : "kipas"),
            serverLabel: item.serviceName.includes("Astute")
              ? "File Astute"
              : "File Kipas",
            status: item.status,
            resultMessage: meta.resultMessage || "",
            createdAt: item.createdAt,
            source: meta.source || "WEB",
          };
        }),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Queue Route Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST: Extension Worker báo cáo kết quả hoàn thành task
 * - Yêu cầu xác thực WORKER_SECRET
 * - Chống Double-Refund bằng Atomic Update: Chỉ hoàn 1 lần duy nhất khi task FAILED
 * - Hỗ trợ ghi nhận log từ Telegram Bot
 */
export async function POST(req: Request) {
  try {
    if (!verifyWorkerSecret(req)) {
      return NextResponse.json(
        { success: false, error: "Mã bí mật Worker không hợp lệ." },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Hỗ trợ ghi nhận log trực tiếp từ Telegram Bot nếu có action: "log"
    if (body.action === "log" && body.uid) {
      const rawUid = String(body.uid).trim();
      const srv = body.server === "astute" ? "astute" : "kipas";
      const srvLabel = srv === "astute" ? "Astute" : "FF Kipas";
      const logStatus = body.status === "FAILED" ? "FAILED" : "SUCCESS";
      await db.serviceUsageLog.create({
        data: {
          serviceType: "FREE_FIRE",
          serviceName: `Free Fire Unlock (${srvLabel})`,
          targetUser: rawUid,
          device: "Telegram Bot",
          status: logStatus,
          refunded: false,
          metadata: JSON.stringify({
            server: srv,
            serverLabel: srvLabel,
            source: "TELEGRAM",
            resultMessage:
              body.resultMessage || "Đã thêm vào Whitelist qua Telegram Bot!",
            completedAt: new Date().toISOString(),
          }),
        },
      });
      return NextResponse.json(
        { success: true, message: "Logged Telegram unlock task" },
        { headers: corsHeaders }
      );
    }

    const { jobId, status = "SUCCESS", resultMessage = "" } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Thiếu jobId" },
        { status: 400, headers: corsHeaders }
      );
    }

    const id = parseInt(String(jobId), 10);
    const existing = await db.serviceUsageLog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy task" },
        { status: 404, headers: corsHeaders }
      );
    }

    let meta: Record<string, any> = {};
    try {
      meta = JSON.parse(existing.metadata || "{}");
    } catch {}

    meta.completedAt = new Date().toISOString();
    meta.resultMessage = resultMessage;

    if (status === "FAILED") {
      // ATOMIC UPDATE: Chỉ đánh dấu FAILED và refunded=true nếu trạng thái hiện tại khác SUCCESS và chưa từng refunded
      const updated = await db.serviceUsageLog.updateMany({
        where: {
          id,
          status: { not: "SUCCESS" },
          refunded: false,
        },
        data: {
          status: "FAILED",
          refunded: true,
          metadata: JSON.stringify(meta),
        },
      });

      // Nếu cập nhật thành công (tức là lần đầu tiên thất bại) và có passId -> Hoàn trả credit
      if (updated.count > 0 && meta.passId) {
        await refundCredit(meta.passId);
        console.log(
          `[Queue POST] Đã hoàn 1 credit cho passId #${meta.passId} của task #${id}`
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Task marked as FAILED and credit refunded if applicable",
        },
        { headers: corsHeaders }
      );
    } else {
      // SUCCESS
      await db.serviceUsageLog.update({
        where: { id },
        data: {
          status: "SUCCESS",
          metadata: JSON.stringify(meta),
        },
      });

      return NextResponse.json(
        { success: true, message: "Task marked as SUCCESS" },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
