import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refundCreditTx } from "@/lib/ontop";
import { sweepStaleTasks } from "@/lib/queue-sweeper";
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
 * - action=claim: Extension worker nhận việc cần xử lý (Atomic Claim chống race condition)
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

      // 1. Kích hoạt Sweeper dọn dẹp các task PENDING > 45s và PROCESSING > 60s
      await sweepStaleTasks();

      // 2. Tìm task PENDING cũ nhất
      const candidateTask = await db.serviceUsageLog.findFirst({
        where: {
          serviceType: "FREE_FIRE",
          status: "PENDING",
        },
        orderBy: { createdAt: "asc" },
      });

      if (!candidateTask) {
        return NextResponse.json(
          {
            success: true,
            task: null,
            message: "Không có task nào đang chờ xử lý.",
          },
          { headers: corsHeaders }
        );
      }

      // 3. Đọc và bảo toàn metadata gốc (passId, chatId, source...)
      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(candidateTask.metadata || "{}");
      } catch {}

      meta.claimedAt = new Date().toISOString();

      // 4. ATOMIC CLAIM: Chuyển sang PROCESSING bằng updateMany kèm cập nhật updatedAt tường minh
      const claimResult = await db.serviceUsageLog.updateMany({
        where: {
          id: candidateTask.id,
          status: "PENDING",
        },
        data: {
          status: "PROCESSING",
          updatedAt: new Date(),
          metadata: JSON.stringify(meta),
        },
      });

      if (claimResult.count === 0) {
        // Task đã bị luồng worker khác bốc ngay trước đó
        return NextResponse.json(
          {
            success: true,
            task: null,
            message: "Task đã được xử lý bởi luồng khác.",
          },
          { headers: corsHeaders }
        );
      }

      const server =
        meta.server ||
        (candidateTask.serviceName.includes("Astute") ? "astute" : "kipas");
      const serverLabel =
        meta.serverLabel ||
        (server === "astute" ? "File Astute" : "File Kipas");

      return NextResponse.json(
        {
          success: true,
          task: {
            id: candidateTask.id,
            uid: candidateTask.targetUser,
            server,
            serverLabel,
            createdAt: candidateTask.createdAt,
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
 * - Xác thực WORKER_SECRET
 * - Bọc Database Transaction khi hoàn lượt
 * - Bảo toàn metadata gốc và xử lý an toàn khi Worker báo SUCCESS muộn
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

    // Bảo toàn dữ liệu metadata gốc từ DB (passId, chatId, source, clientAgent...)
    let meta: Record<string, any> = {};
    try {
      meta = JSON.parse(existing.metadata || "{}");
    } catch {}

    const originalPassId = meta.passId;
    meta.completedAt = new Date().toISOString();
    meta.resultMessage = resultMessage;

    // Trường hợp 1: Worker báo SUCCESS MUỘN cho một task đã bị Sweeper đánh dấu FAILED và hoàn tiền
    if (status === "SUCCESS" && existing.status === "FAILED" && existing.refunded) {
      meta.workerLateSuccess = true;
      meta.workerCompletedAt = new Date().toISOString();
      meta.auditNote =
        "Worker báo SUCCESS muộn sau khi task đã bị Sweeper hủy/hoàn lượt. Giữ nguyên trạng thái hoàn lượt để đối soát.";

      await db.serviceUsageLog.update({
        where: { id },
        data: { metadata: JSON.stringify(meta) },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Ghi nhận Late SUCCESS từ Worker (bảo toàn đối soát hoàn tiền)",
        },
        { headers: corsHeaders }
      );
    }

    // Trường hợp 2: Task báo FAILED -> Bọc Transaction cập nhật FAILED & hoàn tiền nguyên tử
    if (status === "FAILED") {
      await db.$transaction(async (tx) => {
        const updated = await tx.serviceUsageLog.updateMany({
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

        if (updated.count > 0 && originalPassId) {
          await refundCreditTx(tx, originalPassId);
          console.log(
            `[Queue POST] Đã hoàn 1 credit cho passId #${originalPassId} của task #${id}`
          );
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: "Task marked as FAILED and credit refunded atomically",
        },
        { headers: corsHeaders }
      );
    } else {
      // Trường hợp 3: Task báo SUCCESS bình thường
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
