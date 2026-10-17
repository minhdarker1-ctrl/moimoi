import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeEqual } from "@/lib/crypto";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-worker-secret",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function verifyWorkerSecret(req: Request): boolean {
  const expectedSecret =
    process.env.WORKER_SECRET || "xdarker_worker_token_2026_moimoi";

  const headerSecret = req.headers.get("x-worker-secret");
  if (headerSecret && safeEqual(headerSecret.trim(), expectedSecret.trim())) {
    return true;
  }

  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    if (safeEqual(bearerToken, expectedSecret.trim())) {
      return true;
    }
  }

  // Chấp nhận request từ localhost trong môi trường dev
  const host = req.headers.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    if (!verifyWorkerSecret(req)) {
      return NextResponse.json(
        { success: false, error: "Mã bí mật Worker không hợp lệ." },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawLinks = Array.isArray(body.links) ? body.links : [];

    if (rawLinks.length === 0) {
      return NextResponse.json(
        { success: true, count: 0, message: "Không có link nào được gửi lên." },
        { headers: corsHeaders }
      );
    }

    const validLinks: Array<{
      slotId: string;
      originalUrl: string;
      shortUrl: string;
    }> = [];

    for (const item of rawLinks) {
      const slotId = String(item.slotId || "").trim();
      const originalUrl = String(item.originalUrl || "").trim();
      const shortUrl = String(item.shortUrl || "").trim();

      if (slotId && originalUrl && shortUrl.startsWith("http")) {
        validLinks.push({ slotId, originalUrl, shortUrl });
      }
    }

    if (validLinks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu link không đúng định dạng." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert batch vào bảng OntopLinkBuffer
    let insertedCount = 0;
    for (const link of validLinks) {
      try {
        await db.ontopLinkBuffer.upsert({
          where: { slotId: link.slotId },
          create: {
            slotId: link.slotId,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            status: "AVAILABLE",
          },
          update: {
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
          },
        });
        insertedCount++;
      } catch (err) {
        console.warn(`Lỗi lưu link ${link.slotId}:`, err);
      }
    }

    const totalAvailable = await db.ontopLinkBuffer.count({
      where: { status: "AVAILABLE" },
    });

    return NextResponse.json(
      {
        success: true,
        count: insertedCount,
        totalAvailable,
        message: `Đã nạp thành công ${insertedCount} link OnTop vào khay đệm.`,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
