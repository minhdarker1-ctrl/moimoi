"use server";

import { db } from "@/lib/db";
import { hashKey } from "@/lib/crypto";

export type UnlockResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Kiểm key rồi trả link tải. Link tải KHÔNG bao giờ render sẵn trong HTML —
 * chỉ trả về sau khi key hợp lệ, nên không xem được bằng View Source.
 */
export async function unlockApp(appId: number, rawKey: string): Promise<UnlockResult> {
  const key = String(rawKey ?? "");
  if (key.length < 8 || key.length > 40) return { ok: false, error: "Key không đúng định dạng." };

  const app = await db.app.findUnique({ where: { id: appId } });
  if (!app || !app.visible) return { ok: false, error: "Không tìm thấy ứng dụng." };
  if (!app.downloadUrl) return { ok: false, error: "Ứng dụng chưa có link tải." };

  const found = await db.appKey.findUnique({ where: { keyHash: hashKey(key) } });
  if (!found || found.revoked) return { ok: false, error: "Key không tồn tại hoặc đã bị thu hồi." };
  if (found.expiresAt < new Date()) return { ok: false, error: "Key đã hết hạn." };
  if (found.appId !== null && found.appId !== appId) {
    return { ok: false, error: "Key này dùng cho ứng dụng khác." };
  }
  if (found.maxUses > 0 && found.usedCount >= found.maxUses) {
    return { ok: false, error: "Key đã dùng hết số lượt." };
  }

  await db.appKey.update({ where: { id: found.id }, data: { usedCount: { increment: 1 } } });
  return { ok: true, url: app.downloadUrl };
}
