import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import DesktopHeader from "@/components/DesktopHeader";
import FreeFireResultView from "@/components/FreeFireResultView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ device?: string; type?: string }>;
}): Promise<Metadata> {
  const { device } = await searchParams;
  const devName = device ? decodeURIComponent(device) : "Thiết Bị";
  return {
    title: `Độ Nhạy Free Fire Chuẩn Cho ${devName} - Kéo Tâm Full Đỏ`,
    description: `Xem bảng độ nhạy Free Fire chuẩn xác nhất dành riêng cho ${devName}. Kèm mã setting HUD nút bắn 2, 3, 4 ngón và mẹo kéo tâm cực đỉnh.`,
  };
}

export default async function FreeFireResultPage({
  searchParams,
}: {
  searchParams: Promise<{ device?: string; type?: string }>;
}) {
  const params = await searchParams;
  const rawDevice = params.device ? decodeURIComponent(params.device).trim() : "Điện thoại";
  const rawType = (params.type || "android").toLowerCase();
  const deviceType = (rawType === "ios" || rawType === "pc" ? rawType : "android") as
    | "ios"
    | "android"
    | "pc";

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

  const configProps = {
    requireKey: ffConfig?.requireKey ?? false,
    getKeyUrl: ffConfig?.getKeyUrl ?? "",
    keyTypeId: ffConfig?.keyTypeId ?? null,
    staticKey: ffConfig?.staticKey ?? "",
    hud2Codes: ffConfig?.hud2Codes ?? "",
    hud3Codes: ffConfig?.hud3Codes ?? "",
    hud4Codes: ffConfig?.hud4Codes ?? "",
    iosGeneralMin: ffConfig?.iosGeneralMin ?? 85,
    iosGeneralMax: ffConfig?.iosGeneralMax ?? 155,
    androidGeneralMin: ffConfig?.androidGeneralMin ?? 110,
    androidGeneralMax: ffConfig?.androidGeneralMax ?? 200,
    pcGeneralMin: ffConfig?.pcGeneralMin ?? 80,
    pcGeneralMax: ffConfig?.pcGeneralMax ?? 135,
    redDotMin: ffConfig?.redDotMin ?? 65,
    redDotMax: ffConfig?.redDotMax ?? 95,
    scope2xMin: ffConfig?.scope2xMin ?? 65,
    scope2xMax: ffConfig?.scope2xMax ?? 92,
    scope4xMin: ffConfig?.scope4xMin ?? 60,
    scope4xMax: ffConfig?.scope4xMax ?? 90,
    sniperMin: ffConfig?.sniperMin ?? 30,
    sniperMax: ffConfig?.sniperMax ?? 48,
    freeLookMin: ffConfig?.freeLookMin ?? 40,
    freeLookMax: ffConfig?.freeLookMax ?? 65,
    fireButtonMin: ffConfig?.fireButtonMin ?? 35,
    fireButtonMax: ffConfig?.fireButtonMax ?? 55,
    tipsText: ffConfig?.tipsText ?? "",
  };

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
        {/* Nút điều hướng */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <Link
            href="/freefire"
            className="mdarker-empty-btn"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              fontSize: 13,
            }}
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            <span>Tra cứu dòng máy khác</span>
          </Link>

          <Link
            href="/"
            className="mdarker-empty-btn"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              fontSize: 13,
            }}
          >
            <i className="fa-solid fa-house" aria-hidden="true" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Component Hiển thị Kết quả & Khóa Key */}
        <FreeFireResultView
          device={rawDevice}
          type={deviceType}
          config={configProps}
        />

        <footer className="mdarker-footer" style={{ marginTop: 40 }}>
          {site.footerText}
        </footer>
      </main>
    </>
  );
}
