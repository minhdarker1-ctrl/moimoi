import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Endpoint hàng đợi 2 chiều giữa Web mDarker và Chrome Extension / Worker
 * - action=claim: Extension worker nhận việc cần xử lý (chuyển PENDING -> PROCESSING)
 * - action=list: Danh sách task gần nhất để theo dõi tiến độ
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    // WORKER CLAIM TASK: Lấy task PENDING cũ nhất để xử lý
    if (action === "claim") {
      const pendingTask = await db.serviceUsageLog.findFirst({
        where: {
          serviceType: "FREE_FIRE",
          status: "PENDING",
        },
        orderBy: { createdAt: "asc" },
      });

      if (!pendingTask) {
        return NextResponse.json({
          success: true,
          task: null,
          message: "Không có task nào đang chờ xử lý.",
        });
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

      const server = meta.server || (pendingTask.serviceName.includes("Astute") ? "astute" : "kipas");
      const serverLabel = meta.serverLabel || (server === "astute" ? "Astute" : "FF Kipas");

      return NextResponse.json({
        success: true,
        task: {
          id: pendingTask.id,
          uid: pendingTask.targetUser,
          server,
          serverLabel,
          createdAt: pendingTask.createdAt,
        },
      });
    }

    // LIST QUEUE: Xem danh sách hàng đợi gần đây
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "10")));
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

    return NextResponse.json({
      success: true,
      queue: items.map((item) => {
        let meta: Record<string, any> = {};
        try {
          meta = JSON.parse(item.metadata || "{}");
        } catch {}
        return {
          id: item.id,
          uid: item.targetUser,
          server: meta.server || (item.serviceName.includes("Astute") ? "astute" : "kipas"),
          serverLabel: item.serviceName.includes("Astute") ? "Astute" : "FF Kipas",
          status: item.status,
          resultMessage: meta.resultMessage || "",
          createdAt: item.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("Queue Route Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
