import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fingerprint, sessionToken } from "@/lib/crypto";
import { shortenWithFallback, usableShorteners } from "@/lib/getkey";
import { clientIp, rateLimit, maybeCleanup } from "@/lib/guard";

const SESSION_TTL_MIN = 30;

function baseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function fail(req: Request, msg: string, isJson: boolean = false) {
  if (isJson) {
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
  const url = new URL("/key/error", baseUrl(req));
  url.searchParams.set("m", msg);
  return NextResponse.redirect(url, 302);
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const isJson = reqUrl.searchParams.get("format") === "json" || req.headers.get("accept")?.includes("application/json") || false;

  // Mỗi lần bấm tạo N link thật trên cổng rút gọn, đốt quota.
  // Không giới hạn thì spam F5 là hết 1000 link/ngày của Ontops.
  if (await rateLimit("getkey", clientIp(req), 10, 60_000)) {
    return fail(req, "Bạn bấm quá nhiều lần. Chờ 1 phút rồi thử lại.", isJson);
  }
  await maybeCleanup();

  const appId = Number(reqUrl.searchParams.get("appId"));
  if (!Number.isInteger(appId) || appId <= 0) return fail(req, "Thiếu mã ứng dụng.", isJson);

  const app = await db.app.findUnique({ where: { id: appId }, include: { keyType: true } });
  if (!app?.visible || !app.keyType?.enabled) return fail(req, "Ứng dụng không dùng hệ thống key.", isJson);

  const kt = app.keyType;
  let ids: number[] = [];
  try {
    const parsed = JSON.parse(kt.providerIds);
    if (Array.isArray(parsed)) ids = parsed.filter((x): x is number => Number.isInteger(x));
  } catch {
    ids = [];
  }
  if (ids.length === 0) return fail(req, "Admin chưa cấu hình cổng vượt link.", isJson);

  const candidates = await usableShorteners(ids);
  if (candidates.length === 0) return fail(req, "Tất cả cổng vượt link đang không dùng được.", isJson);

  const steps = Math.max(1, Math.min(kt.steps, 8));
  const token = sessionToken();
  const base = baseUrl(req);

  // Mỗi lớp trỏ về checkpoint trên server, không lồng trực tiếp:
  // lộ URL 1 lớp cũng không nhảy được lớp sau.
  const targets = Array.from({ length: steps }, (_, i) =>
    i === steps - 1 ? `${base}/key/${token}` : `${base}/hop/${token}/${i + 1}`,
  );

  const used = new Set<number>();
  const hopUrls: string[] = [];
  for (const t of targets) {
    // Cổng lỗi thì fallback đưa user về thẳng checkpoint, không bị kẹt.
    const url = await shortenWithFallback(candidates, t, t, used);
    if (!url) return fail(req, "Không tạo được link vượt. Thử lại sau.", isJson);
    hopUrls.push(url);
  }

  const ip = clientIp(req);
  await db.keySession.create({
    data: {
      token,
      keyTypeId: kt.id,
      appId: app.id,
      step: 0,
      hopUrls: JSON.stringify(hopUrls),
      stepAt: JSON.stringify([Date.now()]),
      ipHash: fingerprint(ip),
      uaHash: fingerprint(req.headers.get("user-agent") ?? ""),
      expiresAt: new Date(Date.now() + SESSION_TTL_MIN * 60_000),
    },
  });

  if (isJson) {
    return NextResponse.json({ ok: true, url: hopUrls[0], steps, appName: app.name });
  }

  return NextResponse.redirect(hopUrls[0], 302);
}
