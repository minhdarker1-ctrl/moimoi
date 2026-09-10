import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/guard";
import { signAntiBotToken } from "@/lib/crypto";
import { parseUserAgent, extractLocation } from "@/lib/user-agent";
import { SecurityScanResult } from "@/lib/anti-bot-engine";
import { cleanGpuName } from "@/lib/device-detector";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ip = clientIp(h);
    const ua = h.get("user-agent") || "";
    const location = extractLocation(h);
    const parsedUa = parseUserAgent(ua);

    let body: {
      scanResult?: SecurityScanResult;
      cfTurnstileToken?: string;
      visitorId?: string;
      deviceInput?: string;
      deviceType?: string;
      scope?: string;
    } = {};

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Dữ liệu yêu cầu không hợp lệ" }, { status: 400 });
    }

    const site = await db.site.findUnique({ where: { id: 1 } });
    const antiBotEnabled = site?.antiBotEnabled ?? true;
    const blockEmulators = site?.blockEmulators ?? true;

    // 1. Nếu Admin tắt hoàn toàn Anti-Bot
    if (!antiBotEnabled) {
      const bypassToken = signAntiBotToken({
        vid: body.visitorId || "unknown",
        ip,
        exp: Date.now() + 5 * 60 * 1000,
      });
      return NextResponse.json({ ok: true, verified: true, token: bypassToken });
    }

    // 2. Kiểm tra Cloudflare Turnstile (nếu admin bật)
    if (site?.cfTurnstileEnabled && site.cfTurnstileSecretKey) {
      const turnstileToken = body.cfTurnstileToken?.trim();
      if (!turnstileToken) {
        return NextResponse.json(
          { ok: false, error: "Vui lòng hoàn thành xác minh bảo mật Cloudflare." },
          { status: 400 }
        );
      }

      try {
        const cfFormData = new FormData();
        cfFormData.append("secret", site.cfTurnstileSecretKey);
        cfFormData.append("response", turnstileToken);
        cfFormData.append("remoteip", ip);

        const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          body: cfFormData,
        });
        const cfData = await cfRes.json();
        if (!cfData.success) {
          return NextResponse.json(
            { ok: false, error: "Xác minh Cloudflare Turnstile không thành công. Vui lòng thử lại." },
            { status: 403 }
          );
        }
      } catch (cfErr) {
        console.error("Lỗi xác minh Turnstile API:", cfErr);
      }
    }

    const scan = body.scanResult;
    if (!scan) {
      return NextResponse.json(
        { ok: false, error: "Thiếu dữ liệu phân tích môi trường trình duyệt." },
        { status: 400 }
      );
    }

    // 3. Phân tích kết quả quét bảo mật
    const isMobileUa = /android|iphone|ipad|ipod|mobile/i.test(ua);
    const desktopGpuPattern = /nvidia|geforce|amd|radeon|intel|angle|direct3d|vmware|virtualbox|vbox|llvmpipe|mesa|swiftshader/i;

    const detectedDesktopGpuOnMobile =
      isMobileUa && desktopGpuPattern.test(scan.details?.webglRenderer || "");
    const detectedWebdriver = Boolean(scan.details?.hasWebdriver || scan.isAutomation);
    const isEmulatorDetected = Boolean(scan.isEmulator || detectedDesktopGpuOnMobile);

    const shouldBlock =
      !scan.passed ||
      detectedWebdriver ||
      (blockEmulators && isEmulatorDetected);

    // 4. Xử lý vi phạm & thông tin phần cứng GPU
    const violations = [...(scan.violations || [])];
    if (detectedDesktopGpuOnMobile && !violations.some((v) => v.code === "EMU_DESKTOP_GPU")) {
      violations.unshift({
        type: "EMULATOR",
        code: "EMU_DESKTOP_GPU",
        title: "Phát hiện máy giả lập Android trên PC",
        desc: "Thiết bị di động sử dụng card đồ họa máy tính (NVIDIA/AMD/Intel).",
        severity: "CRITICAL",
      });
    }

    // Ghi lại thông tin chip đồ họa GPU để Admin tiện theo dõi cấu hình máy
    if (scan.details?.webglRenderer && !violations.some((v) => v.code === "GPU_INFO")) {
      violations.push({
        type: "HARDWARE",
        code: "GPU_INFO",
        title: "GPU",
        desc: cleanGpuName(scan.details.webglRenderer),
        severity: "LOW",
      });
    }

    // 5. GHI NHẬN TẤT CẢ THIẾT BỊ BẤM XÁC MINH VÀO NHẬT KÝ ADMIN (Cả thiết bị Hợp Lệ lẫn Bị Chặn)
    const isFreeFireScope = body.scope === "freefire" || !body.scope;
    if (isFreeFireScope) {
      try {
        const fifteenSecondsAgo = new Date(Date.now() - 15_000);
        const status = shouldBlock ? "blocked" : "verified";
        const keyTypeName = shouldBlock ? "Bị Chặn Anti-Bot" : "Đã Xác Minh";

        // Deduplication: nếu cùng visitorId hoặc IP vừa xác minh trong vòng 15 giây thì cập nhật thay vì tạo dòng trùng lặp
        const recent = await db.freeFireKeyLog.findFirst({
          where: {
            OR: [
              ...(body.visitorId && body.visitorId !== "unknown"
                ? [{ visitorId: body.visitorId, createdAt: { gte: fifteenSecondsAgo } }]
                : []),
              ...(ip ? [{ ip, createdAt: { gte: fifteenSecondsAgo } }] : []),
            ],
            status,
          },
          orderBy: { createdAt: "desc" },
        });

        if (recent) {
          await db.freeFireKeyLog.update({
            where: { id: recent.id },
            data: {
              deviceInput: body.deviceInput || recent.deviceInput,
              deviceType: body.deviceType || recent.deviceType,
              botScore: scan.botScore ?? recent.botScore,
              violations: JSON.stringify(violations),
            },
          });
        } else {
          await db.freeFireKeyLog.create({
            data: {
              visitorId: body.visitorId || "unknown",
              ip,
              device: isEmulatorDetected ? "Emulator" : parsedUa.device,
              deviceInput: body.deviceInput || (isEmulatorDetected ? "Giả lập Android" : ""),
              deviceType: body.deviceType || (isEmulatorDetected ? "pc" : ""),
              browser: parsedUa.browser,
              os: parsedUa.os,
              location,
              userAgent: ua,
              keyTypeName,
              status,
              isEmulator: isEmulatorDetected,
              botScore: scan.botScore ?? (shouldBlock ? 80 : 0),
              violations: JSON.stringify(violations),
            },
          });
        }
      } catch (dbErr) {
        console.error("Lỗi ghi log verify:", dbErr);
      }
    }

    if (shouldBlock) {
      return NextResponse.json({
        ok: false,
        blocked: true,
        isEmulator: isEmulatorDetected,
        isAutomation: detectedWebdriver,
        botScore: scan.botScore || 80,
        violations,
      });
    }

    // 6. Nếu vượt qua kiểm tra an toàn: Ký token bảo mật xác minh (hạn dùng 5 phút)
    const verificationToken = signAntiBotToken({
      vid: body.visitorId || "unknown",
      ip,
      exp: Date.now() + 5 * 60 * 1000,
    });

    return NextResponse.json({
      ok: true,
      verified: true,
      token: verificationToken,
      botScore: scan.botScore,
    });
  } catch (err: any) {
    console.error("Lỗi xác minh Anti-Bot:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
