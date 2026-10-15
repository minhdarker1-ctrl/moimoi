import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { clientIp } from "@/lib/guard";
import {
  getOrCreateDailyPass,
  verifyPassPayload,
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

    const rawCookie = cookieStore.get(ONTOP_COOKIE_NAME)?.value;
    const parsedCookie = verifyPassPayload(rawCookie);

    const pass = await getOrCreateDailyPass(ip, parsedCookie.passToken);
    const today = vnDate();

    const signedToken = signPassPayload({
      passToken: pass.token,
      date: pass.date,
      count: pass.count,
      isUnlimited: pass.isUnlimited,
    });

    const response = NextResponse.json({
      success: true,
      date: pass.date,
      count: pass.count,
      target: 2,
      isUnlimited: pass.isUnlimited,
      remainingSteps: Math.max(0, 2 - pass.count),
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
