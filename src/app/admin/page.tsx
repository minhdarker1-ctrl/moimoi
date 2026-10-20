import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { vnDate } from "@/lib/crypto";
import AdminNav from "./AdminNav";
import AdminCharts, { LinePoint, BarDay, DonutSegment } from "@/components/admin/AdminCharts";
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
  Activity,
  Cpu,
  Database,
  Bot,
  ExternalLink,
  AlertTriangle,
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

  // 1. Chuẩn bị dải 14 ngày gần nhất để truy vấn tối ưu 1 lần (Zero N+1)
  const now = new Date();
  const dates14: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dates14.push(vnDate(d));
  }
  const earliestDateTime = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let counter = null;
  let daily = null;
  let users = 0;
  let activeKeys = 0;
  let shorteners = 0;
  let aovAvailable = 0;
  let aovClaimed = 0;
  let freefireLogsCount = 0;
  let locketLogsCount = 0;
  let ffConfig = null;
  let ontopBufferCount = 0;
  let dailyHits14: { date: string; count: number }[] = [];
  let recentUsageLogs14: { id: number; serviceType: string; status: string; createdAt: Date }[] = [];
  let latestActivityLogs: {
    id: number;
    serviceType: string;
    serviceName: string;
    targetUser: string;
    status: string;
    createdAt: Date;
  }[] = [];

  try {
    const results = await Promise.all([
      db.counter.findUnique({ where: { id: 1 } }),
      db.dailyHit.findUnique({ where: { date: today } }),
      db.user.count(),
      db.appKey.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
      db.shortener.count({ where: { enabled: true } }),
      db.gameAccount.count({ where: { game: "AOV", status: "AVAILABLE" } }),
      db.gameAccount.count({ where: { game: "AOV", status: "CLAIMED" } }),
      db.freeFireKeyLog.count(),
      db.serviceUsageLog.count({ where: { serviceType: "LOCKET_GOLD" } }),
      db.freeFireConfig.findUnique({ where: { id: 1 } }),
      db.ontopLinkBuffer.count({ where: { status: "AVAILABLE" } }),
      // Tối ưu DB: 1 truy vấn duy nhất cho 14 ngày truy cập
      db.dailyHit.findMany({
        where: { date: { in: dates14 } },
        select: { date: true, count: true },
      }),
      // Tối ưu DB: 1 truy vấn duy nhất cho 14 ngày nhật ký dịch vụ
      db.serviceUsageLog.findMany({
        where: { createdAt: { gte: earliestDateTime } },
        select: { id: true, serviceType: true, status: true, createdAt: true },
      }),
      // Live Activity Feed 10 logs mới nhất
      db.serviceUsageLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          serviceType: true,
          serviceName: true,
          targetUser: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    counter = results[0];
    daily = results[1];
    users = results[2];
    activeKeys = results[3];
    shorteners = results[4];
    aovAvailable = results[5];
    aovClaimed = results[6];
    freefireLogsCount = results[7];
    locketLogsCount = results[8];
    ffConfig = results[9];
    ontopBufferCount = results[10];
    dailyHits14 = results[11];
    recentUsageLogs14 = results[12];
    latestActivityLogs = results[13];
  } catch (err) {
    console.error("Error loading admin stats:", err);
  }

  // 2. Gom nhóm dữ liệu biểu đồ bằng JavaScript (In-Memory Processing)
  const hitMap = new Map(dailyHits14.map((h) => [h.date, h.count]));
  const lineChartData: LinePoint[] = dates14.map((d) => ({
    date: d.slice(5),
    fullDate: d,
    hits: hitMap.get(d) || (d === today ? (daily?.count ?? 0) : 0),
  }));

  const dates7 = dates14.slice(7);
  const barChartData: BarDay[] = dates7.map((d) => {
    const dayLogs = recentUsageLogs14.filter((l) => vnDate(l.createdAt) === d);
    return {
      date: d.slice(5),
      fullDate: d,
      freefire: dayLogs.filter((l) => l.serviceType === "FREE_FIRE" || l.serviceType === "FREEFIRE").length,
      locket: dayLogs.filter((l) => l.serviceType === "LOCKET_GOLD").length,
      aov: dayLogs.filter((l) => l.serviceType === "AOV").length,
      total: dayLogs.length,
    };
  });

  let ffTotal = 0;
  let locketTotal = 0;
  let aovTotal = 0;
  let otherTotal = 0;
  for (const l of recentUsageLogs14) {
    if (l.serviceType === "FREE_FIRE" || l.serviceType === "FREEFIRE") ffTotal++;
    else if (l.serviceType === "LOCKET_GOLD") locketTotal++;
    else if (l.serviceType === "AOV") aovTotal++;
    else otherTotal++;
  }

  const donutChartData: DonutSegment[] = [
    { name: "Free Fire Verify", count: ffTotal, color: "#f59e0b" },
    { name: "Locket Gold VIP", count: locketTotal, color: "#8b5cf6" },
    { name: "Kho Acc Liên Quân", count: aovTotal, color: "#06b6d4" },
    { name: "Dịch Vụ Khác", count: otherTotal, color: "#10b981" },
  ].filter((d) => d.count > 0);

  if (donutChartData.length === 0) {
    donutChartData.push({ name: "Chưa có dữ liệu", count: 1, color: "#475569" });
  }

  // 3. System Health Diagnostics
  const lastBeatTime = ffConfig?.workerHeartbeatAt ? new Date(ffConfig.workerHeartbeatAt).getTime() : 0;
  const isWorkerOnline = Date.now() - lastBeatTime < 60_000;
  const workerLastSeenSec = Math.max(0, Math.floor((Date.now() - lastBeatTime) / 1000));

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
    {
      title: "Kho Ứng Dụng & Mod",
      subtitle: "Tải app và mod trực tiếp không qua link rút gọn",
      href: "/admin/apps",
      icon: AppWindow,
      color: "from-emerald-500 to-teal-600",
      badge: "VIP Admin",
      badgeColor: "#10b981",
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

      {/* 1. SYSTEM HEALTH BAR (TRẠNG THÁI HỆ THỐNG PHÂN TÁN) */}
      <div className="admin-health-bar">
        <div className="health-item">
          <div className="health-icon bg-indigo-500/10 text-indigo-400">
            <Cpu size={16} />
          </div>
          <div className="health-info">
            <span className="health-title">Worker Node:</span>
            <span className={`health-status ${isWorkerOnline ? "online" : "offline"}`}>
              <span className="health-dot" />
              {isWorkerOnline ? `Hoạt động (${workerLastSeenSec}s trước)` : "Đang nghỉ (Offline)"}
            </span>
          </div>
        </div>

        <div className="health-item">
          <div className="health-icon bg-amber-500/10 text-amber-400">
            <Database size={16} />
          </div>
          <div className="health-info">
            <span className="health-title">Khay Đệm OnTop:</span>
            <span className={`health-status ${ontopBufferCount >= 5 ? "online" : ontopBufferCount > 0 ? "warning" : "offline"}`}>
              <span className="health-dot" />
              {ontopBufferCount} link sẵn sàng {ontopBufferCount < 5 && "(Cần nạp thêm)"}
            </span>
          </div>
        </div>

        <div className="health-item">
          <div className="health-icon bg-emerald-500/10 text-emerald-400">
            <Bot size={16} />
          </div>
          <div className="health-info">
            <span className="health-title">Cổng Ưu Tiên:</span>
            <span className="health-status online">
              <span className="health-dot" />
              #1 VietUser (Tự động fallback)
            </span>
          </div>
        </div>

        <div className="health-item">
          <Link
            href="/freefire"
            target="_blank"
            className="admin-vip-link-btn"
            title="Mở giao diện người dùng với tư cách Quản trị viên"
          >
            <span>👑 Test Quyền Admin</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* 2. TOP SERVICES SHORTCUT CARDS */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 12px", color: "var(--vi-text)" }}>
          🎯 Dịch Vụ Trọng Tâm Website
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
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

      {/* 3. THẺ THỐNG KÊ TỔNG QUAN HIỆN ĐẠI */}
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

      {/* 4. TRUNG TÂM BIỂU ĐỒ TRỰC QUAN (14-DAY LINE + 7-DAY BAR + 14-DAY DONUT) */}
      <div style={{ marginTop: 24 }}>
        <AdminCharts lineData={lineChartData} barData={barChartData} donutData={donutChartData} />
      </div>

      {/* 5. NHẬT KÝ HOẠT ĐỘNG THỜI GIAN THỰC (LIVE ACTIVITY FEED) */}
      <div className="vt-card" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 10, color: "var(--vi-text)" }}>
            <Activity size={18} className="text-indigo-400" />
            <span>Hoạt Động Dịch Vụ Mới Nhất (Live Activity)</span>
          </h2>
          <span style={{ fontSize: 12, color: "var(--vi-muted)" }}>10 giao dịch gần nhất</span>
        </div>

        {latestActivityLogs.length === 0 ? (
          <p style={{ color: "var(--vi-muted)", fontSize: 13, textAlign: "center", margin: "20px 0" }}>
            Chưa có nhật ký hoạt động nào gần đây.
          </p>
        ) : (
          <div className="admin-activity-table-wrapper">
            <table className="admin-activity-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Dịch vụ</th>
                  <th>Đối tượng / Target</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {latestActivityLogs.map((log) => {
                  const d = new Date(log.createdAt);
                  const pad = (n: number) => n.toString().padStart(2, "0");
                  const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} - ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
                  const isSuccess = log.status === "SUCCESS";
                  const isFailed = log.status === "FAILED";

                  return (
                    <tr key={log.id}>
                      <td style={{ fontSize: 12.5, color: "var(--vi-muted)", whiteSpace: "nowrap" }}>
                        {timeStr}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--vi-text)" }}>
                        {log.serviceName || log.serviceType}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12.5 }}>
                        {log.targetUser || "—"}
                      </td>
                      <td>
                        <span
                          className={`admin-status-pill ${
                            isSuccess ? "success" : isFailed ? "failed" : "pending"
                          }`}
                        >
                          {isSuccess ? "Thành công" : isFailed ? "Thất bại" : log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. FORM TÙY CHỈNH THÔNG SỐ LƯỢT TRUY CẬP (STATSBAR LIVE) */}
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
