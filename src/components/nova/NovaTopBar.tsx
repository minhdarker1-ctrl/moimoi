"use client";

import Link from "next/link";
import { Bell, Menu, User } from "lucide-react";
import { AuthUser } from "@/lib/auth";

interface NovaTopBarProps {
  onOpenDrawer: () => void;
  onOpenNotif: () => void;
  unreadCount?: number;
  user?: AuthUser | null;
}

export default function NovaTopBar({
  onOpenDrawer,
  onOpenNotif,
  unreadCount = 0,
  user,
}: NovaTopBarProps) {
  return (
    <header className="nova-topbar">
      {/* Nút Hamburger mở Drawer trái */}
      <button
        type="button"
        className="nova-menu-btn"
        onClick={onOpenDrawer}
        aria-label="Mở Menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Logo chính giữa */}
      <div className="nova-topbar-center">
        <Link href="/dashboard" className="nova-brand-link">
          <svg
            width="28"
            height="28"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nova-brand-svg"
          >
            <defs>
              <linearGradient id="nova_lg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <polygon
              points="13,2 24,13 13,24 2,13"
              fill="url(#nova_lg)"
              opacity="0.22"
            />
            <polygon
              points="13,2 24,13 13,24 2,13"
              fill="none"
              stroke="url(#nova_lg)"
              strokeWidth="1.8"
            />
            <text
              x="13"
              y="17"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="11"
              fontWeight="900"
              fill="url(#nova_lg)"
            >
              O
            </text>
          </svg>
          <span className="nova-brand-text">ONCYBER</span>
        </Link>
      </div>

      {/* Cụm Chuông Thông Báo & Avatar */}
      <div className="nova-topbar-right">
        <button
          type="button"
          className="nova-bell-btn"
          onClick={onOpenNotif}
          aria-label="Thông báo"
          title="Thông báo"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="nova-bell-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {user ? (
          <Link href="/dashboard/profile" className="nova-user-avatar-btn" title={user.name || user.username}>
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" />
            ) : (
              <span>{(user.name || user.username).charAt(0).toUpperCase()}</span>
            )}
          </Link>
        ) : (
          <Link href="/login" className="nova-login-quick-btn" title="Đăng nhập">
            <User size={16} />
          </Link>
        )}
      </div>
    </header>
  );
}
