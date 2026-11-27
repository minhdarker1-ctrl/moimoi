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
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
});

const MAIN_NAV_LINKS = [
  { href: "/", label: "Trang chủ", exact: true },
  { href: "/freefire", label: "Free Fire", exact: false },
  { href: "/aov", label: "Liên Quân", exact: false },
  { href: "/locket", label: "Locket Gold", exact: false },
  { href: "/other", label: "Quiz & Tiện ích", exact: false },
  { href: "/donate", label: "Ủng hộ", exact: false },
];

export default function SiteHeader({
  siteName = "MinSr",
  avatarUrl,
  verified = false,
  notices = [],
  variant = "subpage",
  pageTitle,
}: SiteHeaderProps) {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const [time, setTime] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
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
          {/* LEFT: BRAND & BREADCRUMB */}
          <div className="vsc-header-left">
            {pathname === "/" ? (
              <button
                type="button"
                onClick={scrollToTop}
                className="vsc-brand-btn"
                title="Cuộn lên đầu trang"
              >
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt={siteName} width={26} height={26} className="vsc-brand-avatar" />
                ) : (
                  <span className="vsc-brand-mark" aria-hidden="true">
                    <i className="fa-solid fa-terminal" />
                  </span>
                )}
                <span className="vsc-brand-name">{siteName}</span>
                {verified && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src="/verify.svg" alt="Đã xác minh" width={14} height={14} />
                )}
              </button>
            ) : (
              <Link href="/" className="vsc-brand-btn" title="Về trang chủ">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt={siteName} width={26} height={26} className="vsc-brand-avatar" />
                ) : (
                  <span className="vsc-brand-mark" aria-hidden="true">
                    <i className="fa-solid fa-terminal" />
                  </span>
                )}
                <span className="vsc-brand-name">{siteName}</span>
                {verified && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src="/verify.svg" alt="Đã xác minh" width={14} height={14} />
                )}
              </Link>
            )}

            {variant === "subpage" && pageTitle && (
              <span className="vsc-breadcrumb" title={pageTitle}>
                <span className="vsc-breadcrumb-sep">/</span>
                <span>{pageTitle}</span>
              </span>
            )}
          </div>

          {/* CENTER: UNIFIED NAVIGATION TABS */}
          <nav className="vsc-header-nav" aria-label="Điều hướng phân hệ">
            {MAIN_NAV_LINKS.map((item) => {
              const isActive = item.exact
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`vsc-nav-tab ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: ADMIN + CLOCK + BELL + MOBILE MENU */}
          <div className="vsc-header-right">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="pro-admin-badge"
                title="Mở Bảng Quản Trị Admin"
              >
                <span>ADMIN</span>
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
              <span className="cyber-mobile-drawer-title">Điều hướng {siteName}</span>
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
                    <strong>Trang chủ</strong>
                    <span>Tổng quan hệ sinh thái {siteName}</span>
                  </div>
                </Link>

                <Link href="/freefire" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon ff">
                    <i className="fa-solid fa-fire" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Free Fire Pro</strong>
                    <span>Độ nhạy kéo tâm &amp; Unlock ID Whitelist</span>
                  </div>
                </Link>

                <Link href="/aov" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon aov">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Liên Quân AOV</strong>
                    <span>Túi Mù &amp; Vòng Quay nhận tài khoản</span>
                  </div>
                </Link>

                <Link href="/locket" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon locket">
                    <i className="fas fa-crown" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Locket Gold iOS</strong>
                    <span>Kích hoạt Gold 1 năm &amp; cấu hình DNS</span>
                  </div>
                </Link>

                <Link href="/other" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon services">
                    <i className="fa-solid fa-graduation-cap" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Quiz &amp; Tiện ích</strong>
                    <span>Ngân hàng 335 câu hỏi &amp; Kho ứng dụng</span>
                  </div>
                </Link>

                <Link href="/donate" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon donate">
                    <i className="fas fa-heart" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Ủng hộ (Nuôi tôi)</strong>
                    <span>Đồng hành duy trì máy chủ 24/7</span>
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
