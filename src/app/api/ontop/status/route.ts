import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { clientIp } from "@/lib/guard";
import { getCurrentUser } from "@/lib/auth";
import {
  getOntopPassStatus,
  signPassPayload,
  ONTOP_COOKIE_NAME,
} from "@/lib/ontop";
import { vnDate } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const h = await headers();
    const cookieStore = await cookies();
    const ip = clientIp(h);

    const currentUser = await getCurrentUser();
    const isAdmin = currentUser?.role === "ADMIN";

    // ĐẶC QUYỀN ADMIN: Sử dụng vô hạn tất cả dịch vụ trên web mà không cần vượt link
    if (isAdmin) {
      return NextResponse.json({
        success: true,
        isAdmin: true,
        hasAccess: true,
        earnedCount: 9999,
        usedCount: 0,
        availableCredits: 9999,
        currentGateway: "VIETUSER",
        activeGatewayName: "VietUser",
        currentGatewayStep: 1,
        allGatewaysExhausted: false,
        isExhausted: false,
        target: 2,
        count: 9999,
        isUnlimited: true,
        remainingSteps: 0,
      });
    }

    const rawCookie = cookieStore.get(ONTOP_COOKIE_NAME)?.value;
    const status = await getOntopPassStatus(ip, rawCookie);
    const today = vnDate();

    const signedToken = signPassPayload({
      passToken: status.passToken || "",
      date: status.date || today,
      earnedCount: status.earnedCount,
      usedCount: status.usedCount,
      availableCredits: status.availableCredits,
    });

    const response = NextResponse.json({
      success: true,
      isAdmin: false,
      hasAccess: status.hasAccess,
      earnedCount: status.earnedCount,
      usedCount: status.usedCount,
      availableCredits: status.availableCredits,
      currentGateway: status.currentGateway,
      activeGatewayName: status.activeGatewayName,
      currentGatewayStep: status.currentGatewayStep,
      allGatewaysExhausted: status.allGatewaysExhausted,
      isExhausted: status.isExhausted,
      target: 2,
      // Tương thích ngược với các component cũ
      count: status.earnedCount,
      isUnlimited: false,
      remainingSteps: Math.max(0, 2 - status.earnedCount),
    });

    // Cập nhật cookie đồng bộ
    response.cookies.set(ONTOP_COOKIE_NAME, signedToken, {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi kiểm tra trạng thái OnTop Pass" },
      { status: 500 }
    );
  }
}
