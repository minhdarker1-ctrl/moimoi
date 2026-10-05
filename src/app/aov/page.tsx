import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import DesktopHeader from "@/components/DesktopHeader";
import AovArenaClient from "./AovArenaClient";

export const revalidate = 10; // Cập nhật kho và dữ liệu nhanh

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
  const currentUser = await getCurrentUser();

  const [site, groups, notices, aovConfig, availableStock, claimedStock, dbUser, userInventory] =
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
      currentUser
        ? db.user.findUnique({
            where: { id: currentUser.id },
            select: {
              id: true,
              username: true,
              role: true,
              aovTickets: true,
              name: true,
            },
          })
        : null,
      currentUser
        ? db.gameAccount.findMany({
            where: {
              game: "AOV",
              claimedBy: currentUser.username,
            },
            orderBy: { claimedAt: "desc" },
            take: 50,
          })
        : [],
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
          currentUser={
            dbUser
              ? {
                  id: dbUser.id,
                  username: dbUser.username,
                  role: dbUser.role,
                  aovTickets: dbUser.aovTickets,
                  name: dbUser.name,
                }
              : null
          }
          availableStock={availableStock}
          claimedStock={claimedStock}
          blindBoxEnabled={aovConfig?.blindBoxEnabled ?? true}
          notice={aovConfig?.notice ?? ""}
          initialInventory={userInventory.map((a) => ({
            id: a.id,
            username: a.username,
            password: a.password,
            rank: a.rank,
            skins: a.skins,
            champs: a.champs,
            notes: a.notes,
            claimedAt: a.claimedAt ? a.claimedAt.toISOString() : null,
          }))}
        />

        <footer className="mdarker-footer" style={{ marginTop: 40, paddingBottom: 40 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
