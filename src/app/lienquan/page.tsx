import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import AppCard from "@/components/AppCard";
import CategoryMenu from "@/components/CategoryMenu";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Liên Quân Mobile - Mod Skin, Menu & Bản Đồ Sáng | The Darker",
    description: "Tổng hợp các bản mod skin an toàn, menu map sáng và file config tối ưu 60-120fps cho Liên Quân Mobile.",
    keywords: ["liên quân mobile", "mod skin liên quân", "map sáng lq", "config lq 60fps", "tối ưu liên quân"],
  };
}

export default async function LienQuanPage() {
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

  const lqGroup = groups.find(
    (g) =>
      g.title.toLowerCase().includes("liên quân") ||
      g.title.toLowerCase().includes("lien quan") ||
      g.slug === "lien-quan-mobile"
  );
  const lqApps = lqGroup ? lqGroup.apps : [];

  const categoryItems = groups.map((g) => ({
    id: g.id,
    title: g.title,
    slug: g.slug,
    icon: g.icon,
    badge: g.badge,
    desc: g.desc,
    appCount: g.apps.length,
  }));

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

      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 16px 60px" }}>
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

        {/* Category Menu với tab Liên Quân đang active và nút ALL ở cuối */}
        <div style={{ marginBottom: 24 }}>
          <CategoryMenu
            categories={categoryItems}
            selectedId={lqGroup?.id ?? 1}
            useLinks={true}
          />
        </div>

        {/* Hero banner phong cách Liên Quân Mobile */}
        <div className="mdarker-lq-hero">
          <div className="mdarker-lq-badge">
            <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            <span>LIÊN QUÂN MOBILE ARENA</span>
          </div>
          <h1 className="mdarker-lq-title">
            CHIẾN TRƯỜNG <span>ATHANOR</span>
          </h1>
          <p className="mdarker-lq-desc">
            {lqGroup?.desc ||
              "Tổng hợp mod skin, menu hỗ trợ và file config tối ưu mượt mà 60-120FPS cho game thủ Liên Quân Mobile."}
          </p>
        </div>

        {/* Danh sách ứng dụng Liên Quân hoặc Khối Coming Soon */}
        {lqApps.length > 0 ? (
          <section style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, color: "var(--vi-text)" }}>
              🛡️ Danh sách sản phẩm Liên Quân Mobile ({lqApps.length})
            </h2>
            <div className="mdarker-app-list">
              {lqApps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </section>
        ) : (
          <div className="mdarker-lq-comingsoon">
            <div className="mdarker-lq-shield-icon">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px 0", color: "var(--vi-text)" }}>
              COMING SOON
            </h2>
            <p style={{ maxWidth: 480, margin: "0 auto 20px", fontSize: 13.5, color: "var(--vi-muted)", lineHeight: 1.6 }}>
              Chiến trường Athanor đang chuẩn bị tài nguyên mới. Các bản mod skin, menu hỗ trợ và file tối ưu FPS Liên Quân Mobile sẽ sớm được cập nhật tại đây!
            </p>
            <Link
              href="/all"
              className="vt-btn-primary mdarker-empty-btn"
              style={{ textDecoration: "none", display: "inline-flex", gap: 8, padding: "10px 20px", fontSize: 13.5 }}
            >
              <i className="fa-solid fa-shapes" aria-hidden="true" />
              <span>Khám phá mục ALL</span>
            </Link>
          </div>
        )}

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
