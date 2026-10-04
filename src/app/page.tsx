import { db } from "@/lib/db";
import Link from "next/link";
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

        {/* FEATURED: LOCKET GOLD BANNER */}
        <div style={{ maxWidth: 640, margin: "0 auto 24px" }}>
          <Link
            href="/locket"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: "var(--vi-radius-sm)",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)",
              border: "1.5px solid rgba(245, 158, 11, 0.4)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(245, 158, 11, 0.12)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            className="vthangios-locket-featured"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  boxShadow: "0 0 14px rgba(245, 158, 11, 0.5)",
                  flexShrink: 0,
                }}
              >
                👑
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--vi-text)" }}>
                    Kích Hoạt Locket Gold Free
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: "#f59e0b",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: 999,
                    }}
                  >
                    HOT
                  </span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--vi-text-muted)", lineHeight: 1.3 }}>
                  Mở khóa tính năng 1 năm miễn phí cho tài khoản của bạn
                </p>
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              <span>Vào ngay</span>
              <i className="fas fa-chevron-right" style={{ fontSize: 10 }} />
            </div>
          </Link>
        </div>

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
                      {site.ytChannelUrl?.includes("@")
                        ? `@${site.ytChannelUrl.split("@")[1].split("/")[0].split("?")[0]}`
                        : `@${site.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
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
