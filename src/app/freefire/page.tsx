import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import FreeFireHub from "@/components/FreeFireHub";
import AppCard from "@/components/AppCard";
import CategoryMenu from "@/components/CategoryMenu";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Độ Nhạy Free Fire Pro - Cài Đặt Kéo Tâm Full Đỏ Cho Mọi Thiết Bị",
    description: "Nhận ngay bộ cài đặt độ nhạy Free Fire chuẩn chỉnh, tối ưu riêng cho từng dòng máy iPhone, iPad, Samsung, Xiaomi, Oppo, Vivo, PC Giả Lập kéo tâm full đỏ cực dễ.",
    keywords: ["độ nhạy ff", "độ nhạy free fire", "kéo tâm full đỏ", "mã hud ff", "setting free fire"],
  };
}

export default async function FreeFirePage() {
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

  // Lấy các app liên quan đến Free Fire
  const ffGroup = groups.find((g) => g.title.toLowerCase().includes("free fire"));
  const ffApps = ffGroup ? ffGroup.apps : [];

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

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "20px 16px 60px" }}>
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

        {/* Category Menu với tab Free Fire đang active và nút ALL ở cuối */}
        <div style={{ marginBottom: 24 }}>
          <CategoryMenu
            categories={categoryItems}
            selectedId={ffGroup?.id ?? 2}
            useLinks={true}
          />
        </div>

        {/* Component Công cụ Độ Nhạy Free Fire */}
        <FreeFireHub adminNote={ffConfig} />

        {/* Nếu có app / mod Free Fire thì hiển thị thêm ở đây */}
        {ffApps.length > 0 && (
          <section style={{ marginTop: 40, textAlign: "left" }}>
            <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--vi-text)" }}>
              🔥 Bản Mod & Menu Free Fire Mới Nhất
            </h3>
            <div className="mdarker-app-list">
              {ffApps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </section>
        )}

        <footer className="mdarker-footer" style={{ marginTop: 40 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
