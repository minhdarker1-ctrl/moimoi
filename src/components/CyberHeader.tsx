"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoticeItem } from "./NoticeBell";

interface CyberHeaderProps {
  siteName?: string;
  notices?: NoticeItem[];
}

const SEEN_KEY = "vt-notice-seen";

export default function CyberHeader({
  siteName = "MinSr",
  notices = [],
}: CyberHeaderProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const isDark =
        document.documentElement.dataset.theme === "dark" ||
        document.body.classList.contains("vthangios-dark");
      setDark(isDark);
    } catch {}

    try {
      const seen = Number(localStorage.getItem(SEEN_KEY) ?? 0);
      setUnread(notices.filter((n) => new Date(n.createdAt).getTime() > seen).length);
    } catch {
      setUnread(notices.length);
    }
  }, [notices]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setOpenMobileMenu(false);
  }, [pathname]);

  function handleOpenNotif() {
    setOpenNotif(true);
    setUnread(0);
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {}
  }

  function handleToggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    if (next) {
      document.body.classList.add("vthangios-dark");
    } else {
      document.body.classList.remove("vthangios-dark");
    }
    try {
      localStorage.setItem("vt-theme", next ? "dark" : "light");
    } catch {}

    try {
      window.dispatchEvent(
        new CustomEvent("scenic-theme-change", {
          detail: { theme: next ? "dark" : "light" },
        })
      );
    } catch {}
  }

  return (
    <>
      <header className="cyber-header">
        <div className="cyber-header-inner">
          {/* LOGO */}
          <Link href="/" className="cyber-logo-brand" aria-label="MinSr Trang chủ">
            <div className="cyber-logo-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="cyber-logo-text">{siteName}</span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="cyber-nav-links" aria-label="Menu chính">
            <Link href="/#services" className={`cyber-nav-item ${pathname === "/" ? "active" : ""}`}>
              <i className="fas fa-layer-group" />
              <span>Dịch Vụ</span>
            </Link>
            <Link href="/locket" className={`cyber-nav-item ${pathname === "/locket" ? "active" : ""}`}>
              <i className="fas fa-crown text-amber-400" />
              <span>Locket Gold</span>
            </Link>
            <Link href="/freefire" className={`cyber-nav-item ${pathname.startsWith("/freefire") ? "active" : ""}`}>
              <i className="fa-solid fa-fire text-orange-500" />
              <span>Free Fire</span>
            </Link>
            <Link href="/aov" className={`cyber-nav-item ${pathname === "/aov" ? "active" : ""}`}>
              <i className="fas fa-shield-alt text-sky-400" />
              <span>AOV</span>
            </Link>
            <Link href="/donate" className={`cyber-nav-item ${pathname === "/donate" ? "active" : ""}`}>
              <i className="fas fa-heart text-pink-500" />
              <span>Ủng Hộ</span>
            </Link>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="cyber-header-actions">
            {/* NOTIFICATION BELL */}
            <button
              type="button"
              onClick={handleOpenNotif}
              className="cyber-action-btn cyber-bell-btn"
              aria-label="Thông báo"
            >
              <i className="fas fa-bell" aria-hidden="true" />
              {unread > 0 && <span className="cyber-bell-dot" />}
            </button>

            {/* THEME TOGGLE */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="cyber-action-btn cyber-theme-toggle"
              aria-label={dark ? "Chế độ sáng" : "Chế độ tối"}
            >
              <i className={`bi ${dark ? "bi-moon-stars-fill" : "bi-sun-fill"}`} />
            </button>


            {/* MOBILE HAMBURGER BUTTON */}
            <button
              type="button"
              className="cyber-mobile-menu-btn"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
              aria-label={openMobileMenu ? "Đóng menu" : "Mở menu"}
              aria-expanded={openMobileMenu}
            >
              <i className={`fas ${openMobileMenu ? "fa-times" : "fa-bars"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {openMobileMenu && (
        <>
          <div
            className="cyber-mobile-drawer-backdrop"
            onClick={() => setOpenMobileMenu(false)}
            aria-hidden="true"
          />
          <div className="cyber-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu điều hướng di động">
            <div className="cyber-mobile-drawer-header">
              <span className="cyber-mobile-drawer-title">Danh Mục &amp; Dịch Vụ</span>
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

              {/* SERVICE LINKS */}
              <div className="cyber-mobile-links-list">
                <Link href="/" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon home">
                    <i className="fas fa-home" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Trang Chủ</strong>
                    <span>Giới thiệu MinSr &amp; mạng xã hội</span>
                  </div>
                </Link>

                <Link href="/#services" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon services">
                    <i className="fas fa-layer-group" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Toàn Bộ Dịch Vụ</strong>
                    <span>Danh sách 5 dịch vụ cốt lõi</span>
                  </div>
                </Link>

                <Link href="/locket" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon locket">
                    <i className="fas fa-crown" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Kích Hoạt Locket Gold</strong>
                    <span>Bản quyền 1 năm &amp; DNS Đóng Băng Gold</span>
                  </div>
                </Link>

                <Link href="/freefire" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon ff">
                    <i className="fa-solid fa-fire" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Độ Nhạy Free Fire Pro</strong>
                    <span>Cài đặt kéo tâm full đỏ theo từng dòng máy</span>
                  </div>
                </Link>

                <Link href="/aov" className="cyber-mobile-link" onClick={() => setOpenMobileMenu(false)}>
                  <div className="cyber-m-link-icon aov">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div className="cyber-m-link-text">
                    <strong>Đấu Trường AOV</strong>
                    <span>Xé Túi Mù nhận nick Liên Quân VIP</span>
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

      {/* NOTIFICATION MODAL */}
      {openNotif && (
        <>
          <div
            className="cyber-notif-overlay"
            onClick={() => setOpenNotif(false)}
          />
          <div className="cyber-notif-modal" role="dialog" aria-modal="true" aria-label="Thông báo hệ thống">
            <div className="cyber-notif-head">
              <div className="cyber-notif-title">
                <i className="fas fa-bell" />
                <span>Thông báo hệ thống</span>
              </div>
              <button
                type="button"
                className="cyber-notif-close"
                onClick={() => setOpenNotif(false)}
                aria-label="Đóng"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="cyber-notif-body">
              {notices.length === 0 ? (
                <div className="cyber-notif-empty">
                  <i className="fas fa-envelope-open" />
                  <p>Hiện chưa có thông báo mới.</p>
                </div>
              ) : (
                notices.map((n) => (
                  <div key={n.id} className="cyber-notif-item">
                    <p className="cyber-notif-item-title">{n.title}</p>
                    <p className="cyber-notif-item-body">{n.body}</p>
                    <span className="cyber-notif-item-date">
                      {new Date(n.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
