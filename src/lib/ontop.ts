import { db } from "@/lib/db";
import { decryptToken, vnDate, sessionToken, safeEqual } from "@/lib/crypto";
import { createHmac } from "node:crypto";
import { shorten, isProvider } from "@/lib/shorteners";

const ONTOPS_API_ENDPOINT = "https://api-management.ontops.link/api/public/create-short-link";
const ONTOPS_DOMAIN = "https://ontops.link";
export const ONTOP_COOKIE_NAME = "ontop_daily_pass";

/** Trạng thái thẻ lượt trong ngày */
export type PassStatus = {
  hasAccess: boolean;         // Có ít nhất 1 credit khả dụng
  earnedCount: number;       // Số lượt đã vượt hôm nay (0, 1, 2...)
  usedCount: number;         // Số lượt đã tiêu dùng để Verify UID
  availableCredits: number;  // Math.max(0, earnedCount - usedCount)
  currentGateway: string;    // "ONTOPS" | "LINK4M" | "TRAFFICVN"...
  activeGatewayName: string; // Tên hiển thị cổng hiện tại: "OnTop" | "Link4m"
  currentGatewayStep: number;// Nấc lượt hiện tại của cổng (1 hoặc 2)
  allGatewaysExhausted: boolean; // true khi đã hết sạch mọi cổng hôm nay (count >= 4)
  isExhausted: boolean;      // Đã đạt trần 2/2 lượt OnTop trong ngày
  passToken?: string;
  date?: string;
};

/** Tính thời điểm 23:59:59 của ngày hôm nay theo giờ Việt Nam */
export function getEndOfVnDay(dateStr: string = vnDate()): Date {
  return new Date(`${dateStr}T23:59:59.999+07:00`);
}

/** Ký token pass cookie để chống giả mạo */
export function signPassPayload(data: {
  passToken: string;
  date: string;
  earnedCount: number;
  usedCount: number;
  availableCredits: number;
}): string {
  const secret = process.env.SESSION_SECRET || "moimoi-default-secret-key-min-32-chars";
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** Giải mã và xác thực token pass cookie */
export function verifyPassPayload(
  cookieVal?: string
): {
  valid: boolean;
  passToken?: string;
  date?: string;
  earnedCount?: number;
  usedCount?: number;
  availableCredits?: number;
} {
  if (!cookieVal) return { valid: false };
  const parts = cookieVal.split(".");
  if (parts.length !== 2) return { valid: false };
  const [body, sig] = parts;

  const secret = process.env.SESSION_SECRET || "moimoi-default-secret-key-min-32-chars";
  const expectedSig = createHmac("sha256", secret).update(body).digest("base64url");
  if (!safeEqual(sig, expectedSig)) return { valid: false };

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const today = vnDate();
    // Nếu token thuộc ngày cũ thì coi như hết hạn
    if (data.date !== today) return { valid: false };
    return {
      valid: true,
      passToken: data.passToken,
      date: data.date,
      earnedCount: Number(data.earnedCount ?? data.count) || 0,
      usedCount: Number(data.usedCount) || 0,
      availableCredits: Number(data.availableCredits) || 0,
    };
  } catch {
    return { valid: false };
  }
}

/** Lấy hoặc khởi tạo thẻ lượt trong ngày của người dùng */
export async function getOrCreateDailyPass(ip: string, existingPassToken?: string) {
  const today = vnDate();
  const endOfDay = getEndOfVnDay(today);

  // 1. Tìm theo existingPassToken nếu có
  if (existingPassToken) {
    const pass = await db.ontopDailyPass.findUnique({
      where: { token: existingPassToken },
    });

    if (pass) {
      if (pass.date === today) {
        return pass;
      }
      // Khác ngày -> Reset cho ngày mới
      return await db.ontopDailyPass.update({
        where: { id: pass.id },
        data: {
          date: today,
          count: 0,
          usedCount: 0,
          currentGateway: "ONTOPS",
          isUnlimited: false,
          expiresAt: endOfDay,
          ip,
        },
      });
    }
  }

  // 2. Tìm theo IP và ngày hôm nay
  const passByIp = await db.ontopDailyPass.findFirst({
    where: { ip, date: today },
    orderBy: { updatedAt: "desc" },
  });

  if (passByIp) {
    return passByIp;
  }

  // 3. Tạo mới hoàn toàn
  const newToken = sessionToken();
  return await db.ontopDailyPass.create({
    data: {
      token: newToken,
      ip,
      date: today,
      count: 0,
      usedCount: 0,
      currentGateway: "ONTOPS",
      isUnlimited: false,
      expiresAt: endOfDay,
    },
  });
}

/**
 * Tra cứu trạng thái thẻ lượt (Zero-Trust: luôn đối soát Database)
 */
