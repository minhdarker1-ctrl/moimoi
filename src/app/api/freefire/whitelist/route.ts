import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * API Xuất danh sách Whitelist UID (Dành cho Admin hoặc File Mod đồng bộ)
 * Query params:
 * - port / server: "kipas" | "astute" (mặc định lấy tất cả)
 * - format: "txt" | "json" | "download"
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const portParam = (searchParams.get("port") || searchParams.get("server") || "").toLowerCase().trim();
    const format = (searchParams.get("format") || "txt").toLowerCase().trim();

    const whereClause: any = {
      serviceType: "FREE_FIRE",
      serviceName: { contains: "Unlock" },
    };

    if (portParam === "kipas") {
      whereClause.serviceName = { contains: "Kipas" };
    } else if (portParam === "astute") {
      whereClause.serviceName = { contains: "Astute" };
    }

    const logs = await db.serviceUsageLog.findMany({
      where: whereClause,
      select: {
        targetUser: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Lọc trùng lặp UID
    const uniqueUids = Array.from(
      new Set(
        logs
          .map((l) => l.targetUser.trim())
          .filter((uid) => /^\d{5,12}$/.test(uid))
      )
    );

    const portName = portParam === "astute" ? "astute" : portParam === "kipas" ? "kipas" : "all";

    // Trả về JSON nếu yêu cầu
    if (format === "json") {
      return NextResponse.json({
        success: true,
        port: portName,
        total: uniqueUids.length,
        uids: uniqueUids,
      });
    }

    // Mặc định trả về định dạng plain text (mỗi UID 1 dòng)
    const textContent = uniqueUids.join("\n");
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    };

    if (format === "download") {
      headers["Content-Disposition"] = `attachment; filename="whitelist_${portName}_${Date.now()}.txt"`;
    }

    return new NextResponse(textContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Whitelist Export API Error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi xuất danh sách whitelist." },
      { status: 500 }
    );
  }
}
