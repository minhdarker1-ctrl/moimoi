import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const COOKIE = "moimoi_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

function key(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET chưa đặt hoặc ngắn hơn 32 ký tự");
  return new TextEncoder().encode(s);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  // Delay cố định làm chậm brute-force và che thời gian so sánh.
  await new Promise((r) => setTimeout(r, 300));
  return bcrypt.compare(password, hash);
}

export async function createSession(): Promise<void> {
  const jwt = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());

  (await cookies()).set(COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** Dùng trong Server Action / page. Middleware kiểm riêng vì không đọc được cookies(). */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  return verifyToken(token);
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Chặn Server Action bị gọi trực tiếp khi chưa đăng nhập. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Chưa đăng nhập");
}

export const SESSION_COOKIE = COOKIE;
