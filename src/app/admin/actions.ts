"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { requireAdmin, createSession, destroySession, verifyPassword } from "@/lib/auth";
import { encryptToken, generateKey, hashKey } from "@/lib/crypto";
import { clientIp, loginLockedFor, recordLoginFail, clearLoginFails } from "@/lib/guard";
import { isProvider } from "@/lib/shorteners";

/* ---------- helpers ---------- */

function str(fd: FormData, k: string, max = 500): string {
  return String(fd.get(k) ?? "").trim().slice(0, max);
}

function num(fd: FormData, k: string, def = 0): number {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : def;
}

function bool(fd: FormData, k: string): boolean {
  return fd.get(k) === "on" || fd.get(k) === "true";
}

/** Chỉ nhận http(s) — chặn javascript: và data: lọt vào href. */
function url(fd: FormData, k: string): string {
  const v = str(fd, k, 2000);
  if (!v) return "";
  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

/** Mỗi dòng 1 URL -> mảng JSON. */
function urlList(fd: FormData, k: string): string {
  const lines = String(fd.get(k) ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12)
    .filter((s) => {
      try {
        const u = new URL(s);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    });
  return JSON.stringify(lines);
}

function refresh(path: string) {
  revalidatePath("/");
  revalidatePath(path);
}

/* ---------- auth ---------- */

export async function login(fd: FormData): Promise<{ error: string } | void> {
  const ip = clientIp(await headers());

  const wait = await loginLockedFor(ip);
  if (wait > 0) {
    const m = Math.ceil(wait / 60);
    return { error: `Sai quá nhiều lần. Thử lại sau ${m} phút.` };
  }

  const pw = String(fd.get("password") ?? "");
  if (!(await verifyPassword(pw))) {
    await recordLoginFail(ip);
    return { error: "Mật khẩu không đúng." };
  }

  await clearLoginFails(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- site ---------- */

export async function saveSite(fd: FormData) {
  await requireAdmin();
  const lines = String(fd.get("typedLines") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  const data = {
    name: str(fd, "name", 80),
    iam: str(fd, "iam", 40),
    verified: bool(fd, "verified"),
    avatarUrl: url(fd, "avatarUrl"),
    avatarFrameUrl: url(fd, "avatarFrameUrl"),
    typedLines: JSON.stringify(lines),
    seoTitle: str(fd, "seoTitle", 120),
    seoDescription: str(fd, "seoDescription", 300),
    seoKeywords: str(fd, "seoKeywords", 200),
    ogImageUrl: url(fd, "ogImageUrl"),
    faviconUrl: url(fd, "faviconUrl"),
    ytChannelUrl: url(fd, "ytChannelUrl"),
    ytBannerOn: bool(fd, "ytBannerOn"),
    footerText: str(fd, "footerText", 200),
  };

  await db.site.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  refresh("/admin/site");
}

/* ---------- social ---------- */

export async function saveSocial(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const data = {
    iconUrl: url(fd, "iconUrl"),
    url: url(fd, "url"),
    order: num(fd, "order"),
    visible: bool(fd, "visible"),
  };
  if (!data.url) return;
  if (id > 0) await db.social.update({ where: { id }, data });
  else await db.social.create({ data });
  refresh("/admin/socials");
}

export async function deleteSocial(fd: FormData) {
  await requireAdmin();
  await db.social.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/socials");
}

/* ---------- linkbox ---------- */

export async function saveLinkBox(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const data = {
    title: str(fd, "title", 80),
    subtitle: str(fd, "subtitle", 120),
    iconUrl: url(fd, "iconUrl"),
    url: url(fd, "url"),
    order: num(fd, "order"),
    visible: bool(fd, "visible"),
  };
  if (!data.title || !data.url) return;
  if (id > 0) await db.linkBox.update({ where: { id }, data });
  else await db.linkBox.create({ data });
  refresh("/admin/linkboxes");
}

export async function deleteLinkBox(fd: FormData) {
  await requireAdmin();
  await db.linkBox.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/linkboxes");
}

/* ---------- group ---------- */

export async function saveGroup(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const data = {
    title: str(fd, "title", 60),
    order: num(fd, "order"),
    visible: bool(fd, "visible"),
  };
  if (!data.title) return;
  if (id > 0) await db.group.update({ where: { id }, data });
  else await db.group.create({ data });
  refresh("/admin/groups");
}

export async function deleteGroup(fd: FormData) {
  await requireAdmin();
  // Xoá nhóm là xoá cả app trong nhóm (onDelete: Cascade).
  await db.group.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/groups");
}

/* ---------- app ---------- */

export async function saveApp(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const platforms: string[] = [];
  if (bool(fd, "ios")) platforms.push("ios");
  if (bool(fd, "android")) platforms.push("android");

  const keyTypeId = num(fd, "keyTypeId");
  const data = {
    groupId: num(fd, "groupId"),
    name: str(fd, "name", 100),
    desc: str(fd, "desc", 200),
    iconUrl: url(fd, "iconUrl"),
    bannerUrl: url(fd, "bannerUrl"),
    previewUrls: urlList(fd, "previewUrls"),
    platforms: JSON.stringify(platforms),
    downloadUrl: url(fd, "downloadUrl"),
    getKeyUrl: url(fd, "getKeyUrl"),
    keyTypeId: keyTypeId > 0 ? keyTypeId : null,
    order: num(fd, "order"),
    visible: bool(fd, "visible"),
  };
  if (!data.name || !data.groupId) return;
  if (id > 0) await db.app.update({ where: { id }, data });
  else await db.app.create({ data });
  refresh("/admin/apps");
}

export async function deleteApp(fd: FormData) {
  await requireAdmin();
  await db.app.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/apps");
}

/* ---------- notice ---------- */

export async function saveNotice(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const data = {
    title: str(fd, "title", 120),
    body: str(fd, "body", 2000),
    visible: bool(fd, "visible"),
  };
  if (!data.title) return;
  if (id > 0) await db.notice.update({ where: { id }, data });
  else await db.notice.create({ data });
  refresh("/admin/notices");
}

export async function deleteNotice(fd: FormData) {
  await requireAdmin();
  await db.notice.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/notices");
}

/* ---------- shortener ---------- */

export async function saveShortener(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const provider = str(fd, "provider", 20);
  if (!isProvider(provider)) return;

  const token = str(fd, "token", 200);
  const base = {
    name: str(fd, "name", 60) || provider,
    provider,
    enabled: bool(fd, "enabled"),
    order: num(fd, "order"),
    dailyLimit: num(fd, "dailyLimit"),
  };

  if (id > 0) {
    // Token trống = giữ token cũ, không xoá.
    await db.shortener.update({
      where: { id },
      data: token
        ? { ...base, tokenEnc: encryptToken(token), tokenHint: token.slice(-4) }
        : base,
    });
  } else {
    if (!token) return;
    await db.shortener.create({
      data: { ...base, tokenEnc: encryptToken(token), tokenHint: token.slice(-4) },
    });
  }
  refresh("/admin/shorteners");
}

export async function deleteShortener(fd: FormData) {
  await requireAdmin();
  await db.shortener.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/shorteners");
}

/* ---------- keytype ---------- */

export async function saveKeyType(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");

  // Thứ tự cổng: danh sách id cách nhau bằng dấu phẩy, theo đúng thứ tự vượt.
  const ids = str(fd, "providerIds", 200)
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 8);

  const data = {
    name: str(fd, "name", 60),
    steps: Math.max(1, Math.min(num(fd, "steps", 2), 8)),
    providerIds: JSON.stringify(ids),
    ttlHours: Math.max(1, Math.min(num(fd, "ttlHours", 24), 24 * 365)),
    minSeconds: Math.max(0, Math.min(num(fd, "minSeconds", 8), 120)),
    maxUses: Math.max(0, Math.min(num(fd, "maxUses", 1), 1000)),
    enabled: bool(fd, "enabled"),
  };
  if (!data.name) return;
  if (id > 0) await db.keyType.update({ where: { id }, data });
  else await db.keyType.create({ data });
  refresh("/admin/keytypes");
}

export async function deleteKeyType(fd: FormData) {
  await requireAdmin();
  await db.keyType.delete({ where: { id: num(fd, "id") } });
  refresh("/admin/keytypes");
}

/* ---------- key ---------- */

/** Tạo key thủ công. Plaintext chỉ trả về đây, không lưu DB. */
export async function createManualKey(fd: FormData): Promise<{ key: string } | { error: string }> {
  await requireAdmin();
  const keyTypeId = num(fd, "keyTypeId");
  const kt = await db.keyType.findUnique({ where: { id: keyTypeId } });
  if (!kt) return { error: "Chưa chọn loại key." };

  const appIdRaw = num(fd, "appId");
  const plain = generateKey();
  const hours = num(fd, "ttlHours", kt.ttlHours) || kt.ttlHours;

  await db.appKey.create({
    data: {
      keyHash: hashKey(plain),
      prefix: plain.slice(0, 4),
      keyTypeId: kt.id,
      appId: appIdRaw > 0 ? appIdRaw : null,
      expiresAt: new Date(Date.now() + hours * 3600_000),
      maxUses: Math.max(0, num(fd, "maxUses", kt.maxUses)),
      manual: true,
      note: str(fd, "note", 200),
    },
  });

  revalidatePath("/admin/keys");
  return { key: plain };
}

export async function revokeKey(fd: FormData) {
  await requireAdmin();
  await db.appKey.update({ where: { id: num(fd, "id") }, data: { revoked: true } });
  revalidatePath("/admin/keys");
}

export async function deleteKey(fd: FormData) {
  await requireAdmin();
  await db.appKey.delete({ where: { id: num(fd, "id") } });
  revalidatePath("/admin/keys");
}

export async function purgeExpiredKeys() {
  await requireAdmin();
  await db.appKey.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  revalidatePath("/admin/keys");
}
