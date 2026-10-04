import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "moimoi_session";
const LEGACY_COOKIE = "moimoi_admin";

async function verifyAuth(token: string | undefined): Promise<{ role: string } | null> {
  if (!token) return null;
  const s = process.env.SESSION_SECRET;
  if (!s) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    const role = (payload.role === "ADMIN" || payload.role === "admin") ? "ADMIN" : "USER";
    return { role };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  // Chống clone: chỉ phục vụ host được khai báo. Để trống env = tắt.
  const allowed = process.env.ALLOWED_HOST;
  if (allowed && req.headers.get("host") !== allowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value || req.cookies.get(LEGACY_COOKIE)?.value;
  const auth = await verifyAuth(token);

  // Bảo vệ route /admin (yêu cầu quyền ADMIN, chưa đăng nhập chuyển về /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (auth?.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Bảo vệ route /dashboard (yêu cầu thành viên đăng nhập)
  if (pathname.startsWith("/dashboard")) {
    if (!auth) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Nếu đã đăng nhập ADMIN mà truy cập /admin/login -> chuyển thẳng vào /admin
  if (pathname === "/admin/login" && auth?.role === "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập mà cố vào /login hoặc /register
  if ((pathname === "/login" || pathname === "/register") && auth) {
    const url = req.nextUrl.clone();
    url.pathname = auth.role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

