"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoticeItem } from "./NoticeBell";

interface CyberHeaderProps {
  siteName?: string;
  notices?: NoticeItem[];
  user?: { name?: string; role?: string; avatarUrl?: string } | null;
}

const SEEN_KEY = "vt-notice-seen";

export default function CyberHeader({
  siteName = "OnCyber",
  notices = [],
  user = { name: "VỒNG VẦY", role: "DEV", avatarUrl: "https://i.ibb.co/jv75LbdS/6123108838828349044.jpg" },
}: CyberHeaderProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [notices]);

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
  }

  return (
    <>
      <header className={`cyber-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="cyber-header-inner">
          {/* LOGO */}
          <Link href="/" className="cyber-logo-brand" aria-label="OnCyber Trang chủ">
            <div className="cyber-logo-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="cyber-logo-text">{siteName}</span>
          </Link>

          {/* DESKTOP NAV TABS */}
          <nav className="cyber-nav-menu" aria-label="Menu điều hướng">
            <Link
              href="/"
              className={`cyber-nav-link ${pathname === "/" ? "active" : ""}`}
            >
              Trang chủ
            </Link>
            <a href="#services" className="cyber-nav-link">
              Dịch vụ
            </a>
            <Link href="/free-fire" className="cyber-nav-link">
              Hướng dẫn
            </Link>
            <Link href="/dashboard" className="cyber-nav-link">
              Nạp tiền
            </Link>
            <button
              type="button"
              onClick={handleOpenNotif}
              className="cyber-nav-link cyber-nav-btn"
            >
              Tin tức
            </button>
            <a href="#contact" className="cyber-nav-link">
              Liên hệ
            </a>
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

            {/* USER BADGE */}
            <Link href="/dashboard" className="cyber-user-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user?.avatarUrl || "https://i.ibb.co/jv75LbdS/6123108838828349044.jpg"}
                alt=""
                className="cyber-user-avatar"
                width={30}
                height={30}
              />
              <div className="cyber-user-info">
                <span className="cyber-user-name">{user?.name || "VỒNG VẦY"}</span>
                <span className="cyber-user-role">{user?.role || "DEV"}</span>
              </div>
              <i className="fas fa-chevron-down cyber-user-arrow" />
            </Link>
          </div>
        </div>
      </header>

      {/* NOTIFICATION OVERLAY */}
      <div
        className={`vthangios-notif-overlay ${openNotif ? "open" : ""}`}
        onClick={() => setOpenNotif(false)}
      />
      <div className={`vthangios-notif-popup ${openNotif ? "open" : ""}`}>
        <div className="vthangios-notif-head">
          <div className="vthangios-notif-title">
            <i className="fas fa-bell text-amber-400" />
            <span>Thông báo hệ thống</span>
          </div>
          <button
            type="button"
            className="vthangios-notif-close"
            onClick={() => setOpenNotif(false)}
            aria-label="Đóng"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="vthangios-notif-body">
          {notices.length === 0 ? (
            <p className="vthangios-notif-empty">Hiện chưa có thông báo mới.</p>
          ) : (
            notices.map((n) => (
              <div key={n.id} className="vthangios-notif-item">
                <p className="vthangios-notif-item-title">{n.title}</p>
                <p className="vthangios-notif-item-body">{n.body}</p>
                <span className="vthangios-notif-item-date">
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
  );
}
