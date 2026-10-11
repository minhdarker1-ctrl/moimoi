import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Đăng Nhập Thành Viên - MinSr",
  description: "Đăng nhập tài khoản MinSr để quản lý mã Key đã lưu, nhận xu và tham gia Vòng Quay May Mắn mỗi ngày.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#94a3b8" }}>Đang tải trang đăng nhập...</div>}>
      <LoginClient />
    </Suspense>
  );
}
