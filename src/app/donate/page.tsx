import type { Metadata } from "next";
import { db } from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";
import DonateClient from "./DonateClient";

export const revalidate = 60;

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

export default async function DonatePage() {
  const [site, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }).catch(() => null),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []),
  ]);

  return (
    <>
      <SiteHeader
        variant="subpage"
        pageTitle="Nuôi Tôi"
        siteName={site?.name || "MinSr"}
        avatarUrl={site?.avatarUrl}
        verified={site?.verified ?? true}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
      />
      <DonateClient />
    </>
  );
}
