import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/guard";
import { getCurrentUser } from "@/lib/auth";
import { sendFreeFireUnlockTelegramAlert } from "@/lib/telegram";
import {
  consumeCredit,
  refundCredit,
  signPassPayload,
  ONTOP_COOKIE_NAME,
  getOntopPassStatus,
} from "@/lib/ontop";
import { vnDate } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);

    // 1. Rate limiting chống spam (Tối đa 5 lượt / 1 phút / IP)
    const isLimited = await rateLimit("ff_unlock", ip, 5, 60_000);
    if (isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn thao tác quá nhanh. Vui lòng chờ 1 phút trước khi kích hoạt lại!",
        },
        { status: 429 }
      );
    }

    // 2. Parse body
    const body = await req.json().catch(() => ({}));

    // Chặn Bot tự động bằng trường Honeypot ẩn
    const honeypot = String(body.website ?? body.phone ?? "").trim();
    if (honeypot) {
      return NextResponse.json(
        { success: false, error: "Yêu cầu không hợp lệ." },
        { status: 400 }
      );
    }

    const rawUid = String(body.uid ?? "").trim().replace(/\D/g, "");
    const serverParam = String(body.server ?? "kipas").toLowerCase().trim();
    const server = serverParam === "astute" ? "astute" : "kipas";
    const serverLabel = server === "astute" ? "Astute" : "FF Kipas";

    // 3. Kiểm tra tính hợp lệ của UID Free Fire (5 đến 15 chữ số theo chuẩn kiểm duyệt)
    if (!rawUid) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập UID Free Fire của bạn." },
        { status: 400 }
      );
    }

    if (!/^\d{5,15}$/.test(rawUid)) {
      return NextResponse.json(
        {
          success: false,
          error: "UID không hợp lệ. Vui lòng nhập từ 5–15 chữ số.",
        },
        { status: 400 }
      );
    }

    // 4. Lấy cấu hình hệ thống
    const config = await db.freeFireConfig.findUnique({ where: { id: 1 } });
    if (config && !config.unlockEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: "Dịch vụ Unlock ID hiện đang bảo trì máy chủ. Vui lòng quay lại sau ít phút!",
        },
        { status: 503 }
      );
    }

    // 5. BẮT BUỘC KIỂM TRA & TRỪ CREDIT NGUYÊN TỬ (Atomic Concurrency Control)
    const cookieHeader = req.headers.get("cookie") || "";
    const ontopCookieMatch = cookieHeader.match(/ontop_daily_pass=([^;]+)/);
    const ontopCookieVal = ontopCookieMatch ? decodeURIComponent(ontopCookieMatch[1]) : undefined;

    const creditResult = await consumeCredit(ip, ontopCookieVal);
    if (!creditResult.success) {
      return NextResponse.json(
        {
          success: false,
          requirePass: true,
          error: creditResult.error || "Bạn chưa có lượt Verify khả dụng. Vui lòng hoàn thành vượt link để nhận lượt!",
        },
        { status: 403 }
      );
    }

    // 6. Tiếp nhận Task Hàng Đợi (Status = PENDING) để Extension Worker nhận việc
    const user = await getCurrentUser();
    const userAgent = req.headers.get("user-agent") || "";
    let deviceName = "Khác";
    if (/iphone|ipad|ipod/i.test(userAgent)) deviceName = "iOS";
    else if (/android/i.test(userAgent)) deviceName = "Android";
    else if (/windows/i.test(userAgent)) deviceName = "Windows PC";
    else if (/macintosh/i.test(userAgent)) deviceName = "Mac";

    let task;
    try {
      task = await db.serviceUsageLog.create({
        data: {
          userId: user?.id ?? null,
          serviceType: "FREE_FIRE",
          serviceName: `Free Fire Unlock (${serverLabel})`,
          targetUser: rawUid,
          ip,
          device: deviceName,
          status: "PENDING",
          metadata: JSON.stringify({
            server,
            serverLabel,
            timestamp: Date.now(),
            clientAgent: userAgent.slice(0, 150),
            retries: 0,
            passId: creditResult.passId,
            source: body.source || "WEB",
            chatId: body.chatId || null,
          }),
        },
      });
    } catch (taskErr) {
      console.error("Lỗi tạo Task hàng đợi, tiến hành hoàn lại credit:", taskErr);
      await refundCredit(creditResult.passId);
      return NextResponse.json(
        {
          success: false,
          error: "Máy chủ đang quá tải. Lượt Verify của bạn đã được hoàn lại an toàn, vui lòng thử lại sau!",
        },
        { status: 500 }
      );
    }

    // Bắn thông báo về Telegram tự động (chạy nền, không chặn phản hồi)
    sendFreeFireUnlockTelegramAlert({
      uid: rawUid,
      server,
      serverLabel,
      device: deviceName,
      ip,
      status: "PENDING",
    }).catch((e) => console.error("Telegram notify failed:", e));

    const freshStatus = await getOntopPassStatus(ip, creditResult.passToken);
    const today = vnDate();
    const response = NextResponse.json({
      success: true,
      jobId: task.id,
      uid: rawUid,
      server,
      serverLabel,
      status: "PENDING",
      remainingCredits: creditResult.remainingCredits,
      message: "Yêu cầu mở khóa đã được tiếp nhận. Đang đồng bộ danh sách Whitelist lên máy chủ...",
    });

    // Cập nhật cookie mới với số credit đã trừ
    const signedToken = signPassPayload({
      passToken: creditResult.passToken,
      date: freshStatus.date || today,
      earnedCount: freshStatus.earnedCount,
      usedCount: freshStatus.usedCount,
      availableCredits: freshStatus.availableCredits,
    });

    response.cookies.set(ONTOP_COOKIE_NAME, signedToken, {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("FF Unlock Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Máy chủ đang quá tải hoặc gặp lỗi. Vui lòng thử lại sau giây lát!",
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Tra cứu trạng thái Task (nếu có ?jobId=...) HOẶC danh sách các UID vừa kích hoạt gần đây
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobIdParam = searchParams.get("jobId");

    // 1. Nếu có jobId: Trả về trạng thái thời gian thực của task đó
    if (jobIdParam) {
      const id = parseInt(jobIdParam, 10);
      if (!isNaN(id)) {
        const task = await db.serviceUsageLog.findUnique({
          where: { id },
        });

        if (!task) {
          return NextResponse.json({ success: false, error: "Không tìm thấy task." }, { status: 404 });
        }

        let meta: Record<string, any> = {};
        try {
          meta = JSON.parse(task.metadata || "{}");
        } catch {}

        return NextResponse.json({
          success: true,
          jobId: task.id,
          uid: task.targetUser,
          status: task.status, // "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"
          server: meta.server || "kipas",
          serverLabel: meta.serverLabel || "FF Kipas",
          resultMessage: meta.resultMessage || "",
          completedAt: meta.completedAt || null,
        });
      }
    }

    // 2. Không có jobId: Trả về danh sách UID vừa kích hoạt gần đây
    const recentLogs = await db.serviceUsageLog.findMany({
      where: {
        serviceType: "FREE_FIRE",
        serviceName: { contains: "Unlock" },
        status: { in: ["SUCCESS", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        targetUser: true,
        serviceName: true,
        status: true,
        createdAt: true,
        metadata: true,
      },
    });

    const maskedLogs = recentLogs.map((log) => {
      const uid = log.targetUser;
      const masked =
        uid.length > 5
          ? uid.slice(0, 3) + "***" + uid.slice(-2)
          : uid.slice(0, 2) + "***";

      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(log.metadata || "{}");
      } catch {}

      const isAstute = log.serviceName.includes("Astute");
      return {
        id: log.id,
        maskedUid: masked,
        server: isAstute ? "Astute" : "FF Kipas",
        status: log.status,
        source: meta.source || "WEB",
        timeAgo: getTimeAgo(log.createdAt),
      };
    });

    return NextResponse.json({ success: true, logs: maskedLogs });
  } catch {
    return NextResponse.json({ success: true, logs: [] });
  }
}

function getTimeAgo(date: Date): string {
  const diffSec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diffSec < 60) return "Vừa xong";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} phút trước`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} giờ trước`;
  return `${Math.floor(diffSec / 86400)} ngày trước`;
}
