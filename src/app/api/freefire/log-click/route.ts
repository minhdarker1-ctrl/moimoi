import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/guard";
import { parseUserAgent, extractLocation } from "@/lib/user-agent";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const h = await headers();
    const ip = clientIp(h);
    const ua = h.get("user-agent") || "";
    const location = extractLocation(h);
    const parsedUa = parseUserAgent(ua);

    let body: {
      visitorId?: string;
      deviceInput?: string;
      deviceType?: string;
      source?: string;
    } = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const visitorId = body.visitorId?.trim() || "unknown";
    const deviceInput = body.deviceInput?.trim() || "";
    const deviceType = body.deviceType?.trim() || "";

    // Tìm loại key đang áp dụng cho Free Fire
    const ffConfig = await db.freeFireConfig.findUnique({
      where: { id: 1 },
      include: { keyType: true },
    });

    const keyTypeName = ffConfig?.keyType?.name || (ffConfig?.getKeyUrl ? "Link Ngoài" : "Không có key");

    const log = await db.freeFireKeyLog.create({
      data: {
        visitorId,
        ip,
        device: parsedUa.device,
        deviceInput,
        deviceType,
        browser: parsedUa.browser,
        os: parsedUa.os,
        location,
        userAgent: ua,
        keyTypeName,
        status: "started",
      },
    });

    return NextResponse.json({ ok: true, id: log.id });
  } catch (err: any) {
    console.error("Lỗi ghi log Free Fire:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
