"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Share2,
  Link2,
  AppWindow,
  Bell,
  Music,
  Flame,
  Activity,
  KeySquare,
  FolderTree,
  Network,
  KeyRound,
  ShieldCheck,
  LogOut,
  Home,
  Users,
  Gift,
  Smartphone,
  Menu,
  X,
} from "lucide-react";
import { logout } from "./actions";

interface Props {
  current: string;
}

const NAV_GROUPS = [
  {
    title: "Báo Cáo & Thành Viên",
    links: [
      { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
      { href: "/admin/users", label: "Người dùng & Dịch vụ", icon: Users },
    ],
  },
  {
    title: "Dịch Vụ Trọng Tâm",
    links: [
      { href: "/admin/aov", label: "Kho Acc Liên Quân", icon: Gift },
      { href: "/admin/freefire", label: "Free Fire Setting", icon: Flame },
      { href: "/admin/freefire/logs", label: "Logs Key Free Fire", icon: Activity },
      { href: "/admin/freefire/unlock-logs", label: "Logs mở khóa FF", icon: KeySquare },
      { href: "/admin/locket", label: "Locket Gold", icon: Smartphone },
      { href: "/admin/apps", label: "Kho Ứng Dụng & Mod", icon: AppWindow },
      { href: "/admin/groups", label: "Nhóm danh mục", icon: FolderTree },
    ],
  },
  {
    title: "Hệ Thống Vượt Link",
    links: [
      { href: "/admin/shorteners", label: "Cổng rút gọn link", icon: Network },
      { href: "/admin/keytypes", label: "Loại key & cấu hình", icon: KeyRound },
      { href: "/admin/keys", label: "Key đã phát", icon: ShieldCheck },
    ],
  },
  {
    title: "Cài Đặt Website",
    links: [
      { href: "/admin/site", label: "Thông tin website", icon: Globe },
      { href: "/admin/socials", label: "Mạng xã hội", icon: Share2 },
      { href: "/admin/linkboxes", label: "Hộp liên kết", icon: Link2 },
      { href: "/admin/notices", label: "Thông báo nổi", icon: Bell },
      { href: "/admin/music", label: "Kho nhạc nền", icon: Music },
    ],
  },
];

export default function AdminNav({ current }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile / Tablet Topbar (< 1080px) */}
      <div className="admin-nav-mobile-topbar">
        <button
          type="button"
          className="admin-nav-burger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Đóng menu quản trị" : "Mở menu quản trị"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="admin-nav-brand">
          <span className="admin-badge-role">ADMIN</span>
          <span className="admin-brand-name">MinSr Console</span>
        </div>

        <div className="admin-nav-mobile-actions">
          <Link href="/" className="admin-nav-btn-link" title="Xem trang chủ" target="_blank">
            <Home size={14} />
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="admin-nav-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Fixed Left Sidebar (>= 1080px) / Slide-out Drawer (< 1080px) */}
      <aside className={`admin-nav-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Điều hướng quản trị">
        <div className="admin-nav-sidebar-head">
          <div className="admin-nav-brand">
            <span className="admin-badge-role">ADMIN PANEL</span>
            <span className="admin-brand-name">MinSr Console</span>
          </div>
          <button
            type="button"
            className="admin-nav-close-mobile"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="admin-nav-bar" aria-label="Quản trị">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="admin-nav-group">
              <span className="admin-group-label">{group.title}</span>
              <div className="admin-group-links">
                {group.links.map((item) => {
                  const Icon = item.icon;
                  const isActive = current === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`admin-nav-pill ${isActive ? "admin-nav-pill-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-nav-sidebar-footer">
          <Link
            href="/freefire"
            className="admin-nav-btn-link admin-vip-quick"
            title="Kiểm tra đặc quyền Admin"
            target="_blank"
          >
            <Flame size={14} />
            <span>Xem Web (Admin)</span>
          </Link>
          <div className="admin-nav-footer-row">
            <Link href="/" className="admin-nav-btn-link" title="Xem trang chủ ngoài" target="_blank">
              <Home size={14} />
              <span>Trang chủ</span>
            </Link>
            <form action={logout} style={{ flex: 1 }}>
              <button className="admin-nav-logout-btn" type="submit" title="Đăng xuất quản trị">
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
