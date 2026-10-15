import { db } from "@/lib/db";
import { decryptToken, vnDate, sessionToken, fingerprint, safeEqual } from "@/lib/crypto";
import { createHmac } from "node:crypto";

const ONTOPS_API_ENDPOINT = "https://api-management.ontops.link/api/public/create-short-link";
const ONTOPS_DOMAIN = "https://ontops.link";
export const ONTOP_COOKIE_NAME = "ontop_daily_pass";

/** Tính thời điểm 23:59:59 của ngày hôm nay theo giờ Việt Nam */
export function getEndOfVnDay(dateStr: string = vnDate()): Date {
  return new Date(`${dateStr}T23:59:59.999+07:00`);
}

/** Ký token pass cookie để chống giả mạo */
export function signPassPayload(data: {
  passToken: string;
  date: string;
  count: number;
  isUnlimited: boolean;
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
  count?: number;
  isUnlimited?: boolean;
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
      count: Number(data.count) || 0,
      isUnlimited: Boolean(data.isUnlimited),
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
      isUnlimited: false,
      expiresAt: endOfDay,
    },
  });
}

/** Kiểm tra nhanh quyền Vô Hạn OnTop của request */
export async function checkOntopUnlimited(
  ip: string,
  cookieToken?: string
): Promise<boolean> {
  const today = vnDate();

  // Kiểm tra cookie đã ký trước để tối ưu tốc độ
  if (cookieToken) {
    const parsed = verifyPassPayload(cookieToken);
    if (parsed.valid && parsed.date === today && parsed.isUnlimited) {
      return true;
    }
  }

  // Đối soát database
  const pass = await db.ontopDailyPass.findFirst({
    where: {
      date: today,
      isUnlimited: true,
      OR: [
        ...(cookieToken ? [{ token: cookieToken }] : []),
        { ip },
      ],
    },
  });

  return Boolean(pass?.isUnlimited);
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

/** Tạo link rút gọn OnTop.link cho phiên vượt link */
export async function createOntopLink({
  service,
  baseUrl,
  passToken,
  step,
}: {
  service: "freefire" | "locket" | "all";
  baseUrl: string;
  passToken: string;
  step: number;
}): Promise<{ ok: true; url: string; pendingToken: string } | { ok: false; error: string }> {
  const apiKey = await getOntopApiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "Hệ thống chưa cấu hình hoặc cổng OnTop.link đang tạm tắt. Vui lòng liên hệ Admin!",
    };
  }

  const pendingToken = sessionToken();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 phút TTL

  await db.ontopPendingSession.create({
    data: {
      token: pendingToken,
      passToken,
      step,
      service,
      used: false,
      expiresAt,
    },
  });

  const callbackUrl = `${baseUrl}/api/ontop/callback?token=${pendingToken}`;
  const apiUrl = `${ONTOPS_API_ENDPOINT}?apikey=${apiKey}&url=${encodeURIComponent(callbackUrl)}`;

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
      return {
        ok: false,
        error: `Phản hồi từ OnTop không đúng định dạng: ${bodyText.slice(0, 100)}`,
      };
    }

    if (!data.id) {
      return {
        ok: false,
        error: data.message || data.err || data.error || "Cổng OnTop không trả về mã link rút gọn.",
      };
    }

    // Tăng dailyUsed của shortener
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
    };
  } catch (err: any) {
    return {
      ok: false,
      error: `Lỗi kết nối tới máy chủ OnTop.link: ${err?.message || String(err)}`,
    };
  }
}

/** Xác minh sau khi OnTop chuyển hướng về callback */
export async function verifyOntopCallback(token: string): Promise<{
  success: boolean;
  error?: string;
  service?: string;
  step?: number;
  isUnlimited?: boolean;
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

  // Tăng số lượt (tối đa ghi nhận 2 lượt)
  const currentCount = pass.date === today ? pass.count : 0;
  const newCount = Math.min(2, currentCount + 1);
  const isUnlimited = newCount >= 2;

  await db.ontopDailyPass.update({
    where: { id: pass.id },
    data: {
      date: today,
      count: newCount,
      isUnlimited,
      expiresAt: getEndOfVnDay(today),
    },
  });

  // Ghi nhật ký sử dụng hệ thống
  await db.serviceUsageLog.create({
    data: {
      serviceType: "ONTOP_PASS",
      serviceName: `OnTop Pass (${pending.service.toUpperCase()})`,
      targetUser: pass.ip,
      ip: pass.ip,
      status: "SUCCESS",
      metadata: JSON.stringify({
        step: newCount,
        isUnlimited,
        service: pending.service,
        date: today,
      }),
    },
  }).catch(() => {});

  return {
    success: true,
    service: pending.service,
    step: newCount,
    isUnlimited,
    passToken: pass.token,
    date: today,
  };
}
