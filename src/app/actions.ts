"use server";

import { db } from "@/lib/db";
import { hashKey } from "@/lib/crypto";

export type UnlockResult =
  | {
      ok: true;
      url: string;
      remainingUses?: number | null;
      maxUses?: number;
      usedCount?: number;
      expiresAt?: string;
    }
  | { ok: false; error: string };

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
  if (found.expiresAt < new Date()) {
    return { ok: false, error: "Key đã hết hạn sử dụng (quá thời hạn TTL)." };
  }
  if (found.appId !== null && found.appId !== appId) {
    return { ok: false, error: "Key này dùng cho ứng dụng khác." };
  }
  if (found.maxUses > 0 && found.usedCount >= found.maxUses) {
    return { ok: false, error: `Key đã hết lượt sử dụng (${found.usedCount}/${found.maxUses} lượt).` };
  }

  const updated = await db.appKey.update({
    where: { id: found.id },
    data: { usedCount: { increment: 1 } },
  });
  const remaining = updated.maxUses > 0 ? Math.max(0, updated.maxUses - updated.usedCount) : null;

  return {
    ok: true,
    url: app.downloadUrl,
    remainingUses: remaining,
    maxUses: updated.maxUses,
    usedCount: updated.usedCount,
    expiresAt: updated.expiresAt.toISOString(),
  };
}

export type VerifyFreeFireResult =
  | {
      ok: true;
      remainingUses?: number | null;
      maxUses?: number;
      usedCount?: number;
      expiresAt?: string;
    }
  | { ok: false; error: string };

/**
 * Kiểm tra mã Key mở khóa kết quả Free Fire.
 * Áp dụng cơ chế chạy song song giữa Thời hạn (TTL) và Số lượt sử dụng (maxUses):
 * - Hết thời hạn TTL -> Key die
 * - Dùng đủ số lượt sử dụng -> Key die
 * (Điều kiện nào đến trước sẽ áp dụng trước, không lưu key trên browser)
 */
export async function verifyFreeFireKey(rawKey: string): Promise<VerifyFreeFireResult> {
  const key = String(rawKey ?? "").trim();
  if (!key) return { ok: false, error: "Vui lòng nhập mã Key." };

  const config = await db.freeFireConfig.findUnique({ where: { id: 1 } });
  if (!config || !config.requireKey) {
    return { ok: true, maxUses: 0, usedCount: 1, remainingUses: null };
  }

  // 1. Kiểm tra Key tĩnh / Mật khẩu truy cập nhanh nếu admin có cấu hình
  if (config.staticKey && config.staticKey.trim()) {
    if (key.toLowerCase() === config.staticKey.trim().toLowerCase()) {
      return { ok: true, maxUses: 0, usedCount: 1, remainingUses: null };
    }
  }

  // 2. Kiểm tra trong hệ thống AppKey nếu admin chọn KeyType
  if (config.keyTypeId) {
    const found = await db.appKey.findUnique({ where: { keyHash: hashKey(key) } });
    if (found) {
      if (found.revoked) return { ok: false, error: "Key này đã bị thu hồi." };
      if (found.keyTypeId !== config.keyTypeId) {
        return { ok: false, error: "Key này không hợp lệ cho phần Free Fire." };
      }
      if (found.expiresAt < new Date()) {
        return { ok: false, error: "Key này đã hết hạn sử dụng (quá thời hạn TTL)." };
      }
      if (found.maxUses > 0 && found.usedCount >= found.maxUses) {
        return { ok: false, error: `Key này đã hết số lượt sử dụng (${found.usedCount}/${found.maxUses} lượt).` };
      }

      const updated = await db.appKey.update({
        where: { id: found.id },
        data: { usedCount: { increment: 1 } },
      });
      const remaining = updated.maxUses > 0 ? Math.max(0, updated.maxUses - updated.usedCount) : null;

      return {
        ok: true,
        remainingUses: remaining,
        maxUses: updated.maxUses,
        usedCount: updated.usedCount,
        expiresAt: updated.expiresAt.toISOString(),
      };
    }
  }

  return { ok: false, error: "Mã Key không chính xác hoặc không tồn tại." };
}
