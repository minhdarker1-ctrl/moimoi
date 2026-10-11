import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản Miễn Phí - MinSr",
  description: "Tạo tài khoản MinSr miễn phí trong 10 giây để tự động lưu mã Key sau khi vượt link, tích lũy xu và nhận vé quay may mắn.",
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#94a3b8" }}>Đang tải trang đăng ký...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
