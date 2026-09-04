"use client";

import { useEffect, useState } from "react";

export type NoticeItem = { id: number; title: string; body: string; createdAt: string };

const SEEN_KEY = "vt-notice-seen";

export default function NoticeBell({ notices }: { notices: NoticeItem[] }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    try {
      const seen = Number(localStorage.getItem(SEEN_KEY) ?? 0);
      setUnread(notices.filter((n) => new Date(n.createdAt).getTime() > seen).length);
    } catch {
      setUnread(notices.length);
    }
  }, [notices]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  function show() {
    setOpen(true);
    setUnread(0);
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      // bỏ qua: chỉ mất trạng thái đã đọc
    }
  }

  return (
    <>
      <button type="button" className="vthangios-bell-btn" onClick={show} aria-label="Thông báo">
        <i className="fas fa-bell" aria-hidden="true" />
        {unread > 0 && <span className="vthangios-bell-badge">{unread}</span>}
      </button>

      {open && (
        <>
          <div className="vthangios-notif-overlay" onClick={() => setOpen(false)} />
          <div className="vthangios-notif-panel" role="dialog" aria-modal="true" aria-label="Thông báo">
            <div className="vthangios-notif-header">
              <span>
                <i className="fas fa-bell" aria-hidden="true" /> Thông Báo
              </span>
              <button
                type="button"
                className="vthangios-notif-close"
                onClick={() => setOpen(false)}
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
                    <h3>{n.title}</h3>
                    {n.body && <p>{n.body}</p>}
                    <span className="vthangios-notif-time">
                      {new Date(n.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
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
