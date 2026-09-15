import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  KeyRound,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Crosshair,
  Download,
  BookOpen,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [savedKeysCount, recentKeys, dbUser] = await Promise.all([
    db.userSavedKey.count({ where: { userId: user.id } }),
    db.userSavedKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.user.findUnique({
      where: { id: user.id },
      select: { createdAt: true },
    }),
  ]);

  const joinDate = dbUser?.createdAt
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(dbUser.createdAt)
    : "Mới đây";

  return (
    <div className="dash-page-container">
      {/* Thẻ Chào mừng Banner */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-content">
          <div className="dash-welcome-badge">
            <Sparkles size={16} />
            <span>Khu vực thành viên</span>
          </div>
          <h1 className="dash-welcome-title">
            Chào mừng trở lại, {user.name || user.username}!
          </h1>
          <p className="dash-welcome-desc">
            Quản lý các mã key đã nhận, tra cứu thông số độ nhạy Free Fire và khám phá các tiện ích mới nhất.
          </p>
        </div>
      </div>

      {/* Grid thẻ thống kê */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap icon-purple">
            <KeyRound size={24} />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{savedKeysCount}</span>
            <span className="dash-stat-label">Mã Key Đã Lưu</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap icon-blue">
            <ShieldCheck size={24} />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">
              {user.role === "ADMIN" ? "Quản Trị Viên" : "Thành Viên VIP"}
            </span>
            <span className="dash-stat-label">Cấp Bậc Tài Khoản</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap icon-green">
            <Calendar size={24} />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{joinDate}</span>
            <span className="dash-stat-label">Ngày Tham Gia</span>
          </div>
        </div>
      </div>

      {/* Lối tắt Tiện ích Nhanh */}
      <div className="dash-section">
        <h2 className="dash-section-title">Tiện Ích Nổi Bật</h2>
        <div className="dash-shortcuts-grid">
          <Link href="/freefire" className="dash-shortcut-card">
            <div className="dash-shortcut-icon icon-orange">
              <Crosshair size={22} />
            </div>
            <div className="dash-shortcut-text">
              <span className="dash-shortcut-title">Tool Độ Nhạy Free Fire</span>
              <span className="dash-shortcut-desc">Tạo mã HUD, kéo tâm và độ nhạy chuẩn cho mọi dòng máy</span>
            </div>
            <ArrowRight size={18} className="dash-shortcut-arrow" />
          </Link>

          <Link href="/all" className="dash-shortcut-card">
            <div className="dash-shortcut-icon icon-cyan">
              <Download size={22} />
            </div>
            <div className="dash-shortcut-text">
              <span className="dash-shortcut-title">Kho Ứng Dụng & Mod</span>
              <span className="dash-shortcut-desc">Tải các ứng dụng, game và công cụ đã được duyệt an toàn</span>
            </div>
            <ArrowRight size={18} className="dash-shortcut-arrow" />
          </Link>

          <Link href="/all" className="dash-shortcut-card">
            <div className="dash-shortcut-icon icon-pink">
              <BookOpen size={22} />
            </div>
            <div className="dash-shortcut-text">
              <span className="dash-shortcut-title">Bài Viết & Thủ Thuật</span>
              <span className="dash-shortcut-desc">Xem chia sẻ kinh nghiệm, hướng dẫn cài đặt và tối ưu</span>
            </div>
            <ArrowRight size={18} className="dash-shortcut-arrow" />
          </Link>
        </div>
      </div>

      {/* Danh sách Key gần đây */}
      <div className="dash-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Mã Key Vừa Lưu Gần Đây</h2>
          <Link href="/dashboard/keys" className="dash-link-sm">
            <span>Xem tất cả</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentKeys.length === 0 ? (
          <div className="dash-empty-card">
            <KeyRound size={36} className="text-muted" />
            <p>Bạn chưa lưu mã key nào.</p>
            <Link href="/freefire" className="dash-btn-primary-sm">
              Lấy key ngay
            </Link>
          </div>
        ) : (
          <div className="dash-table-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Ứng dụng / Mục đích</th>
                  <th>Mã Key</th>
                  <th>Thời gian lưu</th>
                  <th>Hạn dùng</th>
                </tr>
              </thead>
              <tbody>
                {recentKeys.map((k) => (
                  <tr key={k.id}>
                    <td className="font-semibold">{k.appName}</td>
                    <td>
                      <code className="dash-key-code">{k.key}</code>
                    </td>
                    <td className="text-muted text-sm">
                      {new Intl.DateTimeFormat("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(k.createdAt)}
                    </td>
                    <td>
                      {k.expiresAt ? (
                        new Date(k.expiresAt) > new Date() ? (
                          <span className="badge-success">Còn hạn</span>
                        ) : (
                          <span className="badge-danger">Đã hết hạn</span>
                        )
                      ) : (
                        <span className="badge-info">Vĩnh viễn</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
