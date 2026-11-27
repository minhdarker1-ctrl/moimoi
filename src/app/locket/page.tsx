import type { Metadata } from "next";
import { db } from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LocketClient from "./LocketClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kích Hoạt Locket Gold Miễn Phí - MinSr",
  description:
    "Mở khóa Locket Gold 1 năm hoàn toàn miễn phí. Hỗ trợ kích hoạt qua Username, Link mời bạn bè hoặc UID 28 ký tự. Bản quyền Apple an toàn 100%.",
  keywords: [
    "locket gold",
    "kích hoạt locket gold",
    "locket gold miễn phí",
    "mod locket gold",
    "minsr",
    "dns đóng băng gold",
  ],
  openGraph: {
    title: "Kích Hoạt Locket Gold Miễn Phí - MinSr",
    description:
      "Nhận bản quyền Locket Gold 1 năm hoàn toàn miễn phí từ MinSr chỉ với 1 cú click.",
    type: "website",
    url: "/locket",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kích Hoạt Locket Gold Miễn Phí - MinSr",
    description: "Kích hoạt Locket Gold 1 năm miễn phí từ MinSr.",
  },
};

export default async function LocketPage() {
  const [site, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }).catch(() => null),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []),
  ]);

  return (
    <>
      <SiteHeader
        variant="subpage"
        pageTitle="Locket Gold"
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
      <LocketClient />
      <SiteFooter siteName={site?.name || "MinSr"} footerText={site?.footerText} />
    </>
  );
}
