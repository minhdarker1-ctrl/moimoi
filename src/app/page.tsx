import { db } from "@/lib/db";
import VthangNav from "@/components/VthangNav";
import TypedText from "@/components/TypedText";
import AppCard from "@/components/AppCard";

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
  const [site, socials, linkBoxes, groups, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.linkBox.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.group.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { apps: { where: { visible: true }, orderBy: { order: "asc" } } },
    }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 20 }),
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

  const allApps = groups.flatMap((g) => g.apps);

  return (
    <>
      <VthangNav
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
      />

      <main role="main">
        {/* AVATAR */}
        <div className={`vthangios-avatar-wrap${site.avatarFrameUrl ? " has-frame" : ""}`}>
          {site.avatarUrl && (
            /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
            <img
              className="vthangios-avatar"
              src={site.avatarUrl}
              alt={`Ảnh đại diện ${site.name}`}
              fetchPriority="high"
              width={120}
              height={120}
            />
          )}
          {site.avatarFrameUrl && (
            /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
            <img className="vthangios-avatar-frame" src={site.avatarFrameUrl} alt="" aria-hidden="true" />
          )}
        </div>

        {/* NAME & HEADLINE */}
        <p className="vthangios-iam">{site.iam || "Hi, i am"}</p>
        <h1 className="vthangios-name">
          {site.name}
          {site.verified && (
            /* eslint-disable-next-line @next/next/no-img-element -- icon tĩnh nhỏ */
            <img className="vthangios-verify" src="/verify.svg" alt="verified" width={27} height={27} />
          )}
        </h1>
        <p className="vthangios-headline">
          and I&apos;m a{" "}
          <span className="vthangios-gradient-text">
            <TypedText lines={parseLines(site.typedLines)} />
          </span>
        </p>

        {/* SOCIALS */}
        {socials.length > 0 && (
          <div className="vthangios-socials">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                className="vthangios-social-item"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mạng xã hội"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */}
                <img src={s.iconUrl} alt="Social" width={40} height={40} />
              </a>
            ))}
          </div>
        )}

        {/* LINK BOXES */}
        {linkBoxes.length > 0 && (
          <div className="vthangios-linkbox-section">
            {linkBoxes.map((b) => (
              <div key={b.id}>
                <div className="vthangios-linkbox">
                  <div className="vthangios-linkbox-item">
                    <p className="vthangios-linkbox-title">{b.title}</p>
                    <a href={b.url} className="vthangios-link-btn" target="_blank" rel="noopener noreferrer">
                      {b.iconUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
                        <img src={b.iconUrl} width={34} height={34} alt="" />
                      ) : (
                        <i className="fas fa-link" aria-hidden="true" />
                      )}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APP GROUPS */}
        <section className="vthangios-app-section" aria-label="Danh sách ứng dụng">
          {groups.map((group) => {
            if (group.apps.length === 0) return null;
            return (
              <div key={group.id} className="vthangios-group-block" id={`group-${group.id}`}>
                {groups.length > 1 && (
                  <h2 className="vthangios-section-title">
                    {group.title}
                  </h2>
                )}
                <div className="vthangios-app-list">
                  {group.apps.map((app) => (
                    <div key={app.id} className="vthangios-app-entry">
                      <AppCard app={app} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {allApps.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--vi-text-muted)" }}>
              Chưa có ứng dụng nào được hiển thị.
            </div>
          )}
        </section>

        {/* WIDGETS */}
        <div className="vthangios-widgets">
          {/* YOUTUBE SUBSCRIBE BANNER */}
          {site.ytBannerOn && site.ytChannelUrl && (
            <div className="vthangios-yt-banner">
              <div className="vthangios-yt-main">
                <div className="vthangios-yt-head">
                  {site.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- URL do admin dán */
                    <img
                      className="vthangios-yt-avatar"
                      src={site.avatarUrl}
                      alt={site.name}
                      width={80}
                      height={80}
                      loading="lazy"
                    />
                  ) : (
                    <div className="vthangios-yt-icon">
                      <i className="fa-brands fa-youtube" aria-hidden="true" />
                    </div>
                  )}
                  <div className="vthangios-yt-text">
                    <p className="vthangios-yt-title">{site.name}</p>
                    <p className="vthangios-yt-handle">
                      @{site.name.toLowerCase().replace(/[^a-z0-9]/g, "")}
                    </p>
                    <p className="vthangios-yt-meta">
                      <span>Kênh YouTube chính thức</span>
                    </p>
                  </div>
                </div>
              </div>
              <a
                href={site.ytChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="vthangios-yt-btn"
              >
                Đăng ký
              </a>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="vthangios-footer">
          &copy; Designer by {site.footerText || site.name} 2026
        </footer>
      </main>
    </>
  );
}
