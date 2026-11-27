"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoticeBell, { NoticeItem } from "./NoticeBell";
import { useCurrentUser } from "@/lib/useCurrentUser";

export interface SiteHeaderProps {
  siteName?: string;
  avatarUrl?: string;
  verified?: boolean;
  notices?: NoticeItem[];
  variant?: "home" | "subpage";
  backHref?: string;
  backLabel?: string;
  pageTitle?: string;
}

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
});

const SUBPAGE_LINKS = [
  { href: "/freefire", label: "Free Fire", icon: "fa-solid fa-fire" },
  { href: "/aov", label: "AOV", icon: "fas fa-shield-alt" },
  { href: "/locket", label: "Locket", icon: "fas fa-crown" },
  { href: "/other", label: "Other & Quiz", icon: "fa-solid fa-graduation-cap" },
  { href: "/donate", label: "Nuôi tôi", icon: "fas fa-heart" },
];

export default function SiteHeader({
  siteName = "MinSr",
  avatarUrl,
  verified = false,
  notices = [],
  variant = "subpage",
  backHref = "/#services",
  backLabel = "Dịch vụ",
  pageTitle,
}: SiteHeaderProps) {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setOpenMobileMenu(false);
  }, [pathname]);

  const scrollToTop = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="vsc-header" aria-label="Thanh điều hướng chính">
        <div className="vsc-header-inner">
          {/* LEFT: BACK + BRAND + BREADCRUMB */}
          <div className="vsc-header-left">
            {variant === "subpage" && (
              <Link href={backHref} className="vsc-back-pill" aria-label={`Quay lại ${backLabel}`}>
                <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                <span className="vsc-hide-xs">{backLabel}</span>
              </Link>
            )}

            {pathname === "/" ? (
              <button
                type="button"
                onClick={scrollToTop}
                className="vsc-brand-btn"
                title="Cuộn lên đầu trang"
              >
                {avatarUrl ? (
                  <span className="vsc-brand-avatar-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt={siteName} width={28} height={28} className="vsc-brand-avatar" />
                  </span>
                ) : (
                  <span className="vsc-brand-mark" aria-hidden="true">
                    <i className="fa-solid fa-terminal" />
                  </span>
                )}
                <span className="vsc-brand-name">{siteName}</span>
                {verified && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src="/verify.svg" alt="Đã xác minh" width={15} height={15} />
                )}
              </button>
            ) : (
              <Link href="/" className="vsc-brand-btn" title="Về trang chủ">
                {avatarUrl ? (
                  <span className="vsc-brand-avatar-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt={siteName} width={28} height={28} className="vsc-brand-avatar" />
                  </span>
                ) : (
                  <span className="vsc-brand-mark" aria-hidden="true">
                    <i className="fa-solid fa-terminal" />
                  </span>
                )}
                <span className="vsc-brand-name">{siteName}</span>
                {verified && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src="/verify.svg" alt="Đã xác minh" width={15} height={15} />
                )}
              </Link>
            )}

            {pageTitle && (
              <span className="vsc-breadcrumb" title={pageTitle}>
                <span className="vsc-breadcrumb-sep">/</span>
                <span>{pageTitle}</span>
              </span>
            )}
          </div>

          {/* CENTER: COMPACT VS CODE TABS */}
          <nav className="vsc-header-nav" aria-label="Điều hướng nhanh">
            {variant === "home" ? (
              <>
                <Link href="/" className="vsc-nav-tab active">
                  Trang chủ
                </Link>
                {SUBPAGE_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} className="vsc-nav-tab">
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              SUBPAGE_LINKS.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`vsc-nav-tab ${isActive ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                );
              })
            )}
          </nav>

          {/* RIGHT: ADMIN + CLOCK + BELL + MOBILE MENU */}
          <div className="vsc-header-right">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="cyber-admin-indicator"
                title="Đặc quyền Admin: Bấm để vào Bảng Quản Trị"
              >
                <span>👑 ADMIN</span>
              </Link>
            )}

            {time && (
              <div className="mdarker-header-clock" title="Giờ Việt Nam (GMT+7)" suppressHydrationWarning>
                <i className="bi bi-clock" aria-hidden="true" />
                <span>{time}</span>
              </div>
            )}

            <NoticeBell notices={notices} />

            <button
              type="button"
              className="cyber-mobile-menu-btn"
              onClick={() => setOpenMobileMenu((prev) => !prev)}
              aria-label={openMobileMenu ? "Đóng menu" : "Mở menu"}
              aria-expanded={openMobileMenu}
            >
              <i className={`fas ${openMobileMenu ? "fa-times" : "fa-bars"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {openMobileMenu && (
        <>
          <div
            className="cyber-mobile-drawer-backdrop"
            onClick={() => setOpenMobileMenu(false)}
            aria-hidden="true"
          />
          <div className="cyber-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
            <div className="cyber-mobile-drawer-header">
              <span className="cyber-mobile-drawer-title">Điều Hướng {siteName}</span>
              <button
                type="button"
                className="cyber-mobile-drawer-close"
                onClick={() => setOpenMobileMenu(false)}
                aria-label="Đóng"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="cyber-mobile-drawer-body">
              <div className="cyber-mobile-links-list">
                <Link href="/" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon home">
                    <i className="fas fa-home" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Trang Chủ</strong>
                    <span>Giới thiệu {siteName} &amp; Mạng xã hội</span>
                  </div>
                </Link>

                <Link href="/freefire" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon ff">
                    <i className="fa-solid fa-fire" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Free Fire Pro</strong>
                    <span>Độ nhạy kéo tâm &amp; Unlock ID</span>
                  </div>
                </Link>

                <Link href="/aov" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon aov">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Đấu Trường AOV</strong>
                    <span>Xé Túi Mù &amp; Vòng Quay nhận nick</span>
                  </div>
                </Link>

                <Link href="/locket" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon locket">
                    <i className="fas fa-crown" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Locket Gold</strong>
                    <span>Kích hoạt Gold 1 năm &amp; DNS</span>
                  </div>
                </Link>

                <Link href="/other" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon services">
                    <i className="fa-solid fa-graduation-cap" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Trắc Nghiệm &amp; Other</strong>
                    <span>Ngân hàng câu hỏi &amp; Kho công cụ</span>
                  </div>
                </Link>

                <Link href="/donate" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon donate">
                    <i className="fas fa-heart" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Nuôi Tôi (Donate)</strong>
                    <span>Ủng hộ cà phê duy trì server</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