export async function getOntopPassStatus(
  ip: string,
  cookieToken?: string
): Promise<PassStatus> {
  const parsed = verifyPassPayload(cookieToken);
  const pass = await getOrCreateDailyPass(ip, parsed.passToken);

  const earnedCount = pass.count;
  const usedCount = pass.usedCount;
  const availableCredits = Math.max(0, earnedCount - usedCount);
  const isExhausted = earnedCount >= 2;
  const allGatewaysExhausted = earnedCount >= 4;

  let activeGatewayName = "OnTop";
  let currentGatewayStep = earnedCount + 1; // 1 hoặc 2 cho OnTop

  if (earnedCount >= 2) {
    activeGatewayName = "Link4m";
    currentGatewayStep = (earnedCount - 2) + 1; // 1 hoặc 2 cho Link4m
  }
  if (allGatewaysExhausted) {
    currentGatewayStep = 2;
  }

  let currentGateway = pass.currentGateway;
  if (isExhausted && currentGateway === "ONTOPS") {
    currentGateway = "LINK4M";
  }

  return {
    hasAccess: availableCredits > 0,
    earnedCount,
    usedCount,
    availableCredits,
    currentGateway,
    activeGatewayName,
    currentGatewayStep,
    allGatewaysExhausted,
    isExhausted,
    passToken: pass.token,
    date: pass.date,
  };
}

/**
 * Tiêu thụ 1 credit nguyên tử (Atomic Consumption chống Race Condition & Double Spending)
 */
export async function consumeCredit(
  ip: string,
  cookieToken?: string
): Promise<{
  success: boolean;
  remainingCredits: number;
  passId: number;
  passToken: string;
  error?: string;
}> {
  const today = vnDate();
  const parsed = verifyPassPayload(cookieToken);
  const pass = await getOrCreateDailyPass(ip, parsed.passToken);

  // Atomic Update: Chỉ tăng usedCount khi count > usedCount (tức availableCredits > 0)
  const updateResult = await db.ontopDailyPass.updateMany({
    where: {
      id: pass.id,
      date: today,
      count: { gt: pass.usedCount },
    },
    data: {
      usedCount: { increment: 1 },
    },
  });

  if (updateResult.count === 0) {
    const fresh = await db.ontopDailyPass.findUnique({ where: { id: pass.id } });
    const credits = fresh ? Math.max(0, fresh.count - fresh.usedCount) : 0;
    return {
      success: false,
      remainingCredits: credits,
      passId: pass.id,
      passToken: pass.token,
      error: "Bạn chưa có lượt Verify khả dụng hoặc lượt của bạn đã được sử dụng. Vui lòng vượt link để nhận lượt mới!",
    };
  }

  const updatedPass = await db.ontopDailyPass.findUnique({ where: { id: pass.id } });
  const remaining = updatedPass ? Math.max(0, updatedPass.count - updatedPass.usedCount) : 0;

  return {
    success: true,
    remainingCredits: remaining,
    passId: pass.id,
    passToken: pass.token,
  };
}

/**
 * Hoàn lại 1 lượt (Refund) khi tác vụ Verify UID hoặc Buff Locket gặp lỗi máy chủ
 */
export async function refundCredit(passId: number): Promise<boolean> {
  try {
    const pass = await db.ontopDailyPass.findUnique({ where: { id: passId } });
    if (!pass || pass.usedCount <= 0) return false;

    await db.ontopDailyPass.update({
      where: { id: passId },
      data: {
        usedCount: { decrement: 1 },
      },
    });
    return true;
  } catch (err) {
    console.error("Lỗi hoàn trả credit pass:", err);
    return false;
  }
}

/** Kiểm tra nhanh quyền (Tương thích ngược, kiểm tra credit > 0) */
export async function checkOntopUnlimited(
  ip: string,
  cookieToken?: string
): Promise<boolean> {
  const status = await getOntopPassStatus(ip, cookieToken);
  return status.availableCredits > 0;
}

/** Lấy API key của cổng OnTop.link */
export async function getOntopApiKey(): Promise<string | null> {
  const shortener = await db.shortener.findFirst({
    where: { provider: "ONTOPS", enabled: true },
    orderBy: { order: "asc" },
  });

  if (!shortener) return null;

  try {
    return decryptToken(shortener.tokenEnc);
  } catch (e) {
    console.error("Lỗi giải mã token OnTop:", e);
    return null;
  }
}

/**
 * Tạo link vượt (Tự động chọn OnTop cho 2 lượt đầu, và Cổng 2 khi OnTop đạt 2/2)
 */
