import { NextResponse } from "next/server";
import { verifyOntopCallback, signPassPayload, ONTOP_COOKIE_NAME } from "@/lib/ontop";

export const dynamic = "force-dynamic";

function getBaseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const token = reqUrl.searchParams.get("token") || "";
  const baseUrl = getBaseUrl(req);

  if (!token) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set("m", "Thiếu mã xác nhận phiên vượt link OnTop.");
    return NextResponse.redirect(errorUrl, 302);
  }

  const result = await verifyOntopCallback(token);

  if (!result.success || !result.passToken || !result.date) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      result.error || "Xác thực phiên vượt link OnTop thất bại. Vui lòng thử lại!"
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  // Tạo URL quay lại theo service
  let returnPath = "/";
  if (result.service === "freefire") {
    returnPath = `/freefire?tab=unlock&ontop=success&step=${result.step}&unlimited=${result.isUnlimited ? "1" : "0"}`;
  } else if (result.service === "locket") {
    returnPath = `/locket?ontop=success&step=${result.step}&unlimited=${result.isUnlimited ? "1" : "0"}`;
  }

  const redirectUrl = new URL(returnPath, baseUrl);
  const response = NextResponse.redirect(redirectUrl, 302);

  // Ký và lưu cookie xác nhận
  const signedCookie = signPassPayload({
    passToken: result.passToken,
    date: result.date,
    count: result.step || 1,
    isUnlimited: Boolean(result.isUnlimited),
  });

  response.cookies.set(ONTOP_COOKIE_NAME, signedCookie, {
    path: "/",
    maxAge: 86400,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
