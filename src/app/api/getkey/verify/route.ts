import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashKey } from "@/lib/crypto";
import { clientIp, rateLimit, maybeCleanup } from "@/lib/guard";

export async function POST(req: Request) {
  const ip = clientIp(req);
  // Endpoint công khai: 20 req/phút/IP để không dò được key.
  if (await rateLimit("verify", ip, 20, 60_000)) {
    return NextResponse.json({ valid: false, error: "Quá nhiều yêu cầu." }, { status: 429 });
  }
  await maybeCleanup();

  let body: { key?: unknown; appId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, error: "Body không phải JSON." }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key : "";
  if (key.length < 8 || key.length > 40) {
    return NextResponse.json({ valid: false, error: "Key sai định dạng." }, { status: 400 });
  }

  const found = await db.appKey.findUnique({ where: { keyHash: hashKey(key) } });
  if (!found || found.revoked) return NextResponse.json({ valid: false });
  if (found.expiresAt < new Date()) return NextResponse.json({ valid: false });
  if (found.maxUses > 0 && found.usedCount >= found.maxUses) return NextResponse.json({ valid: false });

  const appId = Number(body.appId);
  if (Number.isInteger(appId) && found.appId !== null && found.appId !== appId) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, expiresAt: found.expiresAt.toISOString() });
}
