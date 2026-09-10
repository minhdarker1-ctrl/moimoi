import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/guard";
import { signAntiBotToken } from "@/lib/crypto";
import { parseUserAgent, extractLocation } from "@/lib/user-agent";
import { SecurityScanResult } from "@/lib/anti-bot-engine";

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

    // 4. Nếu bị phát hiện vi phạm: Chặn và ghi log chi tiết
    if (shouldBlock) {
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

      if (body.scope === "freefire") {
        try {
          await db.freeFireKeyLog.create({
            data: {
              visitorId: body.visitorId || "unknown",
              ip,
              device: isEmulatorDetected ? "Emulator" : parsedUa.device,
              deviceInput: body.deviceInput || "",
              deviceType: body.deviceType || "",
              browser: parsedUa.browser,
              os: parsedUa.os,
              location,
              userAgent: ua,
              keyTypeName: "Bị Chặn Anti-Bot",
              status: "blocked",
              isEmulator: isEmulatorDetected,
              botScore: scan.botScore || 80,
              violations: JSON.stringify(violations),
            },
          });
        } catch (dbErr) {
          console.error("Lỗi ghi log block:", dbErr);
        }
      }

      return NextResponse.json({
        ok: false,
        blocked: true,
        isEmulator: isEmulatorDetected,
        isAutomation: detectedWebdriver,
        botScore: scan.botScore || 80,
        violations,
      });
    }

    // 5. Nếu vượt qua kiểm tra an toàn: Ký token bảo mật xác minh (hạn dùng 5 phút)
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
