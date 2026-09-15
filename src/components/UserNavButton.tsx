"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LayoutDashboard, KeyRound, ShieldAlert, LogOut, Settings } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default function UserNavButton() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  if (loading) return null;

  if (!user) {
    return (
      <Link href="/login" className="user-login-nav-btn" title="Đăng nhập / Đăng ký">
        <User size={15} />
        <span>Đăng nhập</span>
      </Link>
    );
  }

  return (
    <div className="user-nav-dropdown-wrap">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="user-nav-avatar-btn"
        aria-label="Tài khoản cá nhân"
        title={user.name || user.username}
      >
        {user.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt="" />
        ) : (
          <span>{(user.name || user.username).charAt(0).toUpperCase()}</span>
        )}
      </button>

      {open && (
        <>
          <div
            className="dash-dropdown-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="user-nav-dropdown-menu">
            <div className="user-nav-dropdown-user">
              <div className="user-nav-dropdown-name">{user.name || user.username}</div>
              <div className="user-nav-dropdown-role">
                {user.role === "ADMIN" ? "Quản Trị Viên" : "Thành Viên"}
              </div>
            </div>

            <div className="user-nav-dropdown-divider" />

            <Link
              href="/dashboard"
              className="user-nav-dropdown-link"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/keys"
              className="user-nav-dropdown-link"
              onClick={() => setOpen(false)}
            >
              <KeyRound size={15} />
              <span>Key đã lưu</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="user-nav-dropdown-link"
              onClick={() => setOpen(false)}
            >
              <Settings size={15} />
              <span>Cài đặt tài khoản</span>
            </Link>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="user-nav-dropdown-link text-accent font-semibold"
                onClick={() => setOpen(false)}
              >
                <ShieldAlert size={15} />
                <span>Trang Quản Trị</span>
              </Link>
            )}

            <div className="user-nav-dropdown-divider" />

            <button
              type="button"
              onClick={handleLogout}
              className="user-nav-dropdown-link user-nav-logout-btn"
            >
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
