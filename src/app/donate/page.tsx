import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | MinSr",
  description:
    "Ủng hộ tác giả một cốc trà đá hay ly cà phê để tiếp thêm kinh phí duy trì máy chủ, hosting và phát triển các công cụ miễn phí trên MinSr.",
  keywords: [
    "nuôi tôi",
    "donate minsr",
    "ủng hộ tác giả",
    "vietqr donate",
    "minsr donate",
    "mời cà phê",
  ],
  openGraph: {
    title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | MinSr",
    description:
      "Tiếp thêm kinh phí duy trì server và phát triển các công cụ miễn phí trên MinSr qua VietQR tiện lợi.",
    type: "website",
    url: "/donate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | MinSr",
    description: "Tiếp thêm kinh phí duy trì server và phát triển công cụ MinSr.",
  },
};

export default function DonatePage() {
  return <DonateClient />;
}
