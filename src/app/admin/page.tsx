import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { vnDate } from "@/lib/crypto";
import AdminNav from "./AdminNav";
import { updateCounter } from "./actions";
import {
  Eye,
  Calendar,
  Users,
  ShieldCheck,
  KeyRound,
  Network,
  TrendingUp,
  CheckCircle2,
  Save,
  Sparkles,
  ArrowRight,
  Gift,
  Flame,
  Smartphone,
  AppWindow,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams?: Promise<{ counter_saved?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const sp = searchParams ? await searchParams : {};
  const isSaved = sp.counter_saved === "1";
  const today = vnDate();

  let counter = null;
  let daily = null;
  let users = 0;
  let activeKeys = 0;
  let shorteners = 0;
  let aovAvailable = 0;
  let aovClaimed = 0;
  let freefireLogsCount = 0;
  let locketLogsCount = 0;

  try {
    [
      counter,
      daily,
      users,
      activeKeys,
      shorteners,
      aovAvailable,
      aovClaimed,
      freefireLogsCount,
      locketLogsCount,
    ] = await Promise.all([
      db.counter.findUnique({ where: { id: 1 } }),
      db.dailyHit.findUnique({ where: { date: today } }),
      db.user.count(),
      db.appKey.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
      db.shortener.count({ where: { enabled: true } }),
      db.gameAccount.count({ where: { game: "AOV", status: "AVAILABLE" } }),
      db.gameAccount.count({ where: { game: "AOV", status: "CLAIMED" } }),
      db.freeFireKeyLog.count(),
      db.serviceUsageLog.count({ where: { serviceType: "LOCKET_GOLD" } }),
    ]);
  } catch (err) {
    console.error("Error loading admin stats:", err);
  }

  const coreServices = [
    {
      title: "Kho Acc Liên Quân (AOV)",
      subtitle: `${aovAvailable.toLocaleString()} acc sẵn sàng • Đã tặng ${aovClaimed.toLocaleString()}`,
      href: "/admin/aov",
      icon: Gift,
      color: "from-sky-500 to-indigo-600",
      badge: `${aovAvailable} Tồn kho`,
      badgeColor: "#10b981",
    },
    {
      title: "Free Fire Setting & Key",
      subtitle: `${freefireLogsCount.toLocaleString()} lượt tra cứu & lấy key`,
      href: "/admin/freefire",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      badge: "Đang hoạt động",
      badgeColor: "#f59e0b",
    },
    {
      title: "Locket Gold VIP",
      subtitle: `${locketLogsCount.toLocaleString()} lượt kích hoạt thành công`,
      href: "/admin/locket",
      icon: Smartphone,
      color: "from-purple-500 to-pink-600",
      badge: `${locketLogsCount} Buffs`,
      badgeColor: "#8b5cf6",
    },
  ];

  const stats = [
    { label: "Tổng lượt truy cập", value: counter?.total ?? 0, icon: Eye, color: "stat-purple" },
    { label: "Truy cập hôm nay", value: daily?.count ?? 0, icon: Calendar, color: "stat-blue" },
    { label: "Kho Nick AOV sẵn sàng", value: aovAvailable, icon: Gift, color: "stat-green" },
    { label: "Nick AOV đã phát", value: aovClaimed, icon: Sparkles, color: "stat-cyan" },
    { label: "Lượt lấy key Free Fire", value: freefireLogsCount, icon: Flame, color: "stat-orange" },
    { label: "Lượt buff Locket Gold", value: locketLogsCount, icon: Smartphone, color: "stat-yellow" },
    { label: "Key vượt link còn hạn", value: activeKeys, icon: ShieldCheck, color: "stat-pink" },
    { label: "Cổng vượt link đang bật", value: shorteners, icon: Network, color: "stat-yellow" },
  ];

  return (
    <div className="vt-admin">
      <AdminNav current="/admin" />

      {/* TOP SERVICES SHORTCUT CARDS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--vi-text)" }}>
          🎯 Dịch Vụ Trọng Tâm Website
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {coreServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.title}
                href={srv.href}
                style={{
                  background: "var(--vi-card)",
                  border: "1px solid var(--vi-border)",
                  borderRadius: 16,
                  padding: "16px 18px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "var(--vi-shadow-sm)",
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: "rgba(99, 102, 241, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--vi-accent)",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: "var(--vi-text)" }}>
                      {srv.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--vi-muted)", marginTop: 2 }}>
                      {srv.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      background: `${srv.badgeColor}18`,
                      color: srv.badgeColor,
                      padding: "4px 8px",
                      borderRadius: 8,
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {srv.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

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