export async function createPassLink({
  service,
  baseUrl,
  passToken,
  step,
  targetUser = "",
}: {
  service: "freefire" | "locket" | "all";
  baseUrl: string;
  passToken: string;
  step: number;
  targetUser?: string;
}): Promise<{
  ok: true;
  url: string;
  pendingToken: string;
  gateway: string;
} | {
  ok: false;
  error: string;
}> {
  const pass = await db.ontopDailyPass.findUnique({ where: { token: passToken } });
  const today = vnDate();
  const earnedCount = pass && pass.date === today ? pass.count : 0;

  const pendingToken = sessionToken();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 phút TTL

  await db.ontopPendingSession.create({
    data: {
      token: pendingToken,
      passToken,
      step,
      service,
      targetUser: targetUser || "",
      used: false,
      expiresAt,
    },
  });

  const callbackUrl = `${baseUrl}/api/ontop/callback?token=${pendingToken}`;

  // Nếu chưa đạt trần 2 lượt OnTop: Ưu tiên cổng OnTop
  if (earnedCount < 2) {
    const ontopKey = await getOntopApiKey();
    if (ontopKey) {
      const apiUrl = `${ONTOPS_API_ENDPOINT}?apikey=${ontopKey}&url=${encodeURIComponent(callbackUrl)}`;
      try {
        const res = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const bodyText = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(bodyText);
        } catch {
          data = {};
        }

        if (data.id) {
          await db.shortener
            .updateMany({
              where: { provider: "ONTOPS", enabled: true },
              data: { dailyUsed: { increment: 1 } },
            })
            .catch(() => {});

          return {
            ok: true,
            url: `${ONTOPS_DOMAIN}/${data.id}`,
            pendingToken,
            gateway: "ONTOPS",
          };
        }
      } catch (err) {
        console.warn("Lỗi kết nối OnTop, thử cổng dự phòng:", err);
      }
    }
  }

  // Khi OnTop đã đủ 2/2 view HOẶC OnTop lỗi: Chuyển sang Cổng số 2 (Link4m / TrafficVN / Linktop)
  const secondaryShorteners = await db.shortener.findMany({
    where: {
      enabled: true,
      provider: { not: "ONTOPS" },
    },
    orderBy: { order: "asc" },
  });

  for (const s of secondaryShorteners) {
    if (!isProvider(s.provider)) continue;
    try {
      const token = decryptToken(s.tokenEnc);
      const url = await shorten(s.provider, token, callbackUrl, `${baseUrl}/${service}`);
      await db.shortener
        .update({
          where: { id: s.id },
          data: { dailyUsed: { increment: 1 } },
        })
        .catch(() => {});

      return {
        ok: true,
        url,
        pendingToken,
        gateway: s.name || s.provider,
      };
    } catch (err) {
      console.error(`Lỗi tạo link qua cổng dự phòng ${s.provider}:`, err);
    }
  }

  return {
    ok: false,
    error: "Hiện tại các cổng vượt link đang tạm bảo trì. Vui lòng thử lại sau giây lát!",
  };
}

/** Tương thích ngược: Alias cho createPassLink */
export const createOntopLink = createPassLink;

/** Xác minh sau khi vượt link chuyển hướng về callback */
export async function verifyOntopCallback(token: string): Promise<{
  success: boolean;
  error?: string;
  service?: string;
  targetUser?: string;
  step?: number;
  earnedCount?: number;
  usedCount?: number;
  availableCredits?: number;
  passToken?: string;
  date?: string;
}> {
  if (!token) {
    return { success: false, error: "Thiếu mã xác thực phiên vượt link." };
  }

  const pending = await db.ontopPendingSession.findUnique({
    where: { token },
  });

  if (!pending) {
    return {
      success: false,
      error: "Phiên vượt link không tồn tại hoặc đã hết hạn.",
    };
  }

  if (pending.used) {
    return {
      success: false,
      error: "Phiên vượt link này đã được xác nhận trước đó. Vui lòng bấm nhận lượt mới!",
    };
  }

  if (pending.expiresAt < new Date()) {
    return {
      success: false,
      error: "Phiên vượt link đã quá thời gian 30 phút. Vui lòng thực hiện lại!",
    };
  }

  // Đánh dấu đã dùng
  await db.ontopPendingSession.update({
    where: { id: pending.id },
    data: { used: true },
  });

  const today = vnDate();
  const pass = await db.ontopDailyPass.findUnique({
    where: { token: pending.passToken },
  });

  if (!pass) {
    return {
      success: false,
      error: "Không tìm thấy thông tin thẻ ngày của bạn.",
    };
  }

  // Tăng số lượt đã vượt
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

  // Ghi nhật ký sử dụng hệ thống
  await db.serviceUsageLog.create({
    data: {
      serviceType: "ONTOP_PASS",
      serviceName: `Link Pass (${pending.service.toUpperCase()})`,
      targetUser: pass.ip,
      ip: pass.ip,
      status: "SUCCESS",
      metadata: JSON.stringify({
        earnedCount: newEarned,
        availableCredits: newCredits,
        service: pending.service,
        gateway: nextGateway,
        date: today,
      }),
    },
  }).catch(() => {});

  return {
    success: true,
    service: pending.service,
    targetUser: pending.targetUser || "",
    step: newEarned,
    earnedCount: newEarned,
    usedCount: currentUsed,
    availableCredits: newCredits,
    passToken: pass.token,
    date: today,
  };
}
