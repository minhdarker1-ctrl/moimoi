import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBaseUrl, verifyWorkerSecret } from "@/lib/serverUtils";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-worker-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    if (!verifyWorkerSecret(req)) {
      return NextResponse.json(
        { success: false, error: "Mã bí mật Worker không hợp lệ." },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => ({}));
    const now = new Date();

    // 1. Cập nhật thời điểm heartbeat của Worker
    await db.freeFireConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        workerHeartbeatAt: now,
      },
      update: {
        workerHeartbeatAt: now,
      },
    });

    // 2. Tính toán quy mô khay đệm link OnTop
    // Target buffer: 25 link. Kích hoạt bù khi available < 15. Mỗi nhịp bù tối đa 5 link.
    const available = await db.ontopLinkBuffer.count({
      where: { status: "AVAILABLE" },
    });

    const TARGET_BUFFER = 25;
    const LOW_THRESHOLD = 15;
    const MAX_PER_BATCH = 5;

    let needed = 0;
    if (available < LOW_THRESHOLD) {
      needed = Math.min(TARGET_BUFFER - available, MAX_PER_BATCH);
    }

    const baseUrl = getBaseUrl(req);
    const claimEndpoint = `${baseUrl}/api/ontop/claim`;

    return NextResponse.json(
      {
        success: true,
        message: "Heartbeat acknowledged",
        timestamp: now.getTime(),
        workerId: body.workerId || "gemauto-chrome-worker",
        linkSync: {
          needed,
          available,
          targetBuffer: TARGET_BUFFER,
          claimEndpoint,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}

