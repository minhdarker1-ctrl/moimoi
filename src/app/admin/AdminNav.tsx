"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Share2,
  Link2,
  FolderKanban,
  AppWindow,
  FileText,
  Bell,
  Music,
  Flame,
  Activity,
  Network,
  KeyRound,
  ShieldCheck,
  LogOut,
  Home,
  User,
} from "lucide-react";
import { logout } from "./actions";

interface Props {
  current: string;
}

const NAV_GROUPS = [
  {
    title: "Báo Cáo",
    links: [
      { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    ],
  },
  {
    title: "Nội Dung Site",
    links: [
      { href: "/admin/site", label: "Thông tin site", icon: Globe },
      { href: "/admin/socials", label: "Social links", icon: Share2 },
      { href: "/admin/linkboxes", label: "Link boxes", icon: Link2 },
      { href: "/admin/notices", label: "Thông báo", icon: Bell },
      { href: "/admin/music", label: "Kho nhạc nền", icon: Music },
      { href: "/admin/blogs", label: "Bài viết Blog", icon: FileText },
    ],
  },
  {
    title: "Ứng Dụng & Phân Loại",
    links: [
      { href: "/admin/groups", label: "Nhóm / Thể loại", icon: FolderKanban },
      { href: "/admin/apps", label: "Ứng dụng & Mod", icon: AppWindow },
    ],
  },
  {
    title: "Key & Vượt Link",
    links: [
      { href: "/admin/freefire", label: "Free Fire Tool", icon: Flame },
      { href: "/admin/freefire/logs", label: "Logs khách lấy key", icon: Activity },
      { href: "/admin/shorteners", label: "Cổng rút gọn link", icon: Network },
      { href: "/admin/keytypes", label: "Loại key", icon: KeyRound },
      { href: "/admin/keys", label: "Key đã phát", icon: ShieldCheck },
    ],
  },
];

export default function AdminNav({ current }: Props) {
  return (
    <div className="admin-nav-container">
      {/* Top Header thanh điều hướng */}
      <div className="admin-nav-top">
        <div className="admin-nav-brand">
          <span className="admin-badge-role">ADMIN PANEL</span>
          <span className="admin-brand-name">Hệ Thống Quản Trị</span>
        </div>

        <div className="admin-nav-top-actions">
          <Link href="/dashboard" className="admin-nav-btn-link" title="Đến Dashboard thành viên">
            <User size={15} />
            <span>Dashboard User</span>
          </Link>
          <Link href="/" className="admin-nav-btn-link" title="Xem trang chủ ngoài">
            <Home size={15} />
            <span>Trang chủ</span>
          </Link>
          <form action={logout}>
            <button className="admin-nav-logout-btn" type="submit" title="Đăng xuất quản trị">
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </div>

      {/* Thanh Menu điều hướng hiện đại phân nhóm */}
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
    </div>
  );
}
