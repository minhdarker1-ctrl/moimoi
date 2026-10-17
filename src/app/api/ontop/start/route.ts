import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { clientIp, rateLimit } from "@/lib/guard";
import {
  getOrCreateDailyPass,
  verifyPassPayload,
  createPassLink,
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

    // Chống spam gọi API tạo link
    if (await rateLimit("ontop-start", ip, 15, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn thao tác quá nhanh. Vui lòng đợi 1 phút trước khi lấy link mới!",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const reqUrl = new URL(req.url);
    const serviceParam = body.service || reqUrl.searchParams.get("service") || "freefire";
    const service = serviceParam === "locket" ? "locket" : "freefire";
    const targetUser = String(
      body.uid ||
      body.target ||
      reqUrl.searchParams.get("uid") ||
      reqUrl.searchParams.get("target") ||
      ""
    ).trim();

    const rawCookie = cookieStore.get(ONTOP_COOKIE_NAME)?.value;
    const parsedCookie = verifyPassPayload(rawCookie);

    const pass = await getOrCreateDailyPass(ip, parsedCookie.passToken);
    const availableCredits = Math.max(0, pass.count - pass.usedCount);

    const currentStep = pass.count + 1;
    const baseUrl = getBaseUrl(req);

    const result = await createPassLink({
      service,
      baseUrl,
      passToken: pass.token,
      step: currentStep,
      targetUser,
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
      earnedCount: pass.count,
      usedCount: pass.usedCount,
      availableCredits,
    });

    const response = NextResponse.json({
      success: true,
      link: result.url,
      url: result.url,
      redirectUrl: result.url,
      step: currentStep,
      gateway: result.gateway,
      earnedCount: pass.count,
      availableCredits,
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
        error: error?.message || "Lỗi tạo phiên vượt link",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
