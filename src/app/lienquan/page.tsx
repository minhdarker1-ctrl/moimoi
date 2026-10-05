import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import AovClient from "./AovClient";

export const revalidate = 10; // Cập nhật stock nhanh hơn

export async function generateMetadata(): Promise<Metadata> {
  const config = await db.aovConfig.findUnique({ where: { id: 1 } });
  return {
    title: `${config?.title || "Tặng Nick Liên Quân Mobile Miễn Phí"} | OnCyber`,
    description:
      config?.description ||
      "Kho tài khoản Liên Quân Garena trắng thông tin, tặng nick miễn phí, cập nhật liên tục hàng ngày.",
    keywords: [
      "tặng nick liên quân",
      "cho acc liên quân miễn phí",
      "acc liên quân trắng thông tin",
      "nhận nick liên quân vip",
      "liên quân mobile garena",
    ],
  };
}

export default async function LienQuanPage() {
  const [site, groups, notices, aovConfig, availableStock, claimedStock, recentLogs] =
    await Promise.all([
      db.site.findUnique({ where: { id: 1 } }),
      db.group.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
        include: { apps: { where: { visible: true }, orderBy: { order: "asc" } } },
      }),
      db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 10 }),
      db.aovConfig.findUnique({ where: { id: 1 } }),
      db.gameAccount.count({ where: { game: "AOV", status: "AVAILABLE" } }),
      db.gameAccount.count({ where: { game: "AOV", status: "CLAIMED" } }),
      db.serviceUsageLog.findMany({
        where: { serviceType: "AOV" },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          targetUser: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

  if (!site) return null;

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
          <Link href="/#services" className="cyber-back-btn">
            <span>← QUAY LẠI DỊCH VỤ</span>
          </Link>
        </div>

        {/* Nội dung Tặng Nick Liên Quân AOV */}
        <AovClient
          availableStock={availableStock}
          claimedStock={claimedStock}
          blindBoxEnabled={aovConfig?.blindBoxEnabled ?? true}
          notice={aovConfig?.notice ?? ""}
          recentLogs={recentLogs.map((l) => ({
            targetUser: l.targetUser,
            createdAt: l.createdAt.toISOString(),
            status: l.status,
          }))}
        />

        <footer className="mdarker-footer" style={{ marginTop: 50 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
