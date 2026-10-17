import { NextResponse } from "next/server";
import { verifyOntopCallback, signPassPayload, ONTOP_COOKIE_NAME } from "@/lib/ontop";

export const dynamic = "force-dynamic";

function getBaseUrl(req: Request): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && !env.includes("thedarker")) return env.replace(/\/$/, "");
  if (host) return `${proto}://${host}`.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`.replace(/\/$/, "");
}


export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const token = reqUrl.searchParams.get("token") || "";
  const baseUrl = getBaseUrl(req);

  if (!token) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set("m", "Thiếu mã xác nhận phiên vượt link.");
    return NextResponse.redirect(errorUrl, 302);
  }

  const result = await verifyOntopCallback(token);

  if (!result.success || !result.passToken || !result.date) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      result.error || "Xác thực phiên vượt link thất bại. Vui lòng thử lại!"
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  // Tạo URL quay lại theo service kèm số dư lượt mới
  let returnPath = "/";
  const stepNum = result.earnedCount || result.step || 1;
  const credits = result.availableCredits ?? 1;

  const targetUserParam = result.targetUser ? encodeURIComponent(result.targetUser) : "";
  if (result.service === "freefire") {
    returnPath = `/freefire?tab=unlock&ontop=success&step=${stepNum}&credits=${credits}${targetUserParam ? `&uid=${targetUserParam}` : ""}`;
  } else if (result.service === "locket") {
    returnPath = `/locket?ontop=success&step=${stepNum}&credits=${credits}${targetUserParam ? `&target=${targetUserParam}` : ""}`;
  }

  const redirectUrl = new URL(returnPath, baseUrl);
  const response = NextResponse.redirect(redirectUrl, 302);

  // Ký và lưu cookie xác nhận
  const signedCookie = signPassPayload({
    passToken: result.passToken,
    date: result.date,
    earnedCount: result.earnedCount || 1,
    usedCount: result.usedCount || 0,
    availableCredits: credits,
  });

  response.cookies.set(ONTOP_COOKIE_NAME, signedCookie, {
    path: "/",
    maxAge: 86400,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
