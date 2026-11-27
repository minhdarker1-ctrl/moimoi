import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";
import AppCatalog from "@/components/AppCatalog";
import FreeFireHub from "@/components/FreeFireHub";

export const revalidate = 900; // 15 phút

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await db.group.findFirst({
    where: { slug, visible: true },
  });

  if (!group) return { title: "Không tìm thấy trang | MinSr" };

  return {
    title: `${group.title} | MinSr`,
    description: group.desc || `Khám phá các sản phẩm và công cụ thuộc mảng ${group.title} tại MinSr.`,
  };
}

export default async function DynamicGroupPage({ params }: PageProps) {
  const { slug } = await params;

  // Lấy dữ liệu group theo slug
  const [site, groups, notices, ffConfig] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.group.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { apps: { where: { visible: true }, orderBy: { order: "asc" } } },
    }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 10 }),
    db.freeFireConfig.findUnique({ where: { id: 1 } }),
  ]);

  if (!site) return null;

  const currentGroup = groups.find((g) => g.slug === slug);
  if (!currentGroup) {
    notFound();
  }

  const isFreeFire =
    currentGroup.title.toLowerCase().includes("free fire") ||
    slug === "free-fire" ||
    slug === "freefire";

  return (
    <>
      <SiteHeader
        variant="subpage"
        backHref="/"
        backLabel="Trang chủ"
        pageTitle={currentGroup.title}
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

        {isFreeFire ? (
          <FreeFireHub adminNote={ffConfig} />
        ) : (
          <AppCatalog
            groups={groups}
            defaultGroupId={currentGroup.id}
            freeFireNote={ffConfig}
            hideCategoryMenu={true}
          />
        )}

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
