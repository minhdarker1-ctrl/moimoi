"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NoticeItem } from "./NoticeBell";

const SEEN_KEY = "vt-notice-seen";

interface VthangNavProps {
  notices: NoticeItem[];
}

export default function VthangNav({ notices }: { notices: NoticeItem[] }) {
  const [openNotif, setOpenNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(false);

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

  useEffect(() => {
    if (!openNotif) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpenNotif(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [openNotif]);

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
      <nav className="vthangios-nav" aria-label="Điều hướng chính">
        <button
          type="button"
          className="vthangios-bell-btn"
          id="vthangios-bell-btn"
          onClick={handleOpenNotif}
          aria-label="Thông báo"
        >
          <i className="fas fa-bell" aria-hidden="true" />
          {unread > 0 && <span className="vthangios-bell-badge" />}
        </button>

        <button
          type="button"
          className="vthangios-theme-btn"
          id="vthangios-theme-toggle"
          onClick={handleToggleTheme}
          aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          <i
            className={`bi ${dark ? "bi-moon-stars-fill" : "bi-sun-fill"} vthangios-theme-icon${
              dark ? " vthangios-icon-flip" : ""
            }`}
            id="vthangios-theme-icon"
            aria-hidden="true"
          />
        </button>
      </nav>

      {/* NOTIFICATION POPUP */}
      <div
        id="vthangios-notif-overlay"
        className={`vthangios-notif-overlay${openNotif ? " open" : ""}`}
        onClick={() => setOpenNotif(false)}
      />
      <div
        id="vthangios-notif-panel"
        className={`vthangios-notif-panel${openNotif ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Thông báo"
      >
        <div className="vthangios-notif-header">
          <span>
            <i className="fas fa-bell" aria-hidden="true" /> Thông Báo
          </span>
          <button
            type="button"
            onClick={() => setOpenNotif(false)}
            className="vthangios-notif-close"
            aria-label="Đóng"
          >
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <div className="vthangios-notif-body">
          {notices.length === 0 ? (
            <div className="vthangios-notif-empty">
              <i className="fas fa-bell-slash" aria-hidden="true" />
              <br />
              Chưa có thông báo
            </div>
          ) : (
            notices.map((n) => (
              <div key={n.id} className="vthangios-notif-item">
                <div className="vthangios-notif-title">{n.title}</div>
                {n.body && <div className="vthangios-notif-content">{n.body}</div>}
                <div className="vthangios-notif-time">
                  {new Date(n.createdAt).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
