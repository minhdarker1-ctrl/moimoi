import Link from "next/link";

export interface SiteFooterProps {
  siteName?: string;
  footerText?: string;
}

const QUICK_LINKS = [
  { href: "/freefire", label: "Free Fire Pro" },
  { href: "/aov", label: "Liên Quân AOV" },
  { href: "/locket", label: "Locket Gold" },
  { href: "/other", label: "Trắc nghiệm & Tiện ích" },
  { href: "/donate", label: "Ủng hộ" },
];

export default function SiteFooter({
  siteName = "MinSr",
  footerText,
}: SiteFooterProps) {
  const brand = footerText?.trim() || siteName;

  return (
    <footer className="pro-footer" aria-label="Chân trang">
      <div className="pro-footer-inner">
        <div className="pro-footer-brand">
          <div className="pro-footer-title">{siteName}</div>
          <p className="pro-footer-desc">
            Nền tảng tiện ích game, công nghệ iOS &amp; học tập trực tuyến
          </p>
          <span className="pro-footer-copy">&copy; 2026 {brand}</span>
        </div>

        <nav className="pro-footer-links" aria-label="Liên kết nhanh">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="pro-footer-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pro-footer-status">
          <span className="pro-status-pill">
            <span className="pro-status-dot" aria-hidden="true" />
            <span>Hệ thống hoạt động 24/7</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
