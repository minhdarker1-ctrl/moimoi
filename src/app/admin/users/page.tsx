import Link from "next/link";
import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import {
  updateUserRole,
  updateUserCoins,
  deleteUser,
  deleteServiceLog,
  clearServiceLogs,
} from "../actions";
import {
  Users,
  Sparkles,
  Flame,
  Swords,
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Coins,
  Ticket,
  Trash2,
  ExternalLink,
  Smartphone,
  Monitor,
  Laptop,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{
    tab?: string;
    service?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const currentTab = sp.tab === "users" ? "users" : "logs";
  const serviceFilter = sp.service?.trim().toUpperCase() || "ALL";
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const pageSize = 35;
  const skip = (page - 1) * pageSize;

  // Thống kê tổng quan KPI
  const [
    totalUsers,
    adminUsers,
    totalLogs,
    locketLogs,
    freefireLogs,
    aovLogs,
    otherLogs,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: "ADMIN" } }),
    db.serviceUsageLog.count(),
    db.serviceUsageLog.count({ where: { serviceType: "LOCKET_GOLD" } }),
    db.serviceUsageLog.count({ where: { serviceType: "FREE_FIRE" } }),
    db.serviceUsageLog.count({ where: { serviceType: "AOV" } }),
    db.serviceUsageLog.count({ where: { serviceType: "OTHER" } }),
  ]);

  // Đếm số tài khoản Locket duy nhất
  const uniqueLocketAccountsRaw = await db.serviceUsageLog.groupBy({
    by: ["targetUser"],
    where: { serviceType: "LOCKET_GOLD" },
    _count: true,
  });
  const uniqueLocketAccounts = uniqueLocketAccountsRaw.length;

  const stats = [
    {
      label: "Thành viên đăng ký",
      value: totalUsers,
      sub: `${adminUsers} Quản trị viên`,
      icon: Users,
      color: "stat-blue",
    },
    {
      label: "Locket Gold (Kích hoạt)",
      value: locketLogs,
      sub: `${uniqueLocketAccounts} tài khoản Locket`,
      icon: Sparkles,
      color: "stat-yellow",
    },
    {
      label: "Free Fire Tool",
      value: freefireLogs,
      sub: "Lượt truy cập & key",
      icon: Flame,
      color: "stat-orange",
    },
    {
      label: "Liên Quân Mobile (AOV)",
      value: aovLogs,
      sub: "Tool & Mod key",
      icon: Swords,
      color: "stat-pink",
    },
    {
      label: "Tiện ích & Mod khác",
      value: otherLogs,
      sub: "App & Tiện ích",
      icon: Layers,
      color: "stat-purple",
    },
  ];

  // Dữ liệu cho TAB 1: NHẬT KÝ DỊCH VỤ (Service Usage Logs)
  let logs: any[] = [];
  let totalLogsFiltered = 0;

  if (currentTab === "logs") {
    const whereLogs: any = {};
    if (serviceFilter !== "ALL") {
      whereLogs.serviceType = serviceFilter;
    }
    if (query) {
      whereLogs.OR = [
        { targetUser: { contains: query, mode: "insensitive" } },
        { serviceName: { contains: query, mode: "insensitive" } },
        { ip: { contains: query, mode: "insensitive" } },
        { device: { contains: query, mode: "insensitive" } },
        { user: { username: { contains: query, mode: "insensitive" } } },
      ];
    }

    [totalLogsFiltered, logs] = await Promise.all([
      db.serviceUsageLog.count({ where: whereLogs }),
      db.serviceUsageLog.findMany({
        where: whereLogs,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          user: {
            select: { id: true, username: true, name: true, role: true },
          },
        },
      }),
    ]);
  }

  // Dữ liệu cho TAB 2: DANH SÁCH THÀNH VIÊN (Registered Users)
  let usersList: any[] = [];
  let totalUsersFiltered = 0;

  if (currentTab === "users") {
    const whereUsers: any = {};
    if (query) {
      whereUsers.OR = [
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ];
    }

    [totalUsersFiltered, usersList] = await Promise.all([
      db.user.count({ where: whereUsers }),
      db.user.findMany({
        where: whereUsers,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { savedKeys: true, serviceLogs: true },
          },
        },
      }),
    ]);
  }

  const currentTotal = currentTab === "logs" ? totalLogsFiltered : totalUsersFiltered;
  const totalPages = Math.ceil(currentTotal / pageSize) || 1;

  const fmtDate = (d: Date) =>
    d.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });

  function renderDeviceIcon(deviceStr: string) {
    const s = deviceStr.toLowerCase();
    if (s.includes("iphone") || s.includes("mobile") || s.includes("android")) {
      return <Smartphone size={14} className="text-emerald-500" />;
    }
    if (s.includes("mac") || s.includes("laptop")) {
      return <Laptop size={14} className="text-sky-500" />;
    }
    return <Monitor size={14} className="text-indigo-500" />;
  }

  function renderServiceBadge(type: string, name: string) {
    switch (type) {
      case "LOCKET_GOLD":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: "rgba(245, 158, 11, 0.12)",
              color: "#d97706",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <Sparkles size={13} />
            <span>Locket Gold</span>
          </span>
        );
      case "FREE_FIRE":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: "rgba(239, 68, 68, 0.12)",
              color: "#dc2626",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <Flame size={13} />
            <span>Free Fire</span>
          </span>
        );
      case "AOV":
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: "rgba(168, 85, 247, 0.12)",
              color: "#9333ea",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            <Swords size={13} />
            <span>Liên Quân AOV</span>
          </span>
        );
      default:
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              background: "rgba(99, 102, 241, 0.12)",
              color: "#4f46e5",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <Layers size={13} />
            <span>{name || "Tiện Ích Khác"}</span>
          </span>
        );
    }
  }

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/users" />

      {/* HEADER TIÊU ĐỀ */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "var(--vi-text)" }}>
          Quản Lý Người Dùng & Dịch Vụ
        </h1>
        <p className="vt-hint" style={{ marginTop: 4, marginBottom: 0 }}>
          Theo dõi số lượng người dùng, chi tiết từng dịch vụ được sử dụng (Locket Gold, Free Fire, Liên Quân, Tiện ích) và quản lý tài khoản thành viên.
        </p>
      </div>

      {/* THẺ THỐNG KÊ TỔNG QUAN (KPIs) */}
      <div className="admin-stats-grid" style={{ marginBottom: 24 }}>
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
                <span style={{ fontSize: 11, color: "var(--vi-muted)", marginTop: 2 }}>
                  {s.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* THANH CHUYỂN TAB CHÍNH */}
      <div
        style={{
          display: "flex",
          gap: 12,
          borderBottom: "2px solid var(--vi-border)",
          marginBottom: 20,
          paddingBottom: 2,
        }}
      >
        <Link
          href={`/admin/users?tab=logs${serviceFilter !== "ALL" ? `&service=${serviceFilter}` : ""}`}
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            color: currentTab === "logs" ? "var(--vi-primary, #6366f1)" : "var(--vi-muted)",
            borderBottom: currentTab === "logs" ? "2px solid var(--vi-primary, #6366f1)" : "2px solid transparent",
            marginBottom: -2,
            transition: "all 0.2s ease",
          }}
        >
          <Clock size={16} />
          <span>Nhật Ký Sử Dụng Dịch Vụ Live ({new Intl.NumberFormat("vi-VN").format(totalLogs)})</span>
        </Link>

        <Link
          href="/admin/users?tab=users"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            color: currentTab === "users" ? "var(--vi-primary, #6366f1)" : "var(--vi-muted)",
            borderBottom: currentTab === "users" ? "2px solid var(--vi-primary, #6366f1)" : "2px solid transparent",
            marginBottom: -2,
            transition: "all 0.2s ease",
          }}
        >
          <Users size={16} />
          <span>Danh Sách Thành Viên Đăng Ký ({totalUsers})</span>
        </Link>
      </div>

      {/* ========================================================
          TAB 1: NHẬT KÝ SỬ DỤNG DỊCH VỤ (SERVICE USAGE LOGS)
          ======================================================== */}
      {currentTab === "logs" && (
        <div className="vt-card">
          {/* Thanh công cụ lọc & tìm kiếm */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 18,
            }}
          >
            {/* Bộ lọc theo dịch vụ */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--vi-muted)", marginRight: 4 }}>
                Lọc dịch vụ:
              </span>
              {[
                { key: "ALL", label: "Tất cả" },
                { key: "LOCKET_GOLD", label: "💎 Locket Gold" },
                { key: "FREE_FIRE", label: "🔥 Free Fire" },
                { key: "AOV", label: "⚔️ Liên Quân" },
                { key: "OTHER", label: "📦 Tiện ích khác" },
              ].map((pill) => (
                <Link
                  key={pill.key}
                  href={`/admin/users?tab=logs&service=${pill.key}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  style={{
                    textDecoration: "none",
                    padding: "5px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      serviceFilter === pill.key
                        ? "var(--vi-primary, #6366f1)"
                        : "rgba(0, 0, 0, 0.05)",
                    color: serviceFilter === pill.key ? "#fff" : "var(--vi-text)",
                    border: "1px solid var(--vi-border)",
                  }}
                >
                  {pill.label}
                </Link>
              ))}
            </div>

            {/* Ô tìm kiếm */}
            <form method="GET" action="/admin/users" style={{ display: "flex", gap: 8 }}>
              <input type="hidden" name="tab" value="logs" />
              <input type="hidden" name="service" value={serviceFilter} />
              <div style={{ position: "relative", minWidth: 260 }}>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Tìm username, Locket UID, IP..."
                  style={{
                    width: "100%",
                    padding: "7px 32px 7px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--vi-border)",
                    background: "var(--vi-bg, transparent)",
                    color: "var(--vi-text)",
                    fontSize: 13,
                  }}
                />
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--vi-muted)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <button className="vt-btn-primary" type="submit" style={{ padding: "6px 14px", fontSize: 13 }}>
                Tìm
              </button>
            </form>
          </div>

          {/* Bảng nhật ký */}
          <div style={{ overflowX: "auto" }}>
            <table className="vt-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", width: 160 }}>Thời Gian</th>
                  <th style={{ textAlign: "left", width: 140 }}>Dịch Vụ</th>
                  <th style={{ textAlign: "left" }}>Tài Khoản / Người Dùng</th>
                  <th style={{ textAlign: "left", width: 180 }}>Thiết Bị & IP</th>
                  <th style={{ textAlign: "center", width: 110 }}>Trạng Thái</th>
                  <th style={{ textAlign: "left" }}>Chi Tiết</th>
                  <th style={{ textAlign: "right", width: 60 }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "40px 10px", color: "var(--vi-muted)" }}>
                      Chưa có nhật ký sử dụng dịch vụ nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  logs.map((item) => {
                    let meta: any = {};
                    try {
                      meta = JSON.parse(item.metadata || "{}");
                    } catch {}

                    return (
                      <tr key={item.id}>
                        {/* Thời gian */}
                        <td style={{ fontSize: 12, color: "var(--vi-muted)", whiteSpace: "nowrap" }}>
                          {fmtDate(new Date(item.createdAt))}
                        </td>

                        {/* Dịch vụ */}
                        <td>{renderServiceBadge(item.serviceType, item.serviceName)}</td>

                        {/* Người dùng / Target user */}
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--vi-text)" }}>
                              {item.targetUser || "Khách ẩn danh"}
                            </span>
                            {item.user && (
                              <span style={{ fontSize: 11, color: "var(--vi-primary, #6366f1)" }}>
                                👤 Thành viên: @{item.user.username}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Thiết bị & IP */}
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              {renderDeviceIcon(item.device || "")}
                              <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.device || "Không rõ thiết bị"}
                              </span>
                            </div>
                            <span style={{ color: "var(--vi-muted)", fontSize: 11, fontFamily: "monospace" }}>
                              {item.ip || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td style={{ textAlign: "center" }}>
                          {item.status === "SUCCESS" ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 8px",
                                borderRadius: 99,
                                fontSize: 11,
                                fontWeight: 700,
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#10b981",
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Thành công</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "2px 8px",
                                borderRadius: 99,
                                fontSize: 11,
                                fontWeight: 700,
                                background: "rgba(239, 68, 68, 0.15)",
                                color: "#ef4444",
                              }}
                            >
                              <XCircle size={12} />
                              <span>Thất bại</span>
                            </span>
                          )}
                        </td>

                        {/* Chi tiết metadata */}
                        <td style={{ fontSize: 12, color: "var(--vi-muted)" }}>
                          {item.serviceType === "LOCKET_GOLD" && (
                            <div>
                              {meta.expiresDate && (
                                <div>
                                  Hạn: <strong style={{ color: "#d97706" }}>{meta.expiresDate}</strong>
                                </div>
                              )}
                              {meta.uid && (
                                <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--vi-muted)" }}>
                                  UID: {meta.uid.slice(0, 10)}...
                                </span>
                              )}
                              {meta.error && (
                                <span style={{ color: "#ef4444", fontSize: 11 }}>
                                  {meta.error}
                                </span>
                              )}
                            </div>
                          )}

                          {item.serviceType === "FREE_FIRE" && (
                            <div>
                              {meta.keyTypeName && (
                                <span>Gói: <strong>{meta.keyTypeName}</strong></span>
                              )}
                              {meta.location && (
                                <span style={{ marginLeft: 6, fontSize: 11, color: "var(--vi-muted)" }}>
                                  📍 {meta.location}
                                </span>
                              )}
                            </div>
                          )}

                          {item.serviceType !== "LOCKET_GOLD" && item.serviceType !== "FREE_FIRE" && (
                            <div>
                              {meta.keyTypeName && (
                                <span>Key: <strong>{meta.keyTypeName}</strong></span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Xóa log */}
                        <td style={{ textAlign: "right" }}>
                          <form action={deleteServiceLog}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              className="vt-btn-sm"
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--vi-muted)",
                                cursor: "pointer",
                                padding: 4,
                              }}
                              title="Xóa bản ghi này"
                            >
                              <Trash2 size={14} />
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Dọn dẹp logs & Phân trang */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 18,
              paddingTop: 12,
              borderTop: "1px solid var(--vi-border)",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <form action={clearServiceLogs}>
              <input type="hidden" name="serviceType" value={serviceFilter} />
              <button
                type="submit"
                className="vt-btn-sm"
                style={{
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "6px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onClick={(e) => {
                  if (!confirm(`Bạn có chắc muốn xóa tất cả log của dịch vụ [${serviceFilter}]?`)) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 size={13} />
                <span>Xóa sạch nhật ký ({serviceFilter})</span>
              </button>
            </form>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {page > 1 && (
                  <Link
                    href={`/admin/users?tab=logs&service=${serviceFilter}&page=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className="vt-btn-sm"
                    style={{ textDecoration: "none", padding: "5px 12px", fontSize: 12 }}
                  >
                    « Trang trước
                  </Link>
                )}
                <span style={{ fontSize: 13, color: "var(--vi-muted)" }}>
                  Trang {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/admin/users?tab=logs&service=${serviceFilter}&page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className="vt-btn-sm"
                    style={{ textDecoration: "none", padding: "5px 12px", fontSize: 12 }}
                  >
                    Trang sau »
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: DANH SÁCH THÀNH VIÊN ĐĂNG KÝ (REGISTERED USERS)
          ======================================================== */}
      {currentTab === "users" && (
        <div className="vt-card">
          {/* Thanh tìm kiếm user */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <form method="GET" action="/admin/users" style={{ display: "flex", gap: 8 }}>
              <input type="hidden" name="tab" value="users" />
              <div style={{ position: "relative", minWidth: 280 }}>
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Tìm theo username, email, tên..."
                  style={{
                    width: "100%",
                    padding: "7px 32px 7px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--vi-border)",
                    background: "var(--vi-bg, transparent)",
                    color: "var(--vi-text)",
                    fontSize: 13,
                  }}
                />
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--vi-muted)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <button className="vt-btn-primary" type="submit" style={{ padding: "6px 14px", fontSize: 13 }}>
                Tìm
              </button>
            </form>
          </div>

          {/* Bảng thành viên */}
          <div style={{ overflowX: "auto" }}>
            <table className="vt-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", width: 60 }}>ID</th>
                  <th style={{ textAlign: "left" }}>Thành Viên</th>
                  <th style={{ textAlign: "left" }}>Email</th>
                  <th style={{ textAlign: "center", width: 140 }}>Vai Trò (Role)</th>
                  <th style={{ textAlign: "center", width: 160 }}>Coins & Vé Quay</th>
                  <th style={{ textAlign: "center", width: 140 }}>Dịch Vụ Đã Dùng</th>
                  <th style={{ textAlign: "left", width: 150 }}>Ngày Tham Gia</th>
                  <th style={{ textAlign: "right", width: 70 }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "40px 10px", color: "var(--vi-muted)" }}>
                      Không tìm thấy thành viên nào.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id}>
                      {/* ID */}
                      <td style={{ color: "var(--vi-muted)", fontSize: 12 }}>#{u.id}</td>

                      {/* Thành viên */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt=""
                              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 14,
                              }}
                            >
                              {(u.name || u.username).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--vi-text)" }}>
                              {u.name || u.username}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--vi-muted)" }}>
                              @{u.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ fontSize: 12, color: "var(--vi-text)" }}>
                        {u.email || <span style={{ color: "var(--vi-muted)" }}>Chưa liên kết</span>}
                      </td>

                      {/* Role & Form đổi role */}
                      <td style={{ textAlign: "center" }}>
                        <form action={updateUserRole} style={{ display: "inline-block" }}>
                          <input type="hidden" name="userId" value={u.id} />
                          <select
                            name="role"
                            defaultValue={u.role}
                            onChange={(e) => e.target.form?.requestSubmit()}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              background: u.role === "ADMIN" ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)",
                              color: u.role === "ADMIN" ? "#ef4444" : "#3b82f6",
                              border: "1px solid var(--vi-border)",
                              cursor: "pointer",
                            }}
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </form>
                      </td>

                      {/* Coins & Vé quay */}
                      <td style={{ textAlign: "center" }}>
                        <form action={updateUserCoins} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <input type="hidden" name="userId" value={u.id} />
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }} title="Coins">
                            <Coins size={13} className="text-amber-500" />
                            <input
                              type="number"
                              name="coins"
                              defaultValue={u.coins}
                              style={{
                                width: 55,
                                padding: "2px 4px",
                                borderRadius: 4,
                                border: "1px solid var(--vi-border)",
                                fontSize: 12,
                                textAlign: "center",
                                background: "var(--vi-bg, transparent)",
                                color: "var(--vi-text)",
                              }}
                            />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }} title="Vé quay">
                            <Ticket size={13} className="text-pink-500" />
                            <input
                              type="number"
                              name="spinTickets"
                              defaultValue={u.spinTickets}
                              style={{
                                width: 40,
                                padding: "2px 4px",
                                borderRadius: 4,
                                border: "1px solid var(--vi-border)",
                                fontSize: 12,
                                textAlign: "center",
                                background: "var(--vi-bg, transparent)",
                                color: "var(--vi-text)",
                              }}
                            />
                          </div>
                          <button
                            type="submit"
                            style={{
                              padding: "2px 6px",
                              fontSize: 11,
                              borderRadius: 4,
                              background: "var(--vi-primary, #6366f1)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Lưu
                          </button>
                        </form>
                      </td>

                      {/* Dịch vụ đã dùng */}
                      <td style={{ textAlign: "center" }}>
                        <Link
                          href={`/admin/users?tab=logs&q=${encodeURIComponent(u.username)}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            textDecoration: "none",
                            padding: "4px 8px",
                            borderRadius: 6,
                            background: "rgba(99, 102, 241, 0.1)",
                            color: "var(--vi-primary, #6366f1)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          <span>{u._count.serviceLogs} lượt</span>
                          <ExternalLink size={11} />
                        </Link>
                      </td>

                      {/* Ngày tạo */}
                      <td style={{ fontSize: 12, color: "var(--vi-muted)" }}>
                        {fmtDate(new Date(u.createdAt))}
                      </td>

                      {/* Xóa user */}
                      <td style={{ textAlign: "right" }}>
                        <form action={deleteUser}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: 4,
                            }}
                            title="Xóa tài khoản này"
                            onClick={(e) => {
                              if (!confirm(`Bạn có chắc muốn xóa tài khoản @${u.username}?`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang Users */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 8,
                marginTop: 18,
                paddingTop: 12,
                borderTop: "1px solid var(--vi-border)",
              }}
            >
              {page > 1 && (
                <Link
                  href={`/admin/users?tab=users&page=${page - 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  className="vt-btn-sm"
                  style={{ textDecoration: "none", padding: "5px 12px", fontSize: 12 }}
                >
                  « Trang trước
                </Link>
              )}
              <span style={{ fontSize: 13, color: "var(--vi-muted)" }}>
                Trang {page} / {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/admin/users?tab=users&page=${page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  className="vt-btn-sm"
                  style={{ textDecoration: "none", padding: "5px 12px", fontSize: 12 }}
                >
                  Trang sau »
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
