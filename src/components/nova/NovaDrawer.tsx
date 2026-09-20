"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  Layers,
  Dices,
  Trophy,
  KeyRound,
  Share2,
  User,
  Headphones,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

interface NovaDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: AuthUser | null;
}

export default function NovaDrawer({ open, onClose, user }: NovaDrawerProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const navItems = [
    { href: "/dashboard", label: "Trang chủ", icon: <Home size={18} />, exact: true },
    { href: "/freefire", label: "Vượt link lấy Key", icon: <Zap size={18} className="text-amber-400" /> },
    { href: "/all", label: "Kho Game & App iOS", icon: <Layers size={18} /> },
    { href: "/dashboard/spin", label: "Vòng quay may mắn", icon: <Dices size={18} className="text-pink-400" /> },
    { href: "/dashboard/leaderboard", label: "Bảng xếp hạng", icon: <Trophy size={18} className="text-yellow-400" /> },
    { href: "/dashboard/keys", label: "Quản lý Key đã lưu", icon: <KeyRound size={18} /> },
    { href: "/dashboard/referral", label: "Giới thiệu bạn bè", icon: <Share2 size={18} /> },
    { href: "/dashboard/profile", label: "Tài khoản cá nhân", icon: <User size={18} /> },
    { href: "/dashboard/support", label: "Kênh hỗ trợ", icon: <Headphones size={18} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`nova-drawer-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Sidebar */}
      <aside className={`nova-drawer ${open ? "open" : ""}`} aria-label="Menu chính">
        <div className="nova-drawer-head">
          <div className="nova-drawer-logo">
            <svg width="40" height="40" viewBox="0 0 26 26" fill="none">
              <defs>
                <linearGradient id="drw_lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <polygon points="13,2 24,13 13,24 2,13" fill="url(#drw_lg)" opacity="0.25" />
              <polygon points="13,2 24,13 13,24 2,13" fill="none" stroke="url(#drw_lg)" strokeWidth="1.8" />
              <text x="13" y="17" textAnchor="middle" fontFamily="system-ui" fontSize="11" fontWeight="900" fill="url(#drw_lg)">
                O
              </text>
            </svg>
          </div>
          <div>
            <div className="nova-drawer-title">ONCYBER</div>
            <div className="nova-drawer-sub">Hệ Thống Tiện Ích iOS &amp; Free Fire</div>
          </div>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="nova-drawer-user-card">
            <div className="nova-drawer-avatar">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="" />
              ) : (
                <span>{(user.name || user.username).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="nova-drawer-user-meta">
              <div className="nova-drawer-username">{user.name || user.username}</div>
              <div className="nova-drawer-user-role">
                <Sparkles size={11} />
                <span>{user.role === "ADMIN" ? "Quản Trị Viên" : "Thành Viên"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="nova-drawer-body">
          {navItems.map((item, idx) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`nova-drawer-item ${isActive ? "active" : ""}`}
                >
                  <span className="nova-drawer-icon">{item.icon}</span>
                  <span className="nova-drawer-label">{item.label}</span>
                  <ChevronRight size={14} className="nova-drawer-arr" />
                </Link>
                {idx < navItems.length - 1 && <div className="nova-drawer-divider" />}
              </div>
            );
          })}

          {/* Admin Panel Link nếu là ADMIN */}
          {user?.role === "ADMIN" && (
            <>
              <div className="nova-drawer-divider" />
              <Link
                href="/admin"
                onClick={onClose}
                className="nova-drawer-item nova-drawer-item-admin"
              >
                <span className="nova-drawer-icon">
                  <ShieldCheck size={18} className="text-purple-400" />
                </span>
                <span className="nova-drawer-label text-purple-300 font-bold">Trang Quản Trị</span>
                <ChevronRight size={14} className="nova-drawer-arr" />
              </Link>
            </>
          )}

          {/* Đăng xuất / Đăng nhập */}
          <div className="nova-drawer-divider" />
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="nova-drawer-item nova-drawer-logout-btn"
            >
              <span className="nova-drawer-icon">
                <LogOut size={18} className="text-red-400" />
              </span>
              <span className="nova-drawer-label text-red-400 font-semibold">Đăng xuất</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="nova-drawer-item nova-drawer-login-btn"
            >
              <span className="nova-drawer-icon">
                <User size={18} className="text-indigo-400" />
              </span>
              <span className="nova-drawer-label text-indigo-300 font-semibold">Đăng nhập tài khoản</span>
              <ChevronRight size={14} className="nova-drawer-arr" />
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="nova-drawer-foot">
          <p>© 2026 OnCyber iOS. All rights reserved.</p>
        </div>
      </aside>
    </>
  );
}
