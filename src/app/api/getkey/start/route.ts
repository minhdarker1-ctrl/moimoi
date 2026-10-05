import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fingerprint, sessionToken, verifyAntiBotToken } from "@/lib/crypto";
import { shortenWithFallback, usableShorteners } from "@/lib/getkey";
import { clientIp, rateLimit, maybeCleanup } from "@/lib/guard";
import { parseUserAgent, extractLocation } from "@/lib/user-agent";

const SESSION_TTL_MIN = 30;
export const maxDuration = 30;
export const dynamic = "force-dynamic";

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
  const isJson =
    reqUrl.searchParams.get("format") === "json" ||
    req.headers.get("accept")?.includes("application/json") ||
    req.headers.get("content-type")?.includes("application/json") ||
    false;

  // Mỗi lần bấm tạo N link thật trên cổng rút gọn, đốt quota.
  // Không giới hạn thì spam F5 là hết 1000 link/ngày của Ontops.
  if (await rateLimit("getkey", clientIp(req), 10, 60_000)) {
    return fail(req, "Bạn bấm quá nhiều lần. Chờ 1 phút rồi thử lại.", isJson);
  }
  await maybeCleanup();

  const appIdParam = reqUrl.searchParams.get("appId");
  const keyTypeIdParam = reqUrl.searchParams.get("keyTypeId");
  const scope = reqUrl.searchParams.get("scope");
  const vid = reqUrl.searchParams.get("vid") || reqUrl.searchParams.get("visitorId") || "";
  const deviceInput = reqUrl.searchParams.get("device") || "";
  const deviceType = reqUrl.searchParams.get("type") || "";

  // Chỉ yêu cầu xác minh Anti-Bot & thiết bị cho riêng trang Free Fire
  if (scope === "freefire") {
    const site = await db.site.findUnique({ where: { id: 1 } });
    if (site?.antiBotEnabled) {
      const botToken =
        reqUrl.searchParams.get("botToken") ||
        req.headers.get("x-antibot-token") ||
        "";
      const verified = verifyAntiBotToken(botToken);
      if (!verified.valid) {
        return fail(
          req,
          `Yêu cầu xác minh bảo mật chống bot / giả lập (${verified.error || "Mã không hợp lệ"}).`,
          isJson
        );
      }
    }
  }

  let kt = null;
  let app = null;

  if (scope === "freefire") {
    const ffConfig = await db.freeFireConfig.findUnique({ where: { id: 1 }, include: { keyType: true } });
    if (ffConfig?.getKeyUrl && (!ffConfig.keyTypeId || ffConfig.keyTypeId <= 0)) {
      try {
        const ua = req.headers.get("user-agent") || "";
        const parsedUa = parseUserAgent(ua);
        const loc = extractLocation(req.headers);
        const client_ip = clientIp(req);
        const fifteenSecondsAgo = new Date(Date.now() - 15_000);

        const recent = await db.freeFireKeyLog.findFirst({
          where: {
            OR: [
              ...(vid && vid !== "unknown" ? [{ visitorId: vid, createdAt: { gte: fifteenSecondsAgo } }] : []),
              ...(client_ip ? [{ ip: client_ip, createdAt: { gte: fifteenSecondsAgo } }] : []),
            ],
            status: "started",
          },
          orderBy: { createdAt: "desc" },
        });

        if (recent) {
          await db.freeFireKeyLog.update({
            where: { id: recent.id },
            data: {
              deviceInput: deviceInput || recent.deviceInput,
              deviceType: deviceType || recent.deviceType,
              keyTypeName: "Link Ngoài",
              status: "started",
            },
          });
        } else {
          await db.freeFireKeyLog.create({
            data: {
              visitorId: vid || "unknown",
              ip: client_ip,
              device: parsedUa.device,
              deviceInput,
              deviceType,
              browser: parsedUa.browser,
              os: parsedUa.os,
              location: loc,
              userAgent: ua,
              keyTypeName: "Link Ngoài",
              status: "started",
            },
          });
        }
      } catch (e) {
        console.error("Lỗi ghi log Free Fire external:", e);
      }
      if (isJson) {
        return NextResponse.json({ ok: true, url: ffConfig.getKeyUrl, appName: "Độ Nhạy Free Fire" });
      }
      return NextResponse.redirect(ffConfig.getKeyUrl, 302);
    }
    if (!ffConfig?.keyType?.enabled) return fail(req, "Chưa cấu hình cổng vượt link API bên thứ 3 cho Free Fire.", isJson);
    kt = ffConfig.keyType;
  } else if (scope === "aov" || scope === "lienquan") {
    const aovConfig = await db.aovConfig.findUnique({ where: { id: 1 }, include: { keyType: true } });
    const availableCount = await db.gameAccount.count({ where: { game: "AOV", status: "AVAILABLE" } });
    if (availableCount <= 0) {
      return fail(req, "Kho tài khoản Liên Quân hiện đang tạm hết. Admin đang nạp thêm, bạn vui lòng quay lại sau ít phút!", isJson);
    }
    if (aovConfig?.getKeyUrl && (!aovConfig.keyTypeId || aovConfig.keyTypeId <= 0)) {
      if (isJson) {
        return NextResponse.json({ ok: true, url: aovConfig.getKeyUrl, appName: "Tặng Nick Liên Quân" });
      }
      return NextResponse.redirect(aovConfig.getKeyUrl, 302);
    }
    if (aovConfig?.keyType?.enabled) {
      kt = aovConfig.keyType;
    } else {
      kt = await db.keyType.findFirst({ where: { enabled: true } });
    }
    if (!kt) return fail(req, "Chưa cấu hình cổng vượt link cho dịch vụ tặng nick Liên Quân.", isJson);
  } else if (keyTypeIdParam && Number.isInteger(Number(keyTypeIdParam))) {
    kt = await db.keyType.findUnique({ where: { id: Number(keyTypeIdParam) } });
    if (!kt?.enabled) return fail(req, "Loại key không hợp lệ hoặc đã bị tắt.", isJson);
  } else {
    const appId = Number(appIdParam);
    if (!Number.isInteger(appId) || appId <= 0) return fail(req, "Thiếu mã ứng dụng.", isJson);
    app = await db.app.findUnique({ where: { id: appId }, include: { keyType: true } });
    if (!app?.visible || !app.keyType?.enabled) return fail(req, "Ứng dụng không dùng hệ thống key.", isJson);
    kt = app.keyType;
  }
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

  const isAov = scope === "aov" || scope === "lienquan";
  const finalDest = isAov ? `${base}/key/${token}?scope=aov` : `${base}/key/${token}`;
  const targets = Array.from({ length: steps }, (_, i) =>
    i === steps - 1 ? finalDest : `${base}/hop/${token}/${i + 1}`,
  );

  const used = new Set<number>();
  const hopUrls: string[] = [];
  for (const t of targets) {
    // Cổng lỗi thì fallback đưa user về thẳng checkpoint, không bị kẹt.
    const res = await shortenWithFallback(candidates, t, t, used);
    if (!res.ok) return fail(req, `Không tạo được link vượt (${res.error}).`, isJson);
    hopUrls.push(res.url);
  }

  const ip = clientIp(req);
  await db.keySession.create({
    data: {
      token,
      keyTypeId: kt.id,
      appId: app ? app.id : null,
      step: 0,
      hopUrls: JSON.stringify(hopUrls),
      stepAt: JSON.stringify([Date.now()]),
      ipHash: fingerprint(ip),
      uaHash: fingerprint(req.headers.get("user-agent") ?? ""),
      expiresAt: new Date(Date.now() + SESSION_TTL_MIN * 60_000),
    },
  });

  if (scope === "freefire") {
    try {
      const ua = req.headers.get("user-agent") || "";
      const parsedUa = parseUserAgent(ua);
      const loc = extractLocation(req.headers);
      const fifteenSecondsAgo = new Date(Date.now() - 15_000);

      const recent = await db.freeFireKeyLog.findFirst({
        where: {
          OR: [
            ...(vid && vid !== "unknown" ? [{ visitorId: vid, createdAt: { gte: fifteenSecondsAgo } }] : []),
            ...(ip ? [{ ip, createdAt: { gte: fifteenSecondsAgo } }] : []),
          ],
          status: "started",
        },
        orderBy: { createdAt: "desc" },
      });

      if (recent) {
        await db.freeFireKeyLog.update({
          where: { id: recent.id },
          data: {
            token: token || recent.token,
            keyTypeName: kt.name || recent.keyTypeName,
            deviceInput: deviceInput || recent.deviceInput,
            deviceType: deviceType || recent.deviceType,
            status: "started",
          },
        });
      } else {
        await db.freeFireKeyLog.create({
          data: {
            visitorId: vid || "unknown",
            ip,
            device: parsedUa.device,
            deviceInput,
            deviceType,
            browser: parsedUa.browser,
            os: parsedUa.os,
            location: loc,
            userAgent: ua,
            keyTypeName: kt.name,
            token,
            status: "started",
          },
        });
      }
    } catch (e) {
      console.error("Lỗi ghi log Free Fire session:", e);
    }
  }

  try {
    const sType = scope === "freefire"
      ? "FREE_FIRE"
      : (isAov || app?.name?.toLowerCase().includes("liên quân") || app?.name?.toLowerCase().includes("aov"))
      ? "AOV"
      : "OTHER";
    const sName = app ? app.name : (scope === "freefire" ? "Free Fire Tool" : (isAov ? "Tặng Nick Liên Quân" : kt.name));
    const uaStr = req.headers.get("user-agent") || "";
    const parsedUa = parseUserAgent(uaStr);

    await db.serviceUsageLog.create({
      data: {
        serviceType: sType,
        serviceName: sName,
        targetUser: deviceInput || vid || ip,
        ip,
        device: `${parsedUa.device} (${parsedUa.os || "Unknown"})`,
        status: "SUCCESS",
        metadata: JSON.stringify({ token, keyTypeName: kt.name, appId: app?.id }),
      },
    }).catch(() => {});
  } catch {}

  if (isJson) {
    return NextResponse.json({
      ok: true,
      url: hopUrls[0],
      firstHopUrl: hopUrls[0],
      steps,
      appName: isAov ? "Tặng Nick Liên Quân Miễn Phí" : (app ? app.name : (scope === "freefire" ? "Độ Nhạy Free Fire" : kt.name)),
    });
  }

  return NextResponse.redirect(hopUrls[0], 302);
}

export const POST = GET;
