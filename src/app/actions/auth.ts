"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  hashPassword,
  verifyUserPassword,
  verifyPassword,
  createSession,
  destroySession,
  requireUser,
  getCurrentUser,
  AuthUser,
} from "@/lib/auth";
import { clientIp, loginLockedFor, recordLoginFail, clearLoginFails } from "@/lib/guard";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

export async function registerAction(fd: FormData): Promise<ActionResult<{ role: string }>> {
  const ip = clientIp(await headers());
  const wait = await loginLockedFor(ip);
  if (wait > 0) {
    const m = Math.ceil(wait / 60);
    return { ok: false, error: `Thao tác quá nhanh. Vui lòng thử lại sau ${m} phút.` };
  }

  const username = String(fd.get("username") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const email = String(fd.get("email") ?? "").trim().toLowerCase() || null;
  const name = String(fd.get("name") ?? "").trim() || username;

  // Validation
  if (username.length < 3 || username.length > 30) {
    return { ok: false, error: "Tên đăng nhập phải từ 3 đến 30 ký tự." };
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return { ok: false, error: "Tên đăng nhập chỉ chứa chữ cái không dấu, số, gạch dưới và gạch ngang." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Địa chỉ email không hợp lệ." };
  }

  // Check unique
  const existing = await db.user.findFirst({
    where: {
      OR: [
        { username },
        ...(email ? [{ email }] : []),
      ],
    },
  });

  if (existing) {
    if (existing.username === username) {
      return { ok: false, error: "Tên đăng nhập này đã được sử dụng." };
    }
    return { ok: false, error: "Email này đã được sử dụng." };
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: {
      username,
      email,
      name,
      passwordHash,
      role: "USER",
    },
  });

  await createSession({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: "USER",
  });

  return { ok: true, data: { role: "USER" } };
}

export async function loginAction(fd: FormData): Promise<ActionResult<{ role: string; redirectUrl: string }>> {
  const ip = clientIp(await headers());
  const wait = await loginLockedFor(ip);
  if (wait > 0) {
    const m = Math.ceil(wait / 60);
    return { ok: false, error: `Sai quá nhiều lần. Thử lại sau ${m} phút.` };
  }

  const credential = String(fd.get("credential") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (!credential || !password) {
    return { ok: false, error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu." };
  }

  // 1. Kiểm tra tài khoản trong bảng User
  const user = await db.user.findFirst({
    where: {
      OR: [
        { username: credential },
        { email: credential },
      ],
    },
  });

  if (user) {
    const isMatch = await verifyUserPassword(password, user.passwordHash);
    if (!isMatch) {
      await recordLoginFail(ip);
      return { ok: false, error: "Mật khẩu không chính xác." };
    }

    await clearLoginFails(ip);
    await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role === "ADMIN" ? "ADMIN" : "USER",
    });

    const redirectUrl = user.role === "ADMIN" ? "/admin" : "/dashboard";
    return { ok: true, data: { role: user.role, redirectUrl } };
  }

  // 2. Dự phòng: Kiểm tra tài khoản quản trị viên truyền thống từ ADMIN_PASSWORD_HASH
  if (credential === "admin" || credential === "administrator") {
    const isAdminMatch = await verifyPassword(password);
    if (isAdminMatch) {
      await clearLoginFails(ip);

      // Tự động khởi tạo hoặc đồng bộ User admin trong DB nếu chưa có
      let adminUser = await db.user.findUnique({ where: { username: "admin" } });
      if (!adminUser) {
        const hash = await hashPassword(password);
        adminUser = await db.user.create({
          data: {
            username: "admin",
            name: "Quản trị viên",
            passwordHash: hash,
            role: "ADMIN",
          },
        });
      }

      await createSession({
        id: adminUser.id,
        username: adminUser.username,
        name: adminUser.name,
        role: "ADMIN",
      });

      return { ok: true, data: { role: "ADMIN", redirectUrl: "/admin" } };
    }
  }

  await recordLoginFail(ip);
  return { ok: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác." };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
}

export async function updateProfileAction(fd: FormData): Promise<ActionResult> {
  const current = await requireUser();
  const name = String(fd.get("name") ?? "").trim().slice(0, 100);
  const avatar = String(fd.get("avatar") ?? "").trim().slice(0, 500);
  const oldPassword = String(fd.get("oldPassword") ?? "");
  const newPassword = String(fd.get("newPassword") ?? "");

  const user = await db.user.findUnique({ where: { id: current.id } });
  if (!user) return { ok: false, error: "Người dùng không tồn tại." };

  const updateData: { name?: string; avatar?: string; passwordHash?: string } = {};
  if (name) updateData.name = name;
  if (avatar !== undefined) updateData.avatar = avatar;

  if (newPassword) {
    if (newPassword.length < 6) {
      return { ok: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự." };
    }
    const isOldValid = await verifyUserPassword(oldPassword, user.passwordHash);
    if (!isOldValid) {
      return { ok: false, error: "Mật khẩu hiện tại không chính xác." };
    }
    updateData.passwordHash = await hashPassword(newPassword);
  }

  const updated = await db.user.update({
    where: { id: current.id },
    data: updateData,
  });

  // Cập nhật lại session
  await createSession({
    id: updated.id,
    username: updated.username,
    email: updated.email,
    name: updated.name,
    avatar: updated.avatar,
    role: updated.role === "ADMIN" ? "ADMIN" : "USER",
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { ok: true };
}

export async function saveUserKeyAction(appName: string, key: string, expiresAt?: string | null): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Chưa đăng nhập." };

  await db.userSavedKey.create({
    data: {
      userId: user.id,
      appName: appName || "Free Fire / Key",
      key,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/dashboard/keys");
  return { ok: true };
}

export async function deleteSavedKeyAction(id: number): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Chưa đăng nhập." };

  await db.userSavedKey.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard/keys");
  revalidatePath("/dashboard");
  return { ok: true };
}

