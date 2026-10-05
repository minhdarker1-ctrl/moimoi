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
  siteName = "MinSr",
  notices = [],
  user = { name: "VỒNG VẦY", role: "DEV", avatarUrl: "https://i.ibb.co/jv75LbdS/6123108838828349044.jpg" },
}: CyberHeaderProps) {
  const [openNotif, setOpenNotif] = useState(false);
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


          </div>
        </div>
      </header>

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
