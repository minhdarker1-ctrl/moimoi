import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";

  // Bỏ qua kiểm tra auth nếu đang ở trang đăng nhập admin
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  // Kiểm tra quyền ADMIN đối với tất cả các trang /admin còn lại
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login" + (pathname ? `?redirect=${encodeURIComponent(pathname)}` : ""));
  }

  return <>{children}</>;
}
