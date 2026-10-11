import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Endpoint hàng đợi đồng bộ giữa Web và Chrome Extension / Worker tự động
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || "10")));

    const items = await db.serviceUsageLog.findMany({
      where: {
        serviceType: "FREE_FIRE",
        serviceName: { contains: "Unlock" },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        targetUser: true,
        serviceName: true,
        status: true,
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({
      success: true,
      queue: items.map((item) => {
        let meta: Record<string, unknown> = {};
        try {
          meta = JSON.parse(item.metadata || "{}");
        } catch {}
        return {
          id: item.id,
          uid: item.targetUser,
          server: meta.server || (item.serviceName.includes("Astute") ? "astute" : "kipas"),
          serverLabel: item.serviceName.includes("Astute") ? "Astute" : "FF Kipas",
          status: item.status,
          createdAt: item.createdAt,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
