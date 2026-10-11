import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await db.freeFireConfig.findUnique({ where: { id: 1 } });

    const lastBeat = config?.workerHeartbeatAt
      ? new Date(config.workerHeartbeatAt).getTime()
      : 0;
    const diffMs = Date.now() - lastBeat;
    const isOnline = diffMs < 60_000; // Coi là Online nếu có nhịp tim trong vòng 60 giây gần nhất
    const lastSeenSeconds = Math.max(0, Math.floor(diffMs / 1000));

    return NextResponse.json({
      success: true,
      isOnline,
      lastSeenSeconds,
      adminWakeupUrl:
        config?.adminWakeupUrl || config?.teleBotLink || "https://t.me/mdarker_bot",
      wakeupMessage:
        config?.wakeupMessage ||
        "Bot chợp mắt 1 tý, ai dùng thì kêu admin gọi bot dậy nha",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      isOnline: false,
      lastSeenSeconds: 99999,
      adminWakeupUrl: "https://t.me/mdarker_bot",
      wakeupMessage: "Bot chợp mắt 1 tý, ai dùng thì kêu admin gọi bot dậy nha",
      error: String(error),
    });
  }
}
