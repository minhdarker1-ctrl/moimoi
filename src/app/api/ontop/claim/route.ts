import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  signPassPayload,
  ONTOP_COOKIE_NAME,
  getEndOfVnDay,
} from "@/lib/ontop";
import { vnDate } from "@/lib/crypto";

export const dynamic = "force-dynamic";

function getBaseUrl(req: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const slotId = reqUrl.searchParams.get("slot") || "";
  const baseUrl = getBaseUrl(req);

  if (!slotId) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set("m", "Thiếu mã định danh slot vượt link.");
    return NextResponse.redirect(errorUrl, 302);
  }

  // 1. Tra cứu slot trong bảng OntopLinkBuffer
  const slot = await db.ontopLinkBuffer.findUnique({
    where: { slotId },
  });

  if (!slot) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      "Phiên vượt link không tồn tại hoặc đã bị xóa."
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  if (slot.status === "COMPLETED") {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      "Phiên vượt link này đã được xác nhận trước đó. Vui lòng nhận link mới!"
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  if (slot.status !== "RESERVED" || !slot.passToken) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      "Phiên vượt link chưa được kích hoạt hợp lệ. Vui lòng thử lại!"
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  if (slot.expiresAt && slot.expiresAt < new Date()) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      "Phiên vượt link đã quá thời hạn 30 phút. Vui lòng bấm nhận link mới!"
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  // 2. Đổi trạng thái slot thành COMPLETED
  await db.ontopLinkBuffer.update({
    where: { id: slot.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  // 3. Tra cứu thẻ ngày của người dùng
  const today = vnDate();
  const pass = await db.ontopDailyPass.findUnique({
    where: { token: slot.passToken },
  });

  if (!pass) {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set(
      "m",
      "Không tìm thấy thông tin thẻ ngày của bạn."
    );
    return NextResponse.redirect(errorUrl, 302);
  }

  // 4. Cộng +1 lượt đã vượt
  const currentEarned = pass.date === today ? pass.count : 0;
  const currentUsed = pass.date === today ? pass.usedCount : 0;
  const newEarned = currentEarned + 1;
  const newCredits = Math.max(0, newEarned - currentUsed);
  const nextGateway = newEarned >= 2 ? "LINK4M" : "ONTOPS";

  await db.ontopDailyPass.update({
    where: { id: pass.id },
    data: {
      date: today,
      count: newEarned,
      usedCount: currentUsed,
      currentGateway: nextGateway,
      isUnlimited: false,
      expiresAt: getEndOfVnDay(today),
    },
  });

  // 5. Ghi nhật ký hệ thống
  const service = slot.service || "freefire";
  await db.serviceUsageLog.create({
    data: {
      serviceType: "ONTOP_PASS",
      serviceName: `Link Pass OnTop (${service.toUpperCase()})`,
      targetUser: pass.ip,
      ip: pass.ip,
      status: "SUCCESS",
      metadata: JSON.stringify({
        slotId: slot.slotId,
        earnedCount: newEarned,
        availableCredits: newCredits,
        service,
        gateway: "ONTOPS",
        targetUser: slot.targetUser || "",
        date: today,
      }),
    },
  }).catch(() => {});

  // 6. Xây dựng URL điều hướng quay về kèm UID đã lưu
  let returnPath = "/";
  const targetUserParam = slot.targetUser ? encodeURIComponent(slot.targetUser) : "";
  if (service === "freefire") {
    returnPath = `/freefire?tab=unlock&ontop=success&step=${newEarned}&credits=${newCredits}${targetUserParam ? `&uid=${targetUserParam}` : ""}`;
  } else if (service === "locket") {
    returnPath = `/locket?ontop=success&step=${newEarned}&credits=${newCredits}${targetUserParam ? `&target=${targetUserParam}` : ""}`;
  }

  const redirectUrl = new URL(returnPath, baseUrl);
  const response = NextResponse.redirect(redirectUrl, 302);

  // 7. Ký và lưu cookie xác nhận
  const signedCookie = signPassPayload({
    passToken: pass.token,
    date: today,
    earnedCount: newEarned,
    usedCount: currentUsed,
    availableCredits: newCredits,
  });

  response.cookies.set(ONTOP_COOKIE_NAME, signedCookie, {
    path: "/",
    maxAge: 86400,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
