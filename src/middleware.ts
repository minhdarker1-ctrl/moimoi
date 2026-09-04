import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "moimoi_admin";

async function isAdmin(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const s = process.env.SESSION_SECRET;
  if (!s) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  // Chống clone: chỉ phục vụ host được khai báo. Để trống env = tắt.
  const allowed = process.env.ALLOWED_HOST;
  if (allowed && req.headers.get("host") !== allowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    if (!(await isAdmin(req.cookies.get(COOKIE)?.value))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
