import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import DesktopHeader from "@/components/DesktopHeader";
import TypedText from "@/components/TypedText";
import AppCatalog from "@/components/AppCatalog";
import StatsBar from "@/components/StatsBar";
import LiveClock from "@/components/LiveClock";

export const revalidate = 60;

function parseLines(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [site, socials, linkBoxes, groups, notices, counter, daily] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.linkBox.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.group.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { apps: { where: { visible: true }, orderBy: { order: "asc" } } },
    }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    db.counter.findUnique({ where: { id: 1 } }),
    db.dailyHit.findUnique({ where: { date: vnDate() } }),
  ]);

  if (!site) {
    return (
      <main>
        <h1>Chưa có dữ liệu</h1>
        <p className="vt-hint">
          Chạy <code>npm run db:seed</code> rồi vào <a href="/admin">/admin</a> để cấu hình.
        </p>
      </main>
    );
  }

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
        groups={groups.map((g) => ({ id: g.id, title: g.title }))}
      />

      <main>
        <div className="mdarker-hero">
          <div className="mdarker-avatar-wrap">
            {site.avatarUrl && (
              /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
              <img
                className="mdarker-avatar"
                src={site.avatarUrl}
                alt={`Ảnh đại diện ${site.name}`}
                width={120}
                height={120}
                fetchPriority="high"
              />
            )}
            {site.avatarFrameUrl && (
              /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
              <img className="mdarker-avatar-frame" src={site.avatarFrameUrl} alt="" aria-hidden="true" />
            )}
          </div>

          <p className="mdarker-iam">{site.iam}</p>
          <h1 className="mdarker-name">
            {site.name}
            {site.verified && (
              /* eslint-disable-next-line @next/next/no-img-element -- icon tĩnh nhỏ */
              <img className="mdarker-verify" src="/verify.svg" alt="Đã xác minh" width={24} height={24} />
            )}
          </h1>
          <p className="mdarker-headline">
            and I&apos;m a <TypedText lines={parseLines(site.typedLines)} />
          </p>

          {socials.length > 0 && (
            <div className="mdarker-socials">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  className="mdarker-social-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mạng xã hội"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */}
                  <img src={s.iconUrl} alt="" width={40} height={40} />
                </a>
              ))}
            </div>
          )}
        </div>

        {linkBoxes.length > 0 && (
          <div className="mdarker-linkbox-section">
            {linkBoxes.map((b) => (
              <a
                key={b.id}
                className="mdarker-linkbox"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {b.iconUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
                  <img src={b.iconUrl} alt="" width={34} height={34} />
                )}
                <span>
                  <strong>{b.title}</strong>
                  {b.subtitle && <span>{b.subtitle}</span>}
                </span>
              </a>
            ))}
          </div>
        )}

        <AppCatalog groups={groups} />

      <StatsBar total={counter?.total ?? 0} today={daily?.count ?? 0} />
      <LiveClock />

      {site.ytBannerOn && site.ytChannelUrl && (
        <div className="mdarker-yt-banner">
          <div className="mdarker-yt-info">
            <i className="fa-solid fa-video mdarker-yt-icon" aria-hidden="true" />
            <div>
              <p className="mdarker-yt-title">Theo Dõi Kênh YouTube</p>
              <p className="mdarker-yt-desc">Cập nhật video hướng dẫn mới nhất</p>
            </div>
          </div>
          <a
            href={site.ytChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mdarker-yt-btn"
          >
            <i className="fa-brands fa-youtube" aria-hidden="true" /> Subscribe Ngay
          </a>
        </div>
      )}

      <footer className="mdarker-footer">{site.footerText}</footer>
    </main>
  </>
  );
}
