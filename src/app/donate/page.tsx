import type { Metadata } from "next";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | OnCyber",
  description:
    "Ủng hộ tác giả một cốc trà đá hay ly cà phê để tiếp thêm kinh phí duy trì máy chủ, hosting và phát triển các công cụ miễn phí trên OnCyber.",
  keywords: [
    "nuôi tôi",
    "donate oncyber",
    "ủng hộ tác giả",
    "vietqr donate",
    "oncyber donate",
    "mời cà phê",
  ],
  openGraph: {
    title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | OnCyber",
    description:
      "Tiếp thêm kinh phí duy trì server và phát triển các công cụ miễn phí trên OnCyber qua VietQR tiện lợi.",
    type: "website",
    url: "/donate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuôi Tôi - Dự Án Donate & Ủng Hộ Tác Giả | OnCyber",
    description: "Tiếp thêm kinh phí duy trì server và phát triển công cụ OnCyber.",
  },
};

export default function DonatePage() {
  return <DonateClient />;
}
