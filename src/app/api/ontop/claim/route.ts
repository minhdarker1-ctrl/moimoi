import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  signPassPayload,
  ONTOP_COOKIE_NAME,
  getEndOfVnDay,
} from "@/lib/ontop";
import { vnDate } from "@/lib/crypto";
import { getBaseUrl } from "@/lib/serverUtils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);
  const slotId = reqUrl.searchParams.get("slot") || "";
  const baseUrl = getBaseUrl(req);

  const errorRedirect = (msg: string) => {
    const errorUrl = new URL("/key/error", baseUrl);
    errorUrl.searchParams.set("m", msg);
    return NextResponse.redirect(errorUrl, 302);
  };

  if (!slotId) {
    return errorRedirect("Thiếu mã định danh slot vượt link.");
  }

  const now = new Date();
  const today = vnDate(now);
  const endOfDay = getEndOfVnDay(today);

  const claimOutcome = await db.$transaction(async (tx) => {
    const slot = await tx.ontopLinkBuffer.findUnique({ where: { slotId } });

    if (!slot) {
      return { ok: false as const, error: "Phiên vượt link không tồn tại hoặc đã bị xóa." };
    }
    if (slot.status === "COMPLETED") {
      return { ok: false as const, error: "Phiên vượt link này đã được xác nhận trước đó. Vui lòng nhận link mới!" };
    }
    if (slot.status !== "RESERVED" || !slot.passToken) {
      return { ok: false as const, error: "Phiên vượt link chưa được kích hoạt hợp lệ. Vui lòng thử lại!" };
    }
    if (slot.expiresAt && slot.expiresAt < now) {
      return { ok: false as const, error: "Phiên vượt link đã quá thời hạn 30 phút. Vui lòng bấm nhận link mới!" };
    }

    // Atomic claim slot (chỉ request đầu tiên cập nhật được)
    const claimed = await tx.ontopLinkBuffer.updateMany({
      where: {
        id: slot.id,
        status: "RESERVED",
      },
      data: {
        status: "COMPLETED",
        completedAt: now,
      },
    });

    if (claimed.count === 0) {
      return { ok: false as const, error: "Phiên vượt link này đã được xác nhận trước đó. Vui lòng nhận link mới!" };
    }

    const updatedPasses = await tx.$queryRaw<
      Array<{ id: number; count: number; usedCount: number; token: string; ip: string }>
    >`
      UPDATE "OntopDailyPass"
      SET "count" = CASE WHEN date = ${today} THEN "count" + 1 ELSE 1 END,
          "usedCount" = CASE WHEN date = ${today} THEN "usedCount" ELSE 0 END,
          date = ${today},
          "currentGateway" = CASE WHEN (CASE WHEN date = ${today} THEN "count" + 1 ELSE 1 END) >= 2 THEN 'LINK4M' ELSE 'ONTOPS' END,
          "isUnlimited" = false,
          "expiresAt" = ${endOfDay},
          "updatedAt" = NOW()
      WHERE token = ${slot.passToken}
      RETURNING id, count, "usedCount", token, ip
    `;

    const pass = updatedPasses?.[0];
    if (!pass) {
      throw new Error("PASS_NOT_FOUND");
    }

    const newEarned = pass.count;
    const currentUsed = pass.usedCount;
    const newCredits = Math.max(0, newEarned - currentUsed);
    const service = slot.service || "freefire";

    await tx.serviceUsageLog
      .create({
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
      })
      .catch(() => {});

    return {
      ok: true as const,
      passToken: pass.token,
      newEarned,
      currentUsed,
      newCredits,
      service,
      targetUser: slot.targetUser || "",
    };
  }).catch((e) => {
    if (e instanceof Error && e.message === "PASS_NOT_FOUND") {
      return { ok: false as const, error: "Không tìm thấy thông tin thẻ ngày của bạn." };
    }
    throw e;
  });

  if (!claimOutcome.ok) {
    return errorRedirect(claimOutcome.error);
  }

  let returnPath = "/";
  const targetUserParam = claimOutcome.targetUser
    ? encodeURIComponent(claimOutcome.targetUser)
    : "";
  if (claimOutcome.service === "freefire") {
    returnPath = `/freefire?tab=unlock&ontop=success&step=${claimOutcome.newEarned}&credits=${claimOutcome.newCredits}${targetUserParam ? `&uid=${targetUserParam}` : ""}`;
  } else if (claimOutcome.service === "locket") {
    returnPath = `/locket?ontop=success&step=${claimOutcome.newEarned}&credits=${claimOutcome.newCredits}${targetUserParam ? `&target=${targetUserParam}` : ""}`;
  }

  const redirectUrl = new URL(returnPath, baseUrl);
  const response = NextResponse.redirect(redirectUrl, 302);

  const signedCookie = signPassPayload({
    passToken: claimOutcome.passToken,
    date: today,
    earnedCount: claimOutcome.newEarned,
    usedCount: claimOutcome.currentUsed,
    availableCredits: claimOutcome.newCredits,
  });

  response.cookies.set(ONTOP_COOKIE_NAME, signedCookie, {
    path: "/",
    maxAge: 86400,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
