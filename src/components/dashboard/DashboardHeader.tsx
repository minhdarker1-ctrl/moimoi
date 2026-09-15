"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, LogOut, ShieldCheck, Home } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

interface Props {
  user: AuthUser;
  onOpenSidebar: () => void;
}

export default function DashboardHeader({ user, onOpenSidebar }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <header className="dash-top-header">
      <div className="dash-header-left">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="dash-menu-btn"
          aria-label="Mở menu"
        >
          <Menu size={22} />
        </button>
        <span className="dash-greeting">
          Xin chào, <strong>{user.name || user.username}</strong> 👋
        </span>
      </div>

      <div className="dash-header-right">
        {/* Nút chuyển đổi Theme */}
        <button
          type="button"
          onClick={toggleTheme}
          className="dash-icon-btn"
          title="Đổi giao diện Sáng / Tối"
          aria-label="Đổi giao diện"
        >
          <Sun size={19} className="theme-sun" />
          <Moon size={19} className="theme-moon" />
        </button>

        {/* Nút về trang chủ */}
        <Link href="/" className="dash-icon-btn" title="Về trang chủ">
          <Home size={19} />
        </Link>

        {/* User avatar and dropdown */}
        <div className="dash-avatar-dropdown-wrap">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="dash-header-avatar-btn"
            aria-label="Menu tài khoản"
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" />
            ) : (
              <span>{(user.name || user.username).charAt(0).toUpperCase()}</span>
            )}
          </button>

          {dropdownOpen && (
            <>
              <div
                className="dash-dropdown-backdrop"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="dash-user-dropdown">
                <div className="dash-dropdown-header">
                  <div className="dash-dropdown-name">{user.name || user.username}</div>
                  <div className="dash-dropdown-email">@{user.username}</div>
                </div>

                <div className="dash-dropdown-divider" />

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="dash-dropdown-item text-accent"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShieldCheck size={16} />
                    <span>Trang Quản Trị</span>
                  </Link>
                )}

                <Link
                  href="/dashboard/profile"
                  className="dash-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span>Cài đặt tài khoản</span>
                </Link>

                <div className="dash-dropdown-divider" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="dash-dropdown-item dash-dropdown-logout"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
