import { db } from "@/lib/db";
import { refundCreditTx } from "@/lib/ontop";

/**
 * Dual-Trigger Sweeper Engine:
 * Quét dọn các task hàng đợi mồ côi hoặc zombie:
 * 1. PENDING > 45 giây (Worker sập/tắt máy không ai bốc task)
 * 2. PROCESSING > 60 giây (Worker đã bốc nhưng rớt mạng/crash trình duyệt không báo về)
 *
 * Tự động bọc trong db.$transaction nguyên tử để chống Double-Refund và bảo đảm tính nhất quán dữ liệu.
 */
export async function sweepStaleTasks(specificJobId?: number): Promise<void> {
  const now = Date.now();
  const PENDING_TIMEOUT_MS = 45_000;   // 45s cho PENDING
  const PROCESSING_TIMEOUT_MS = 60_000; // 60s cho PROCESSING

  try {
    // 1. Quét riêng task cụ thể nếu có yêu cầu trực tiếp từ Polling của Frontend Web
    if (specificJobId) {
      const task = await db.serviceUsageLog.findUnique({
        where: { id: specificJobId },
      });

      if (task && !task.refunded && task.status !== "SUCCESS") {
        const isPendingStale =
          task.status === "PENDING" &&
          now - task.createdAt.getTime() > PENDING_TIMEOUT_MS;
        const isProcessingStale =
          task.status === "PROCESSING" &&
          now - task.updatedAt.getTime() > PROCESSING_TIMEOUT_MS;

        if (isPendingStale || isProcessingStale) {
          let meta: Record<string, any> = {};
          try {
            meta = JSON.parse(task.metadata || "{}");
          } catch {}

          meta.completedAt = new Date().toISOString();
          meta.resultMessage = isPendingStale
            ? "Không có Worker khả dụng tiếp nhận sau 45s. Lượt Verify đã được tự động hoàn lại an toàn!"
            : "Worker bị ngắt kết nối quá 60s. Task đã tự động hủy và hoàn lại lượt Verify cho bạn!";
          meta.failedReason = isPendingStale
            ? "PENDING_QUEUE_TIMEOUT"
            : "ZOMBIE_PROCESSING_TIMEOUT";
          meta.sweptAt = new Date().toISOString();

          await db.$transaction(async (tx) => {
            const res = await tx.serviceUsageLog.updateMany({
              where: {
                id: task.id,
                status: task.status,
                refunded: false,
              },
              data: {
                status: "FAILED",
                refunded: true,
                metadata: JSON.stringify(meta),
              },
            });

            if (res.count > 0 && meta.passId) {
              await refundCreditTx(tx, meta.passId);
              console.log(
                `[Dual Sweeper] Polling tự giải cứu & hoàn lượt passId #${meta.passId} cho task #${task.id}`
              );
            }
          });
        }
      }
      return;
    }

    // 2. Quét hàng loạt (khi Worker claim task hoặc gọi định kỳ)
    // 2.1 Quét task PROCESSING treo > 60 giây
    const staleProcessingTasks = await db.serviceUsageLog.findMany({
      where: {
        serviceType: "FREE_FIRE",
        status: "PROCESSING",
        refunded: false,
        updatedAt: { lt: new Date(now - PROCESSING_TIMEOUT_MS) },
      },
      take: 10,
    });

    for (const stale of staleProcessingTasks) {
      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(stale.metadata || "{}");
      } catch {}

      meta.completedAt = new Date().toISOString();
      meta.resultMessage =
        "Worker bị ngắt kết nối quá 60s. Task đã bị hủy và hoàn lượt tự động.";
      meta.failedReason = "ZOMBIE_PROCESSING_TIMEOUT";
      meta.sweptAt = new Date().toISOString();

      await db.$transaction(async (tx) => {
        const updateRes = await tx.serviceUsageLog.updateMany({
          where: {
            id: stale.id,
            status: "PROCESSING",
            refunded: false,
          },
          data: {
            status: "FAILED",
            refunded: true,
            metadata: JSON.stringify(meta),
          },
        });

        if (updateRes.count > 0 && meta.passId) {
          await refundCreditTx(tx, meta.passId);
          console.log(
            `[Dual Sweeper] Hoàn 1 credit (passId #${meta.passId}) cho zombie task #${stale.id}`
          );
        }
      });
    }

    // 2.2 Quét task PENDING bị bỏ quên > 45 giây nếu Worker từng offline
    const stalePendingTasks = await db.serviceUsageLog.findMany({
      where: {
        serviceType: "FREE_FIRE",
        status: "PENDING",
        refunded: false,
        createdAt: { lt: new Date(now - PENDING_TIMEOUT_MS) },
      },
      take: 10,
    });

    for (const stale of stalePendingTasks) {
      let meta: Record<string, any> = {};
      try {
        meta = JSON.parse(stale.metadata || "{}");
      } catch {}

      meta.completedAt = new Date().toISOString();
      meta.resultMessage =
        "Không có Worker khả dụng tiếp nhận sau 45s. Đã tự động hoàn lượt.";
      meta.failedReason = "PENDING_QUEUE_TIMEOUT";
      meta.sweptAt = new Date().toISOString();

      await db.$transaction(async (tx) => {
        const updateRes = await tx.serviceUsageLog.updateMany({
          where: {
            id: stale.id,
            status: "PENDING",
            refunded: false,
          },
          data: {
            status: "FAILED",
            refunded: true,
            metadata: JSON.stringify(meta),
          },
        });

        if (updateRes.count > 0 && meta.passId) {
          await refundCreditTx(tx, meta.passId);
          console.log(
            `[Dual Sweeper] Hoàn 1 credit (passId #${meta.passId}) cho pending timeout task #${stale.id}`
          );
        }
      });
    }
  } catch (sweepErr) {
    console.warn("[Dual Sweeper Warning]:", sweepErr);
  }
}
