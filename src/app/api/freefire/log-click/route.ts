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

    // Deduplication: kiểm tra xem trong vòng 15 giây qua đã có bản ghi nào từ visitorId này hoặc IP này chưa
    const fifteenSecondsAgo = new Date(Date.now() - 15_000);
    const recent = await db.freeFireKeyLog.findFirst({
      where: {
        OR: [
          ...(visitorId && visitorId !== "unknown" ? [{ visitorId, createdAt: { gte: fifteenSecondsAgo } }] : []),
          ...(ip ? [{ ip, createdAt: { gte: fifteenSecondsAgo } }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      // Đã có bản ghi vừa tạo, cập nhật nếu thiếu thông tin, không tạo trùng lặp
      const updated = await db.freeFireKeyLog.update({
        where: { id: recent.id },
        data: {
          deviceInput: deviceInput || recent.deviceInput,
          deviceType: deviceType || recent.deviceType,
          keyTypeName: recent.keyTypeName || keyTypeName,
        },
      });
      return NextResponse.json({ ok: true, id: updated.id, deduplicated: true });
    }

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
