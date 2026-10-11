import type { Metadata } from "next";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import AovArenaClient from "./AovArenaClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await db.aovConfig.findUnique({ where: { id: 1 } });
  return {
    title: `${config?.title || "Đấu Trường Liên Quân AOV - Xé Túi Mù & Vòng Quay May Mắn"} | MinSr`,
    description:
      config?.description ||
      "Đấu trường nhận nick Liên Quân Garena trắng thông tin miễn phí, cơ chế Xé Túi Mù và Vòng Quay May Mắn nhận tới 5 acc VIP.",
    keywords: [
      "đấu trường aov",
      "xé túi mù liên quân",
      "vòng quay liên quân miễn phí",
      "tặng nick liên quân",
      "acc liên quân trắng thông tin",
      "nhận acc garena",
    ],
  };
}

export default async function AovPage() {
  const cookieStore = await cookies();
  const ticketCount = Math.max(0, parseInt(cookieStore.get("aov_tickets")?.value || "0", 10) || 0);

  const [site, groups, notices, aovConfig, availableStock, claimedStock] =
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

      <main style={{ minHeight: "100vh", paddingTop: 56 }}>
        <AovArenaClient
          initialTickets={ticketCount}
          availableStock={availableStock}
          claimedStock={claimedStock}
          blindBoxEnabled={aovConfig?.blindBoxEnabled ?? true}
          notice={aovConfig?.notice ?? ""}
        />

        <footer className="mdarker-footer" style={{ marginTop: 40, paddingBottom: 40 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
