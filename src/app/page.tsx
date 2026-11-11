import { db } from "@/lib/db";
import Link from "next/link";
import CyberHeader from "@/components/CyberHeader";
import TypedText from "@/components/TypedText";
import CyberAvatar from "@/components/CyberAvatar";
import DinoRunnerWidget from "@/components/DinoRunnerWidget";
import FramelessClockWidget from "@/components/FramelessClockWidget";

export const revalidate = 900; // 15 phút - kết hợp on-demand revalidation khi admin lưu

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
          Hệ thống đang được cấu hình. Vui lòng quay lại sau.
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
      {/* TOP NAVIGATION TỐI GIẢN */}
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
        {/* ======================================================== */}
        {/* SÂN KHẤU MẶT TIỀN: BỐ CỤC 3 CÁNH TOÀN CẢNH (3-WING THEATER) */}
        {/* ======================================================== */}
        <section className="cyber-command-theater" aria-label="Trung tâm điều khiển và thông tin MinSr">
          {/* CÁNH TRÁI: DINO RUNNER PIXEL MINI-GAME (HOÀN TOÀN KHÔNG KHUNG) */}
          <div className="cyber-wing cyber-wing-left">
            <DinoRunnerWidget />
          </div>

          {/* TRUNG TÂM: AVATAR SIÊU TO 300px + TÊN KHỔNG LỒ + MẠNG XÃ HỘI */}
          <div className="cyber-wing cyber-wing-center">
            <CyberAvatar
              avatarUrl={site.avatarUrl}
              avatarFrameUrl={site.avatarFrameUrl}
              name={site.name}
            />

            <p className="cyber-iam">{site.iam && site.iam !== "Hi, i am" ? site.iam : "Hi, I am"}</p>

            {/* TÊN KHỔNG LỒ 50px ĐỒNG BỘ VỚI AVATAR */}
            <h1 className="cyber-name cyber-name-giant">
              {site.name}
              {site.verified && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="cyber-verify-badge giant"
                  src="/verify.svg"
                  alt="verified"
                  width={34}
                  height={34}
                />
              )}
            </h1>

            <p className="cyber-headline">
              and I&apos;m a{" "}
              <span className="cyber-gradient-typed">
                <TypedText lines={parseLines(site.typedLines)} />
              </span>
            </p>

            {/* 4 NÚT MẠNG XÃ HỘI 3D SÁNG BÓNG */}
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
          </div>

          {/* CÁNH PHẢI: ĐỒNG HỒ SỐ KHỔNG LỒ & LỊCH VIỆT NAM (HOÀN TOÀN KHÔNG KHUNG) */}
          <div className="cyber-wing cyber-wing-right">
            <FramelessClockWidget />
          </div>
        </section>

        {/* ======================================================== */}
        {/* HỆ SINH THÁI 5 DỊCH VỤ CỐT LÕI (DÀN TRẢI ĐẦY ĐẶN 100%) */}
        {/* ======================================================== */}
        <section className="cyber-services-section" aria-label="Hệ sinh thái dịch vụ">
          {/* SECTION DIVIDER */}
          <div className="cyber-section-divider" id="services">
            <div className="cyber-divider-line left" />
            <div className="cyber-divider-badge">
              <span className="cyber-star-icon">✦</span>
              <span className="cyber-divider-title">HỆ SINH THÁI DỊCH VỤ</span>
              <span className="cyber-star-icon">✦</span>
            </div>
            <div className="cyber-divider-line right" />
          </div>
          <p className="cyber-section-subtitle">
            Hệ thống tiện ích công nghệ cao - Tốc độ tức thì - Bảo mật tuyệt đối 24/7
          </p>

          {/* 5 CORE SERVICES GRID (GLASSMORPHISM 2.0 DÀN PHỦ KÍN CHIỀU RỘNG) */}
          <div className="cyber-services-grid" aria-label="Danh sách 5 dịch vụ chính">
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
                <p className="cyber-card-desc">Độ nhạy &amp; Unlock ID Game</p>
                <div className="cyber-card-badge badge-active">
                  <i className="fas fa-shield-alt" />
                  <span>HOẠT ĐỘNG 24/7</span>
                </div>
                <span className="cyber-card-cta cyber-cta-featured">
                  <span>XEM DỊCH VỤ</span>
                  <i className="fas fa-arrow-right" />
                </span>
              </div>
            </Link>

            {/* CARD 2: AOV */}
            <Link href="/aov" className="cyber-card cyber-card-aov" aria-label="Xem dịch vụ Liên Quân Mobile AOV">
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
                <p className="cyber-card-desc">Tặng nick miễn phí mỗi ngày</p>
                <div className="cyber-card-badge badge-active-blue">
                  <i className="fas fa-shield-alt" />
                  <span>HOẠT ĐỘNG 24/7</span>
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
                  <span>HOẠT ĐỘNG 24/7</span>
                </div>
                <span className="cyber-card-cta cyber-cta-featured">
                  <span>XEM DỊCH VỤ</span>
                  <i className="fas fa-arrow-right" />
                </span>
              </div>
            </Link>

            {/* CARD 4: OTHER */}
            <div className="cyber-card cyber-card-other cyber-card-disabled" aria-label="Dịch vụ khác đang cập nhật">
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
                <span className="cyber-card-cta cyber-cta-disabled" aria-disabled="true">
                  <span>SẮP RA MẮT</span>
                  <i className="fas fa-clock" />
                </span>
              </div>
            </div>

            {/* CARD 5: NUÔI TÔI (DONATE) */}
            <Link href="/donate" className="cyber-card cyber-card-donate" aria-label="Ủng hộ tác giả dự án Nuôi Tôi">
              <div className="cyber-card-inner">
                <div className="cyber-card-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/services/donate.svg"
                    alt="Nuôi Tôi - Donate"
                    className="cyber-card-img"
                    width={96}
                    height={96}
                    loading="lazy"
                  />
                </div>
                <h2 className="cyber-card-title">NUÔI TÔI</h2>
                <p className="cyber-card-desc">Ủng hộ cà phê &amp; duy trì server</p>
                <div className="cyber-card-badge badge-active-pink">
                  <i className="fas fa-heart" />
                  <span>ỦNG HỘ TÁC GIẢ</span>
                </div>
                <span className="cyber-card-cta cyber-cta-donate">
                  <span>DONATE NGAY</span>
                  <i className="fas fa-arrow-right" />
                </span>
              </div>
            </Link>
          </div>

          {/* TRUST METRICS BENTO BAR */}
          <div className="cyber-trust-bar" aria-label="Cam kết chất lượng">
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
          </div>

          {/* FOOTER */}
          <footer className="cyber-footer">
            <p>&copy; Designer by {site.footerText || site.name} 2026</p>
          </footer>
        </section>
      </main>
    </>
  );
}
