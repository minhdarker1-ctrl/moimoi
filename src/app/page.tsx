import { db } from "@/lib/db";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TypedText from "@/components/TypedText";
import CyberAvatar from "@/components/CyberAvatar";

export const revalidate = 900; // 15 phút - kết hợp on-demand revalidation khi admin lưu

function parseLines(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return ["Developer...", "Designer...", "Creator...", "Gamer...."];
  }
}

const SERVICE_MODULES = [
  {
    href: "/freefire",
    img: "/services/freefire.png",
    title: "Free Fire Pro Suite",
    tag: "Game Utility",
    shortDesc: "Bảng độ nhạy iOS/Android/PC & Whitelist UID 2 cổng",
    desc: "Chuẩn hóa bảng độ nhạy theo từng dòng máy, mã setting HUD 2–4 ngón và kích hoạt Whitelist UID qua cổng FF Kipas & Astute.",
    cta: "Mở công cụ",
    span: "span-2",
  },
  {
    href: "/aov",
    img: "/services/aov.png",
    title: "Đấu Trường Liên Quân",
    tag: "Garena Event",
    shortDesc: "Tích vé mở Túi Mù & Vòng Quay nhận tài khoản Garena",
    desc: "Hoàn thành nhiệm vụ tích lũy vé để tham gia mở Túi Mù (1–3 tài khoản) hoặc thử vận may Vòng Quay May Mắn (0–5 tài khoản).",
    cta: "Vào đấu trường",
    span: "span-2",
  },
  {
    href: "/locket",
    img: "/services/locket.svg",
    title: "Locket Gold iOS",
    tag: "iOS Utility",
    shortDesc: "Kích hoạt Locket Gold miễn phí qua Username & DNS",
    desc: "Kích hoạt Locket Gold 1 năm trực tiếp bằng Username hoặc Link mời, kèm hướng dẫn cài đặt cấu hình DNS đóng băng chi tiết.",
    cta: "Kích hoạt ngay",
    span: "span-2",
  },
  {
    href: "/other",
    img: "/services/other.svg",
    title: "Trắc Nghiệm & Kho Tiện Ích",
    tag: "Education & Apps",
    shortDesc: "335 câu hỏi Công nghệ kim loại & kho ứng dụng iOS/Android",
    desc: "Ngân hàng 335 câu hỏi trắc nghiệm ôn tập bám sát đề cương, tích hợp giọng đọc Google Tiếng Việt, Bảng Vàng xếp hạng và kho ứng dụng tiện ích chọn lọc.",
    cta: "Làm bài Quiz & Xem kho app",
    span: "span-3",
  },
  {
    href: "/donate",
    img: "/services/donate.svg",
    title: "Đồng Hành & Ủng Hộ (Nuôi Tôi)",
    tag: "Community",
    shortDesc: "Cổng ủng hộ kinh phí duy trì máy chủ qua VietQR tự động",
    desc: "Toàn bộ tiện ích trên hệ thống đều miễn phí. Sự ủng hộ của bạn giúp duy trì hạ tầng máy chủ và phát triển thêm tính năng mới.",
    cta: "Mở cổng VietQR",
    span: "span-3",
  },
];

