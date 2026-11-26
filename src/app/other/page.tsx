import type { Metadata } from "next";
import { db } from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";
import OtherPageClient from "@/components/other/OtherPageClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Trắc Nghiệm Ôn Tập & Ứng Dụng Khác - OTHER | MinSr",
    description: "Ngân hàng 335 câu hỏi trắc nghiệm ôn tập Cơ khí & Công nghệ kim loại bám sát 100% đề cương Canvas cùng các tiện ích từ MinSr.",
  };
}

export default async function OtherPage() {
  const [site, groups, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.group.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { apps: { where: { visible: true }, orderBy: { order: "asc" } } },
    }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  if (!site) return null;

  const otherGroup = groups.find(
    (g) => g.title.toLowerCase().includes("other") || g.slug === "other"
  );
  const otherGroupId = otherGroup ? otherGroup.id : 3;

  return (
    <>
      <SiteHeader
        variant="subpage"
        pageTitle="Other & Quiz"
        siteName={site.name}
        avatarUrl={site.avatarUrl}
        verified={site.verified}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
      />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "76px 16px 60px" }}>

        {/* Tabs và Nội dung: Quiz Master + Kho Công Cụ */}
        <OtherPageClient
          groups={groups}
          otherGroupId={otherGroupId}
        />

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
