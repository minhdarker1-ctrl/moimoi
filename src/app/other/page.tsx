import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import AppCatalog from "@/components/AppCatalog";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ứng Dụng & Công Cụ Khác - OTHER | The Darker",
    description: "Khám phá các ứng dụng tiện ích, công cụ game và mod khác từ The Darker.",
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

        {/* Danh mục và sản phẩm của Other */}
        <AppCatalog
          groups={groups}
          defaultGroupId={otherGroupId}
        />

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
