"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, CheckCheck, ChevronDown, Bell, Zap, Trophy, KeyRound, User as UserIcon } from "lucide-react";

interface NotificationItem {
  id: number;
  category: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string | Date;
}

interface NovaNotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export default function NovaNotificationDrawer({
  open,
  onClose,
  onUnreadChange,
}: NovaNotificationDrawerProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchNotifs = async (category = currentTab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?category=${category}`);
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
        if (onUnreadChange) onUnreadChange(data.unread_total || 0);
      }
    } catch (e) {
      console.error("Lỗi tải thông báo:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifs(currentTab);
    }
  }, [open, currentTab]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      if (onUnreadChange) onUnreadChange(0);
    } catch (e) {
      console.error("Lỗi đánh dấu đã xem:", e);
    }
  };

  const handleToggleItem = async (item: NotificationItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
      if (!item.isRead) {
        try {
          await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id }),
          });
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, isRead: true } : i))
          );
          if (onUnreadChange) {
            onUnreadChange(Math.max(0, items.filter((i) => !i.isRead).length - 1));
          }
        } catch {}
      }
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "system":
        return <Zap size={16} className="text-amber-400" />;
      case "reward":
        return <Trophy size={16} className="text-purple-400" />;
      case "key":
        return <KeyRound size={16} className="text-emerald-400" />;
      case "account":
        return <UserIcon size={16} className="text-blue-400" />;
      default:
        return <Bell size={16} className="text-indigo-400" />;
    }
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "system", label: "📢 Hệ thống" },
    { id: "reward", label: "🏆 Quà & Điểm" },
    { id: "key", label: "🔑 Key" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`nova-notif-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel from Right */}
      <div className={`nova-notif-panel ${open ? "open" : ""}`} aria-label="Trung tâm thông báo">
        <div className="nova-notif-head">
          <div className="nova-notif-head-row">
            <h2 className="nova-notif-title">
              <Bell size={18} className="text-purple-400" />
              <span>Thông báo</span>
            </h2>
            <div className="nova-notif-actions">
              <button
                type="button"
                className="nova-notif-mark-all"
                onClick={handleMarkAllRead}
                title="Đánh dấu tất cả là đã đọc"
              >
                <CheckCheck size={13} />
                <span>Đã xem tất cả</span>
              </button>
              <button
                type="button"
                className="nova-notif-close"
                onClick={onClose}
                aria-label="Đóng"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="nova-notif-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`nova-notif-tab ${currentTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="nova-notif-list">
          {loading ? (
            <div className="nova-notif-empty">Đang tải thông báo...</div>
          ) : items.length === 0 ? (
            <div className="nova-notif-empty">
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <span>Chưa có thông báo nào trong mục này.</span>
            </div>
          ) : (
            items.map((it) => {
              const isExpanded = expandedId === it.id;
              const dateStr = new Date(it.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              });

              return (
                <div
                  key={it.id}
                  className={`nova-notif-item ${!it.isRead ? "unread" : ""}`}
                  onClick={() => handleToggleItem(it)}
                >
                  <div className="nova-notif-item-header">
                    <div className="nova-notif-icon-wrap">
                      {getCategoryIcon(it.category)}
                    </div>
                    <div className="nova-notif-body">
                      <div className="nova-notif-item-title">{it.title}</div>
                      <div className="nova-notif-preview">{it.message}</div>
                      <div className="nova-notif-time">{dateStr}</div>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`nova-notif-chevron ${isExpanded ? "rotated" : ""}`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="nova-notif-detail" onClick={(e) => e.stopPropagation()}>
                      <p className="nova-notif-detail-msg">{it.message}</p>
                      {it.linkUrl && (
                        <div className="nova-notif-detail-actions">
                          <Link
                            href={it.linkUrl}
                            onClick={onClose}
                            className="nova-notif-view-link"
                          >
                            Xem ngay →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
