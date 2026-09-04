import { db } from "./db";
import { fingerprint } from "./crypto";

/** Lấy IP thật sau proxy của Vercel. */
export function clientIp(req: Request | Headers): string {
  const h = req instanceof Headers ? req : req.headers;
  const fwd = (h.get("x-forwarded-for") ?? "").split(",")[0].trim();
  return fwd || h.get("x-real-ip") || "unknown";
}

/**
 * Rate limit lưu DB. Trả true nếu bị chặn.
 * Cửa sổ trượt đơn giản: quá windowMs thì reset đếm về 1.
 */
export async function rateLimit(
  scope: string,
  ip: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const id = `${scope}:${fingerprint(ip)}`;
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowMs);

  const row = await db.rateHit.findUnique({ where: { id } });

  if (!row || row.windowAt < cutoff) {
    await db.rateHit.upsert({
      where: { id },
      update: { count: 1, windowAt: now },
      create: { id, count: 1, windowAt: now },
    });
    return false;
  }

  const updated = await db.rateHit.update({ where: { id }, data: { count: { increment: 1 } } });
  return updated.count > max;
}

/**
 * Dọn rác cơ hội: chạy kèm ~1% request thay vì cron.
 * Vercel Hobby chỉ cho cron 1 lần/ngày, mà các bảng này cần dọn thường xuyên hơn.
 * ponytail: đủ cho traffic vài nghìn/ngày; chuyển sang cron thật nếu lên Vercel Pro.
 */
export async function maybeCleanup(): Promise<void> {
  if (Math.random() > 0.01) return;
  const now = new Date();
  try {
    await Promise.all([
      db.rateHit.deleteMany({ where: { windowAt: { lt: new Date(now.getTime() - 3600_000) } } }),
      db.keySession.deleteMany({ where: { expiresAt: { lt: new Date(now.getTime() - 86400_000) } } }),
      db.loginAttempt.deleteMany({ where: { lastAt: { lt: new Date(now.getTime() - 86400_000) } } }),
    ]);
  } catch {
    // Dọn rác thất bại không được làm request chính fail.
  }
}

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60_000;

/** Còn bị khoá thì trả số giây phải chờ, không thì 0. */
export async function loginLockedFor(ip: string): Promise<number> {
  const row = await db.loginAttempt.findUnique({ where: { ipHash: fingerprint(ip) } });
  if (!row?.lockedUntil) return 0;
  const left = row.lockedUntil.getTime() - Date.now();
  return left > 0 ? Math.ceil(left / 1000) : 0;
}

/** Sai mật khẩu: tăng đếm, tới ngưỡng thì khoá. Khoá dài dần theo số lần vượt ngưỡng. */
export async function recordLoginFail(ip: string): Promise<void> {
  const ipHash = fingerprint(ip);
  const row = await db.loginAttempt.upsert({
    where: { ipHash },
    update: { fails: { increment: 1 }, lastAt: new Date() },
    create: { ipHash, fails: 1 },
  });

  if (row.fails >= MAX_FAILS) {
    // Mỗi MAX_FAILS lần sai thì thời gian khoá nhân đôi, tối đa 24h.
    const level = Math.floor(row.fails / MAX_FAILS);
    const ms = Math.min(LOCK_MS * 2 ** (level - 1), 86400_000);
    await db.loginAttempt.update({
      where: { ipHash },
      data: { lockedUntil: new Date(Date.now() + ms) },
    });
  }
}

/** Đăng nhập đúng: xoá lịch sử sai. */
export async function clearLoginFails(ip: string): Promise<void> {
  await db.loginAttempt
    .delete({ where: { ipHash: fingerprint(ip) } })
    .catch(() => {}); // chưa từng sai thì không có row
}
