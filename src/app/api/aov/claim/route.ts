import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import {
  AOV_TICKET_COOKIE,
  fingerprint,
  signAovTickets,
  verifyAovTickets,
} from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import { getBaseUrl } from "@/lib/serverUtils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const token = reqUrl.searchParams.get("token") || "";
  const baseUrl = getBaseUrl(req);

  const errorRedirect = (msg: string) => {
    const url = new URL("/key/error", baseUrl);
    url.searchParams.set("m", msg);
    return NextResponse.redirect(url, 302);
  };

  if (!token) {
    return errorRedirect("Thiếu mã phiên nhận vé AOV.");
  }

  const s = await db.keySession.findUnique({
    where: { token },
    include: { keyType: true },
  });

  if (!s) return errorRedirect("Phiên không tồn tại hoặc đã hết hạn.");
  if (s.expiresAt < new Date()) return errorRedirect("Phiên đã hết hạn. Vui lòng bấm nhận lại.");

  const h = await headers();
  const ip = clientIp(h);
  if (s.ipHash !== fingerprint(ip)) {
    return errorRedirect("Phiên không khớp thiết bị.");
  }

  const need = Math.max(1, Math.min(s.keyType.steps, 8)) - 1;
  if (s.step < need) {
    return errorRedirect(`Bạn chưa vượt đủ ${need + 1} bước nhiệm vụ. Vui lòng thử lại.`);
  }

  // Nếu đã claim trước đó -> chuyển về trang hiển thị trạng thái đã nhận
  if (s.doneAt) {
    return NextResponse.redirect(new URL(`/key/${encodeURIComponent(token)}?scope=aov&already=1`, baseUrl), 302);
  }

  const cookieStore = await cookies();
  const prevTickets = verifyAovTickets(cookieStore.get(AOV_TICKET_COOKIE)?.value);
  const updatedTickets = prevTickets + 1;

  const claimed = await db.$transaction(async (tx) => {
    const res = await tx.keySession.updateMany({
      where: { id: s.id, doneAt: null },
      data: { doneAt: new Date() },
    });
    if (res.count === 0) return false;

    await tx.serviceUsageLog.create({
      data: {
        serviceType: "AOV_TICKET",
        serviceName: "Nạp Vé Đấu Trường AOV",
        targetUser: ip,
        ip,
        status: "SUCCESS",
        metadata: JSON.stringify({
          ticketsAwarded: 1,
          totalTickets: updatedTickets,
        }),
      },
    });
    return true;
  });

  if (!claimed) {
    return NextResponse.redirect(new URL(`/key/${encodeURIComponent(token)}?scope=aov&already=1`, baseUrl), 302);
  }

  const response = NextResponse.redirect(
    new URL(`/key/${encodeURIComponent(token)}?scope=aov`, baseUrl),
    302
  );

  response.cookies.set(AOV_TICKET_COOKIE, signAovTickets(updatedTickets), {
    path: "/",
    maxAge: 86400 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
