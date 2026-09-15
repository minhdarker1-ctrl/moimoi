"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KeyRound,
  User,
  Crosshair,
  Home,
  ShieldAlert,
  LogOut,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

interface Props {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ user, isOpen, onClose }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/dashboard/keys", label: "Key đã lưu", icon: KeyRound },
    { href: "/dashboard/profile", label: "Tài khoản", icon: User },
  ];

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay cho mobile khi sidebar mở */}
      {isOpen && (
        <div
          className="dash-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`dash-sidebar ${isOpen ? "dash-sidebar-open" : ""}`}>
        {/* Header của Sidebar */}
        <div className="dash-sidebar-header">
          <Link href="/" className="dash-sidebar-brand" onClick={onClose}>
            <div className="dash-brand-icon">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="dash-brand-text">
              <span className="dash-brand-title">MOIMOI</span>
              <span className="dash-brand-subtitle">DASHBOARD</span>
            </div>
          </Link>

          <button
            type="button"
            className="dash-sidebar-close"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thông tin User tóm tắt */}
        <div className="dash-user-card">
          <div className="dash-user-avatar">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name || user.username} />
            ) : (
              <span>{(user.name || user.username).charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="dash-user-info">
            <span className="dash-user-name">{user.name || user.username}</span>
            <span className={`dash-role-badge ${user.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
              {user.role === "ADMIN" ? "Quản Trị Viên" : "Thành Viên"}
            </span>
          </div>
        </div>

        {/* Menu Điều Hướng */}
        <div className="dash-nav-section">
          <span className="dash-nav-title">Menu Chính</span>
          <nav className="dash-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`dash-nav-item ${isActive ? "dash-nav-active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="dash-nav-arrow" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lối tắt Tiện Ích */}
        <div className="dash-nav-section">
          <span className="dash-nav-title">Tiện Ích & Liên Kết</span>
          <nav className="dash-nav-list">
            <Link href="/freefire" className="dash-nav-item" onClick={onClose}>
              <Crosshair size={18} />
              <span>Tool Độ Nhạy FF</span>
            </Link>
            <Link href="/" className="dash-nav-item" onClick={onClose}>
              <Home size={18} />
              <span>Về Trang Chủ</span>
            </Link>

            {user.role === "ADMIN" && (
              <Link href="/admin" className="dash-nav-item dash-nav-admin" onClick={onClose}>
                <ShieldAlert size={18} />
                <span>Trang Quản Trị</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Đăng xuất */}
        <div className="dash-sidebar-footer">
          <button type="button" onClick={handleLogout} className="dash-logout-btn">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
