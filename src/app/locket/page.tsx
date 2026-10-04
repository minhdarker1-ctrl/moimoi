import type { Metadata } from "next";
import LocketClient from "./LocketClient";

export const metadata: Metadata = {
  title: "Kích Hoạt Locket Gold Miễn Phí - OnCyber",
  description:
    "Mở khóa Locket Gold 1 năm hoàn toàn miễn phí. Hỗ trợ kích hoạt qua Username, Link mời bạn bè hoặc UID 28 ký tự. Bản quyền Apple an toàn 100%.",
  keywords: [
    "locket gold",
    "kích hoạt locket gold",
    "locket gold miễn phí",
    "mod locket gold",
    "oncyber",
    "dns đóng băng gold",
  ],
  openGraph: {
    title: "Kích Hoạt Locket Gold Miễn Phí - OnCyber",
    description:
      "Nhận bản quyền Locket Gold 1 năm hoàn toàn miễn phí từ OnCyber chỉ với 1 cú click.",
    type: "website",
    url: "/locket",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kích Hoạt Locket Gold Miễn Phí - OnCyber",
    description: "Kích hoạt Locket Gold 1 năm miễn phí từ OnCyber.",
  },
};

export default function LocketPage() {
  return <LocketClient />;
}
