import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fingerprint } from "@/lib/crypto";
import { canHop, HOP_MESSAGES } from "@/lib/hop";
import { clientIp } from "@/lib/guard";

function baseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function fail(req: Request, msg: string) {
  const url = new URL("/key/error", baseUrl(req));
  url.searchParams.set("m", msg);
  return NextResponse.redirect(url, 302);
}

export async function GET(req: Request, ctx: { params: Promise<{ token: string; step: string }> }) {
  const { token, step: stepRaw } = await ctx.params;
  const step = Number(stepRaw);
  if (!Number.isInteger(step) || step < 1) return fail(req, "Bước không hợp lệ.");

  const s = await db.keySession.findUnique({ where: { token }, include: { keyType: true } });
  if (!s) return fail(req, "Phiên không tồn tại.");

  // Cùng phiên phải cùng thiết bị: chặn chia sẻ link giữa chừng.
  const ip = clientIp(req);
  if (s.ipHash !== fingerprint(ip)) return fail(req, "Phiên không khớp thiết bị. Bấm Get Key lại.");

  let stepAt: number[] = [];
  try {
    const p = JSON.parse(s.stepAt);
    if (Array.isArray(p)) stepAt = p.filter((x): x is number => typeof x === "number");
  } catch {
    stepAt = [];
  }

  const check = canHop(
    {
      step: s.step,
      lastAt: stepAt.at(-1) ?? 0,
      expiresAt: s.expiresAt.getTime(),
      doneAt: s.doneAt ? s.doneAt.getTime() : null,
    },
    step,
    s.keyType.minSeconds,
    Date.now(),
  );
  if (!check.ok) return fail(req, HOP_MESSAGES[check.reason]);

  let hopUrls: string[] = [];
  try {
    const p = JSON.parse(s.hopUrls);
    if (Array.isArray(p)) hopUrls = p.filter((x): x is string => typeof x === "string");
  } catch {
    hopUrls = [];
  }

  const next = hopUrls[step];
  if (!next) return fail(req, "Không tìm thấy bước tiếp theo.");

  await db.keySession.update({
    where: { id: s.id },
    data: { step, stepAt: JSON.stringify([...stepAt, Date.now()]) },
  });

  return NextResponse.redirect(next, 302);
}
