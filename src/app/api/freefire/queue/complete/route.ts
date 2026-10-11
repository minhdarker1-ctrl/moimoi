import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Endpoint ghi nhận kết quả xử lý từ Extension Worker
 * Body: { jobId: number, status: "SUCCESS" | "FAILED", resultMessage?: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const jobId = Number(body.jobId);
    const status = body.status === "FAILED" ? "FAILED" : "SUCCESS";
    const resultMessage = String(body.resultMessage || "").trim();

    if (!jobId || isNaN(jobId)) {
      return NextResponse.json(
        { success: false, error: "Thiếu hoặc sai jobId hợp lệ." },
        { status: 400 }
      );
    }

    const task = await db.serviceUsageLog.findUnique({
      where: { id: jobId },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy task ID #${jobId}.` },
        { status: 404 }
      );
    }

    let meta: Record<string, any> = {};
    try {
      meta = JSON.parse(task.metadata || "{}");
    } catch {}

    meta.completedAt = new Date().toISOString();
    meta.workerSource = "EXTENSION_HELPER";
    if (resultMessage) {
      meta.resultMessage = resultMessage;
    } else {
      meta.resultMessage =
        status === "SUCCESS"
          ? "Đã nạp Whitelist và đồng bộ ID thành công lên máy chủ Free Fire!"
          : "Không thể kết nối hoặc nạp Whitelist lên máy chủ đích.";
    }

    const updated = await db.serviceUsageLog.update({
      where: { id: jobId },
      data: {
        status,
        metadata: JSON.stringify(meta),
      },
    });

    return NextResponse.json({
      success: true,
      jobId: updated.id,
      status: updated.status,
      message: meta.resultMessage,
    });
  } catch (error) {
    console.error("Queue Complete Route Error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ khi hoàn thành task." },
      { status: 500 }
    );
  }
}