export default async function Home() {
  const [site, socials, notices] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.notice.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);

  if (!site) {
    return (
      <main className="pro-container" style={{ paddingTop: 96 }}>
        <div className="vt-card">
          <h1>Chưa có dữ liệu</h1>
          <p className="vt-hint">Hệ thống đang được cấu hình. Vui lòng quay lại sau.</p>
        </div>
      </main>
    );
  }

  const defaultSocials = [
    { id: 1, type: "tiktok", name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@oncyberr" },
    { id: 2, type: "facebook", name: "Facebook", icon: "fa-brands fa-facebook-f", url: "https://www.facebook.com/oncyber" },
    { id: 3, type: "telegram", name: "Telegram", icon: "fa-solid fa-paper-plane", url: "https://t.me/thedarker1" },
    { id: 4, type: "youtube", name: "YouTube", icon: "fa-brands fa-youtube", url: "https://youtube.com/@oncyberr" },
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
      <SiteHeader
        variant="home"
        siteName={site.name}
        avatarUrl={site.avatarUrl}
        verified={site.verified}
        notices={notices.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          createdAt: n.createdAt.toISOString(),
        }))}
      />

      <main className="pro-home-main" role="main">
        {/* PHÂN KHU 1: HERO 2 CỘT */}
        <section className="pro-hero-section" aria-label="Giới thiệu hệ sinh thái">
          <div className="pro-hero-grid">
            {/* CỘT TRÁI: ĐỊNH DANH & HÀNH ĐỘNG CHÍNH */}
            <div className="pro-hero-left">
              <div className="pro-status-pill">
                <span className="pro-status-dot" aria-hidden="true" />
                <span>Hệ thống trực tuyến 24/7</span>
              </div>

              <div className="pro-identity-row">
                <CyberAvatar
                  size={72}
                  avatarUrl={site.avatarUrl}
                  avatarFrameUrl={site.avatarFrameUrl}
                  name={site.name}
                />
                <div className="pro-identity-text">
                  <p className="pro-identity-eyebrow">
                    {site.iam && site.iam !== "Hi, i am" ? site.iam : "Nền tảng tiện ích số"}
                  </p>
                  <h1 className="pro-hero-name">
                    <span>{site.name}</span>
                    {site.verified && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src="/verify.svg"
                        alt="Đã xác minh"
                        width={20}
                        height={20}
                        className="pro-verify-icon"
                      />
                    )}
                  </h1>
                  <p className="pro-typed-role">
                    <TypedText lines={parseLines(site.typedLines)} />
                  </p>
                </div>
              </div>

              <p className="pro-hero-summary">
                Hệ sinh thái công cụ tối ưu độ nhạy thiết bị, tiện ích bản quyền iOS, sự kiện cộng đồng và ngân hàng 335 câu hỏi trắc nghiệm kỹ thuật.
              </p>

              <div className="pro-hero-actions">
                <a href="#services" className="pro-btn-primary">
                  <span>Khám phá dịch vụ</span>
                  <i className="fa-solid fa-arrow-down" aria-hidden="true" />
                </a>
                <Link href="/other" className="pro-btn-secondary">
                  <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
                  <span>Ôn tập Trắc nghiệm</span>
                </Link>
              </div>

              <div className="pro-socials-bar" id="contact" aria-label="Kênh liên hệ">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pro-social-chip"
                    aria-label={s.name}
                  >
                    <i className={s.icon} aria-hidden="true" />
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI: BẢNG TRUY CẬP NHANH PHÂN HỆ */}
            <aside className="pro-quick-panel" aria-label="Truy cập nhanh phân hệ">
              <div className="pro-quick-panel-head">
                <span className="pro-quick-panel-title">
                  <i className="fa-solid fa-layer-group" aria-hidden="true" />
                  <span>Truy cập nhanh phân hệ</span>
                </span>
                <span className="pro-quick-panel-count">5 công cụ</span>
              </div>

              <div className="pro-quick-list">
                {SERVICE_MODULES.map((mod) => (
                  <Link key={mod.href} href={mod.href} className="pro-quick-row">
                    <div className="pro-quick-icon">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mod.img} alt={mod.title} width={28} height={28} />
                    </div>
                    <div className="pro-quick-info">
                      <strong>{mod.title}</strong>
                      <span>{mod.shortDesc}</span>
                    </div>
                    <div className="pro-quick-meta">
                      <span className="pro-ready-tag">Sẵn sàng</span>
                      <i className="fa-solid fa-arrow-right pro-quick-arrow" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* PHÂN KHU 2: LƯỚI BENTO DỊCH VỤ CỐT LÕI */}
        <section className="pro-bento-section" id="services" aria-label="Danh mục dịch vụ và công cụ">
          <div className="pro-section-head">
            <div>
              <h2 className="pro-section-title">Danh mục Dịch vụ &amp; Công cụ</h2>
              <p className="pro-section-subtitle">
                Tổ chức theo từng phân hệ chuyên biệt — thao tác nhanh, bảo mật phiên và hoàn toàn miễn phí.
              </p>
            </div>
            <span className="pro-eyebrow-badge">5 phân hệ</span>
          </div>

          <div className="pro-bento-grid">
            {SERVICE_MODULES.map((mod) => (
              <Link key={mod.href} href={mod.href} className={`pro-bento-card ${mod.span}`}>
                <div className="pro-bento-card-top">
                  <div className="pro-bento-icon-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mod.img} alt={mod.title} width={36} height={36} loading="lazy" />
                  </div>
                  <span className="pro-bento-tag">{mod.tag}</span>
                </div>

                <h3 className="pro-bento-title">{mod.title}</h3>
                <p className="pro-bento-desc">{mod.desc}</p>

                <div className="pro-bento-footer">
                  <span className="pro-bento-cta">
                    <span>{mod.cta}</span>
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PHÂN KHU 3: THANH TIÊU CHUẨN VẬN HÀNH */}
        <section className="pro-standards-strip" aria-label="Tiêu chuẩn vận hành">
          <div className="pro-standard-item">
            <div className="pro-standard-icon">
              <i className="fa-solid fa-bolt" aria-hidden="true" />
            </div>
            <div>
              <strong>Xử lý tự động 24/7</strong>
              <span>Hoạt động liên tục, phản hồi tức thì</span>
            </div>
          </div>

          <div className="pro-standard-item">
            <div className="pro-standard-icon">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            </div>
            <div>
              <strong>Bảo mật phiên làm việc</strong>
              <span>Xác thực chữ ký an toàn theo thiết bị</span>
            </div>
          </div>

          <div className="pro-standard-item">
            <div className="pro-standard-icon">
              <i className="fa-solid fa-user-lock" aria-hidden="true" />
            </div>
            <div>
              <strong>Không yêu cầu mật khẩu</strong>
              <span>Chỉ dùng UID công khai hoặc Username</span>
            </div>
          </div>

          <div className="pro-standard-item">
            <div className="pro-standard-icon">
              <i className="fa-solid fa-headset" aria-hidden="true" />
            </div>
            <div>
              <strong>Hỗ trợ trực tiếp 1:1</strong>
              <span>Đội ngũ kỹ thuật sẵn sàng giải đáp</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter siteName={site.name} footerText={site.footerText} />
    </>
  );
}
