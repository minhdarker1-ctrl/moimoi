import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import AdminNav from "./AdminNav";
import { updateCounter } from "./actions";
import {
  Eye,
  Calendar,
  Users,
  AppWindow,
  ShieldCheck,
  KeyRound,
  Network,
  TrendingUp,
  CheckCircle2,
  Save,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams?: Promise<{ counter_saved?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const isSaved = sp.counter_saved === "1";
  const today = vnDate();

  const [counter, daily, users, apps, keys, active, shorteners] = await Promise.all([
    db.counter.findUnique({ where: { id: 1 } }),
    db.dailyHit.findUnique({ where: { date: today } }),
    db.user.count(),
    db.app.count(),
    db.appKey.count(),
    db.appKey.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
    db.shortener.count({ where: { enabled: true } }),
  ]);

  const stats = [
    { label: "Tổng lượt truy cập", value: counter?.total ?? 0, icon: Eye, color: "stat-purple" },
    { label: "Truy cập hôm nay", value: daily?.count ?? 0, icon: Calendar, color: "stat-blue" },
    { label: "Thành viên đăng ký", value: users, icon: Users, color: "stat-green" },
    { label: "Ứng dụng & Mod", value: apps, icon: AppWindow, color: "stat-orange" },
    { label: "Key còn hiệu lực", value: active, icon: ShieldCheck, color: "stat-pink" },
    { label: "Tổng key đã phát", value: keys, icon: KeyRound, color: "stat-cyan" },
    { label: "Cổng vượt link đang bật", value: shorteners, icon: Network, color: "stat-yellow" },
  ];

  return (
    <div className="vt-admin">
      <AdminNav current="/admin" />

      {isSaved && (
        <div className="dash-alert dash-alert-success" style={{ marginBottom: 20 }}>
          <CheckCircle2 size={18} />
          <span>Đã lưu thành công thông số lượt truy cập! Hệ thống đã áp dụng ra ngoài trang chủ.</span>
        </div>
      )}

      {/* THẺ THỐNG KÊ TỔNG QUAN HIỆN ĐẠI */}
      <div className="admin-stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="admin-stat-card">
              <div className={`admin-stat-icon ${s.color}`}>
                <Icon size={22} />
              </div>
              <div className="admin-stat-content">
                <span className="admin-stat-val">
                  {new Intl.NumberFormat("vi-VN").format(s.value)}
                </span>
                <span className="admin-stat-lbl">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FORM TÙY CHỈNH THÔNG SỐ LƯỢT TRUY CẬP */}
      <div className="vt-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 17, marginTop: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 10, color: "#3b82f6" }}>
          <TrendingUp size={20} />
          <span>Tùy Chỉnh Thông Số Lượt Truy Cập (StatsBar Live)</span>
        </h2>
        <p className="vt-hint" style={{ marginBottom: 18 }}>
          Điều chỉnh trực tiếp số lượt <strong>Tổng truy cập</strong> và <strong>Hôm nay</strong> hiển thị trên thanh thống kê LIVE ngoài trang chủ. Hệ thống sẽ tiếp tục đếm tăng dần dựa trên các mốc bạn đã lưu.
        </p>

        <form action={updateCounter} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Tổng lượt truy cập (Total Visits)</span>
              <input
                key={String(counter?.total ?? 0)}
                type="number"
                name="total"
                defaultValue={counter?.total ?? 0}
                min={0}
                required
              />
              <small className="vt-hint">Hiển thị ở cột &quot;Tổng Truy Cập&quot; ngoài trang chủ.</small>
            </label>

            <label className="vt-field">
              <span>Lượt truy cập hôm nay ({today})</span>
              <input
                key={String(daily?.count ?? 0)}
                type="number"
                name="today"
                defaultValue={daily?.count ?? 0}
                min={0}
                required
              />
              <small className="vt-hint">Hiển thị ở cột &quot;+ Hôm Nay&quot; ngoài trang chủ.</small>
            </label>
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13, color: "var(--vi-muted)" }}>
              💡 Lưu ý: Cài đặt này có hiệu lực ngay tức thì trên giao diện trang chủ mà không cần khởi động lại web.
            </div>
            <button
              className="vt-btn-primary"
              type="submit"
              style={{
                padding: "10px 22px",
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Save size={16} />
              <span>Lưu Thông Số Lượt Truy Cập</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
