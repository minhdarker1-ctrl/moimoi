import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const now = new Date();

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

    return NextResponse.json(
      {
        success: true,
        message: "Heartbeat acknowledged",
        timestamp: now.getTime(),
        workerId: body.workerId || "unknown",
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
