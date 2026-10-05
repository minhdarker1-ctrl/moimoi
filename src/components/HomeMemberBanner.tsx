"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, LogIn, UserPlus, KeyRound, ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function HomeMemberBanner() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return null;
  }

  return (
    <div className="home-member-banner">
      <div className="home-member-glow-orb" aria-hidden="true" />
      <div className="home-member-content">
        <div className="home-member-badge">
          <Sparkles size={13} className="text-amber-400" />
          <span>HỆ THỐNG MỚI</span>
        </div>

        {user ? (
          <>
            <h2 className="home-member-title">
              Chào mừng, <span className="home-member-highlight">{user.name || user.username}</span> 👋
            </h2>
            <p className="home-member-desc">
              Tài khoản {user.role === "ADMIN" ? "Quản Trị Viên" : "Thành Viên"} của bạn đã sẵn sàng. Truy cập Dashboard để quản lý các mã key đã lưu và công cụ độc quyền.
            </p>
            <div className="home-member-actions">
              <Link href="/dashboard" className="home-member-btn home-member-btn-primary">
                <LayoutDashboard size={16} />
                <span>Mở Dashboard</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/dashboard/keys" className="home-member-btn home-member-btn-secondary">
                <KeyRound size={16} />
                <span>Key Đã Lưu</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="home-member-title">
              Cổng Thành Viên &amp; Bảng Điều Khiển
            </h2>
            <p className="home-member-desc">
              Đăng ký tài khoản hoàn toàn miễn phí để tự động lưu mã Key sau khi vượt link, không lo mất key và đồng bộ trên mọi thiết bị.
            </p>
            <div className="home-member-actions">
              <Link href="/login" className="home-member-btn home-member-btn-primary">
                <LogIn size={16} />
                <span>Đăng Nhập</span>
              </Link>
              <Link href="/register" className="home-member-btn home-member-btn-secondary">
                <UserPlus size={16} />
                <span>Đăng Ký Miễn Phí</span>
              </Link>
              <Link href="/dashboard" className="home-member-btn home-member-btn-ghost">
                <LayoutDashboard size={16} />
                <span>Khám phá Dashboard</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
