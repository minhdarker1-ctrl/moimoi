import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "moimoi_session";
export const LEGACY_COOKIE = "moimoi_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

export interface AuthUser {
  id: number;
  username: string;
  email?: string | null;
  name?: string | null;
  avatar?: string;
  role: "USER" | "ADMIN";
}

function key(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET chưa đặt hoặc ngắn hơn 32 ký tự");
  return new TextEncoder().encode(s);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyUserPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Tương thích hàm verifyPassword cũ cho admin password hash */
export async function verifyPassword(password: string, customHash?: string): Promise<boolean> {
  const hash = customHash || process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  await new Promise((r) => setTimeout(r, 200));
  return bcrypt.compare(password, hash);
}

export async function createSession(user?: Partial<AuthUser>): Promise<void> {
  const payload: AuthUser = {
    id: user?.id ?? 1,
    username: user?.username ?? "admin",
    email: user?.email ?? null,
    name: user?.name ?? "Quản trị viên",
    avatar: user?.avatar ?? "",
    role: user?.role === "USER" ? "USER" : "ADMIN",
  };

  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };

  cookieStore.set(SESSION_COOKIE, jwt, cookieOptions);
  // Đồng bộ legacy cookie nếu là ADMIN để tương thích mọi nơi
  if (payload.role === "ADMIN") {
    cookieStore.set(LEGACY_COOKIE, jwt, cookieOptions);
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(LEGACY_COOKIE);
}

export async function verifyToken(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return {
      id: Number(payload.id) || 1,
      username: String(payload.username || "user"),
      email: payload.email ? String(payload.email) : null,
      name: payload.name ? String(payload.name) : null,
      avatar: payload.avatar ? String(payload.avatar) : "",
      role: (payload.role === "ADMIN" || payload.role === "admin") ? "ADMIN" : "USER",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value || cookieStore.get(LEGACY_COOKIE)?.value;
  return verifyToken(token);
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Chưa đăng nhập");
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Không có quyền truy cập");
  return user;
}

