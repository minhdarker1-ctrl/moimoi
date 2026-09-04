import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import { clientIp, rateLimit } from "@/lib/guard";

export async function POST(req: Request) {
  const date = vnDate();

  // 1 lượt đếm/phút/IP: reload liên tục không làm phồng số.
  if (await rateLimit("hit", clientIp(req), 1, 60_000)) {
    const [c, d] = await Promise.all([
      db.counter.findUnique({ where: { id: 1 } }),
      db.dailyHit.findUnique({ where: { date } }),
    ]);
    return NextResponse.json({ total: c?.total ?? 0, today: d?.count ?? 0 });
  }

  const [counter, daily] = await db.$transaction([
    db.counter.upsert({ where: { id: 1 }, update: { total: { increment: 1 } }, create: { id: 1, total: 1 } }),
    db.dailyHit.upsert({ where: { date }, update: { count: { increment: 1 } }, create: { date, count: 1 } }),
  ]);

  return NextResponse.json({ total: counter.total, today: daily.count });
}
