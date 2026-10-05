import { db } from "@/lib/db";
import Link from "next/link";
import CyberHeader from "@/components/CyberHeader";
import TypedText from "@/components/TypedText";

export const revalidate = 60;

function parseLines(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return ["Developer...", "Designer...", "Creator...", "Gamer...."];
  }
}

export default async function Home() {
  const [site, socials, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 15 }),
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

  // Fallback defaults for socials if database has fewer than 4
  const defaultSocials = [
    { id: 1, type: "tiktok", name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@oncyberr", color: "tiktok" },
    { id: 2, type: "facebook", name: "Facebook", icon: "fa-brands fa-facebook-f", url: "https://www.facebook.com/oncyber", color: "facebook" },
    { id: 3, type: "telegram", name: "Telegram", icon: "fa-brands fa-telegram", url: "https://t.me/thedarker1", color: "telegram" },
    { id: 4, type: "youtube", name: "YouTube", icon: "fa-brands fa-youtube", url: "https://youtube.com/@oncyberr", color: "youtube" },
  ];

  const socialLinks = defaultSocials.map((def, idx) => {
    const found = socials[idx];
    return {
      ...def,
      url: found?.url || def.url,
    };
  });

  return (
    <>
      {/* CYBER TOP NAVIGATION */}
      <CyberHeader
        siteName={site.name}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
      />

      <main className="cyber-main-wrap" role="main">
        {/* HERO SECTION */}
        <section className="cyber-hero-section" aria-label="Giới thiệu OnCyber">
          <div className="cyber-avatar-container">
            <div className="cyber-avatar-ring">
              {site.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="cyber-avatar-img"
                  src={site.avatarUrl}
                  alt={`Ảnh đại diện ${site.name}`}
                  fetchPriority="high"
                  width={112}
                  height={112}
                />
              ) : (
                <div className="cyber-avatar-fallback">OC</div>
              )}
              {site.avatarFrameUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="cyber-avatar-frame-overlay" src={site.avatarFrameUrl} alt="" aria-hidden="true" />
              )}
            </div>
          </div>

          <p className="cyber-iam">{site.iam || "Hi, i am"}</p>
          <h1 className="cyber-name">
            {site.name}
            {site.verified && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img className="cyber-verify-badge" src="/verify.svg" alt="verified" width={24} height={24} />
            )}
          </h1>
          <p className="cyber-headline">
            and I&apos;m a{" "}
            <span className="cyber-gradient-typed">
              <TypedText lines={parseLines(site.typedLines)} />
            </span>
          </p>

          {/* SOCIALS / CONTACT ROW */}
          <div className="cyber-socials-row" id="contact" aria-label="Liên hệ">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`cyber-social-btn cyber-social-${s.color}`}
                aria-label={s.name}
                title={s.name}
              >
                {s.color === "telegram" ? (
                  <span className="cyber-tg-badge">
                    <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  </span>
                ) : (
                  <i className={s.icon} aria-hidden="true" />
                )}
              </a>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER: DỊCH VỤ */}
        <div className="cyber-section-divider" id="services">
          <div className="cyber-divider-line left" />
          <div className="cyber-divider-badge">
            <span className="cyber-star-icon">✦</span>
            <span className="cyber-divider-title">DỊCH VỤ</span>
            <span className="cyber-star-icon">✦</span>
          </div>
          <div className="cyber-divider-line right" />
        </div>
        <p className="cyber-section-subtitle">
          Hệ thống dịch vụ uy tín - Tốc độ - Bảo mật - Giá tốt nhất
        </p>

        {/* 4 CORE SERVICES GRID */}
        <section className="cyber-services-grid" aria-label="Danh sách 4 dịch vụ chính">
          {/* CARD 1: FREE FIRE */}
          <Link href="/freefire" className="cyber-card cyber-card-ff" aria-label="Xem dịch vụ Free Fire">
            <div className="cyber-card-inner">
              <div className="cyber-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/services/freefire.png"
                  alt="Free Fire"
                  className="cyber-card-img"
                  width={96}
                  height={96}
                  loading="lazy"
                />
              </div>
              <h2 className="cyber-card-title">FREE FIRE</h2>
              <p className="cyber-card-desc">Nạp kim cương, đổi thẻ &amp; sự kiện</p>
              <div className="cyber-card-badge badge-active">
                <i className="fas fa-shield-alt" />
                <span>HOẠT ĐỘNG</span>
              </div>
              <span className="cyber-card-cta">
                <span>XEM DỊCH VỤ</span>
                <i className="fas fa-arrow-right" />
              </span>
            </div>
          </Link>

          {/* CARD 2: AOV */}
          <Link href="/lienquan" className="cyber-card cyber-card-aov" aria-label="Xem dịch vụ Liên Quân Mobile AOV">
            <div className="cyber-card-inner">
              <div className="cyber-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/services/aov.png"
                  alt="AOV Liên Quân Mobile"
                  className="cyber-card-img"
                  width={96}
                  height={96}
                  loading="lazy"
                />
              </div>
              <h2 className="cyber-card-title">AOV</h2>
              <p className="cyber-card-desc">Nạp quân huy, cày thuê &amp; mod map</p>
              <div className="cyber-card-badge badge-active-blue">
                <i className="fas fa-shield-alt" />
                <span>HOẠT ĐỘNG</span>
              </div>
              <span className="cyber-card-cta">
                <span>XEM DỊCH VỤ</span>
                <i className="fas fa-arrow-right" />
              </span>
            </div>
          </Link>

          {/* CARD 3: LOCKET GOLD */}
          <Link href="/locket" className="cyber-card cyber-card-locket" aria-label="Xem dịch vụ Locket Gold">
            <div className="cyber-card-inner">
              <div className="cyber-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/services/locket.svg"
                  alt="Locket Gold"
                  className="cyber-card-img"
                  width={96}
                  height={96}
                  loading="lazy"
                />
              </div>
              <h2 className="cyber-card-title">LOCKET GOLD</h2>
              <p className="cyber-card-desc">Kích hoạt locket gold miễn phí &amp; DNS</p>
              <div className="cyber-card-badge badge-active">
                <i className="fas fa-check-circle" />
                <span>HOẠT ĐỘNG</span>
              </div>
              <span className="cyber-card-cta">
                <span>XEM DỊCH VỤ</span>
                <i className="fas fa-arrow-right" />
              </span>
            </div>
          </Link>

          {/* CARD 4: OTHER */}
          <Link href="/other" className="cyber-card cyber-card-other" aria-label="Xem dịch vụ khác">
            <div className="cyber-card-inner">
              <div className="cyber-card-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/services/other.svg"
                  alt="Other Services"
                  className="cyber-card-img"
                  width={96}
                  height={96}
                  loading="lazy"
                />
              </div>
              <h2 className="cyber-card-title">OTHER</h2>
              <p className="cyber-card-desc">Dịch vụ khác &amp; hỗ trợ toàn bộ game</p>
              <div className="cyber-card-badge badge-pending">
                <i className="fas fa-spinner fa-spin-pulse" />
                <span>ĐANG CẬP NHẬT</span>
              </div>
              <span className="cyber-card-cta">
                <span>XEM DỊCH VỤ</span>
                <i className="fas fa-arrow-right" />
              </span>
            </div>
          </Link>
        </section>

        {/* TRUST METRICS BAR */}
        <section className="cyber-trust-bar" aria-label="Cam kết uy tín">
          <div className="cyber-trust-item">
            <div className="cyber-trust-icon-box purple">
              <i className="fas fa-shield-halved" />
            </div>
            <div className="cyber-trust-text">
              <strong>UY TÍN HÀNG ĐẦU</strong>
              <p>Đảm bảo an toàn tuyệt đối</p>
            </div>
          </div>

          <div className="cyber-trust-item">
            <div className="cyber-trust-icon-box blue">
              <i className="fas fa-bolt" />
            </div>
            <div className="cyber-trust-text">
              <strong>XỬ LÝ TỰ ĐỘNG</strong>
              <p>Giao dịch nhanh chóng 24/7</p>
            </div>
          </div>

          <div className="cyber-trust-item">
            <div className="cyber-trust-icon-box green">
              <i className="fas fa-lock" />
            </div>
            <div className="cyber-trust-text">
              <strong>BẢO MẬT TUYỆT ĐỐI</strong>
              <p>Thông tin khách hàng được bảo vệ</p>
            </div>
          </div>

          <div className="cyber-trust-item">
            <div className="cyber-trust-icon-box pink">
              <i className="fas fa-headset" />
            </div>
            <div className="cyber-trust-text">
              <strong>HỖ TRỢ 24/7</strong>
              <p>Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="cyber-footer">
          <p>&copy; Designer by {site.footerText || site.name} 2026</p>
        </footer>
      </main>
    </>
  );
}
