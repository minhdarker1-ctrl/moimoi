import { db } from "@/lib/db";
import { decryptToken, vnDate } from "@/lib/crypto";
import { shorten, isProvider } from "@/lib/shorteners";

/** Reset quota khi sang ngày mới, rồi lọc cổng còn dùng được. */
async function usableShorteners(ids: number[]) {
  const today = vnDate();
  const rows = await db.shortener.findMany({ where: { id: { in: ids }, enabled: true } });

  // Giữ đúng thứ tự admin đặt trong KeyType.providerIds.
  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = ids.map((id) => byId.get(id)).filter((r): r is NonNullable<typeof r> => !!r);

  const out: typeof ordered = [];
  for (const s of ordered) {
    if (s.dailyDate !== today) {
      await db.shortener.update({ where: { id: s.id }, data: { dailyDate: today, dailyUsed: 0 } });
      s.dailyUsed = 0;
    }
    if (s.dailyLimit > 0 && s.dailyUsed >= s.dailyLimit) continue;
    if (!isProvider(s.provider)) continue;
    out.push(s);
  }
  return out;
}

/**
 * Rút gọn `target` bằng cổng đầu tiên chạy được, bỏ qua cổng lỗi/hết quota.
 * `used` để không dùng lại cùng 1 cổng cho 2 lớp liền nhau.
 */
export async function shortenWithFallback(
  candidates: Awaited<ReturnType<typeof usableShorteners>>,
  target: string,
  fallbackUrl: string,
  used: Set<number>,
): Promise<string | null> {
  const order = [...candidates.filter((c) => !used.has(c.id)), ...candidates.filter((c) => used.has(c.id))];

  for (const s of order) {
    if (!isProvider(s.provider)) continue;
    try {
      const url = await shorten(s.provider, decryptToken(s.tokenEnc), target, fallbackUrl);
      used.add(s.id);
      await db.shortener.update({ where: { id: s.id }, data: { dailyUsed: { increment: 1 } } });
      return url;
    } catch (err) {
      // Cổng lỗi → thử cổng kế. Không log token.
      console.error(`Cổng ${s.provider} lỗi:`, err instanceof Error ? err.message : err);
    }
  }
  return null;
}

export { usableShorteners };
