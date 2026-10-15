import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { clientIp, rateLimit } from "@/lib/guard";
import {
  getOrCreateDailyPass,
  verifyPassPayload,
  createOntopLink,
  signPassPayload,
  ONTOP_COOKIE_NAME,
} from "@/lib/ontop";

export const dynamic = "force-dynamic";

function getBaseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  try {
    const h = await headers();
    const cookieStore = await cookies();
    const ip = clientIp(h);

    // Chống spam gọi API tạo link OnTop
    if (await rateLimit("ontop-start", ip, 12, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn thao tác quá nhanh. Vui lòng đợi 1 phút trước khi lấy link mới!",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const service = body.service === "locket" ? "locket" : "freefire";

    const rawCookie = cookieStore.get(ONTOP_COOKIE_NAME)?.value;
    const parsedCookie = verifyPassPayload(rawCookie);

    const pass = await getOrCreateDailyPass(ip, parsedCookie.passToken);

    // Nếu đã kích hoạt Vô Hạn hôm nay rồi thì không cần vượt tiếp
    if (pass.isUnlimited) {
      return NextResponse.json({
        success: true,
        alreadyUnlimited: true,
        message: "Bạn đã mở khóa chế độ VÔ HẠN hôm nay! Có thể sử dụng dịch vụ ngay.",
      });
    }

    const currentStep = pass.count + 1;
    const baseUrl = getBaseUrl(req);

    const result = await createOntopLink({
      service,
      baseUrl,
      passToken: pass.token,
      step: currentStep,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 502 }
      );
    }

    const signedToken = signPassPayload({
      passToken: pass.token,
      date: pass.date,
      count: pass.count,
      isUnlimited: pass.isUnlimited,
    });

    const response = NextResponse.json({
      success: true,
      redirectUrl: result.url,
      step: currentStep,
      target: 2,
    });

    response.cookies.set(ONTOP_COOKIE_NAME, signedToken, {
      path: "/",
      maxAge: 86400,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Lỗi tạo phiên vượt link OnTop.link",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
