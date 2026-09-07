import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import AppCatalog from "@/components/AppCatalog";
import FreeFireHub from "@/components/FreeFireHub";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await db.group.findFirst({
    where: { slug, visible: true },
  });

  if (!group) return { title: "Không tìm thấy trang | The Darker" };

  return {
    title: `${group.title} | The Darker`,
    description: group.desc || `Khám phá các sản phẩm và công cụ thuộc mảng ${group.title} tại The Darker.`,
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
      <DesktopHeader
        siteName={site.name}
        avatarUrl={site.avatarUrl}
        verified={site.verified}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
        groups={groups.map((g) => ({
          id: g.id,
          title: g.title,
          slug: g.slug,
          icon: g.icon,
          badge: g.badge,
        }))}
      />

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Nút quay lại trang chủ */}
        <div style={{ textAlign: "left", marginBottom: 16 }}>
          <Link
            href="/"
            className="mdarker-empty-btn"
            style={{ textDecoration: "none", display: "inline-flex", gap: 8, padding: "8px 16px", fontSize: 13 }}
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {isFreeFire ? (
          <FreeFireHub adminNote={ffConfig} />
        ) : (
          <AppCatalog
            groups={groups}
            defaultGroupId={currentGroup.id}
            freeFireNote={ffConfig}
          />
        )}

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
