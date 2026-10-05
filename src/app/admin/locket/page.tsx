import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import AdminNav from "../AdminNav";
import { deleteServiceLog, clearServiceLogs } from "../actions";
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function AdminLocketPage({ searchParams }: Props) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/admin/login?redirect=/admin/locket");
  }

  const sp = searchParams ? await searchParams : {};
  const query = sp.q?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const pageSize = 40;
  const skip = (page - 1) * pageSize;

  let totalLogs = 0;
  let successLogs = 0;
  let uniqueAccounts = 0;

  try {
    [totalLogs, successLogs] = await Promise.all([
      db.serviceUsageLog.count({ where: { serviceType: "LOCKET_GOLD" } }),
      db.serviceUsageLog.count({ where: { serviceType: "LOCKET_GOLD", status: "SUCCESS" } }),
    ]);

    const distinctAccounts = await db.serviceUsageLog.findMany({
      where: { serviceType: "LOCKET_GOLD" },
      select: { targetUser: true },
      distinct: ["targetUser"],
    });
    uniqueAccounts = distinctAccounts.length;
  } catch (e) {
    console.error("Lỗi đếm số liệu Locket:", e);
  }

  const whereCondition: any = { serviceType: "LOCKET_GOLD" };
  if (query) {
    whereCondition.OR = [
      { targetUser: { contains: query, mode: "insensitive" } },
      { ip: { contains: query, mode: "insensitive" } },
      { metadata: { contains: query, mode: "insensitive" } },
    ];
  }

  const [logs, filteredCount] = await Promise.all([
    db.serviceUsageLog.findMany({
      where: whereCondition,
      include: {
        user: { select: { id: true, username: true, name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.serviceUsageLog.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(filteredCount / pageSize) || 1;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/locket" />

      {/* Header & Quick stats */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px", color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 8 }}>
              <Smartphone style={{ color: "#f59e0b" }} size={24} />
              <span>Quản Lý Buff Locket Gold</span>
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--vi-muted)" }}>
              Theo dõi lịch sử nâng cấp Locket Gold, tài khoản người dùng và trạng thái kích hoạt từ hệ thống.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/locket"
              target="_blank"
              className="vt-btn-sm"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "rgba(245, 158, 11, 0.12)",
                color: "#d97706",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                fontWeight: 700,
              }}
            >
              <ExternalLink size={14} />
              <span>Xem Trang Locket Gold</span>
            </Link>
          </div>
        </div>

        {/* 3 KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 20,
          }}
        >
          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>✨ TỔNG LƯỢT KÍCH HOẠT</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b", marginTop: 4 }}>
              {totalLogs.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>lần</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              Tất cả các phiên yêu cầu buff Locket
            </div>
          </div>

          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>👤 TÀI KHOẢN ĐỘC NHẤT</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#10b981", marginTop: 4 }}>
              {uniqueAccounts.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>user</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              Số username Locket khác nhau đã được buff
            </div>
          </div>

          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "var(--vi-shadow-sm)",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 600 }}>✅ TỶ LỆ THÀNH CÔNG</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#38bdf8", marginTop: 4 }}>
              {totalLogs > 0 ? Math.round((successLogs / totalLogs) * 100) : 100}%
            </div>
            <div style={{ fontSize: 12, color: "var(--vi-muted)", marginTop: 4 }}>
              {successLogs.toLocaleString()} / {totalLogs.toLocaleString()} kích hoạt thành công
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: "var(--vi-card)",
          border: "1px solid var(--vi-border)",
          borderRadius: 20,
          padding: "22px",
          boxShadow: "var(--vi-shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 4px", color: "var(--vi-text)" }}>
              Nhật Ký Kích Hoạt ({filteredCount.toLocaleString()})
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--vi-muted)" }}>
              Trang {page} / {totalPages}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search form */}
            <form method="GET" action="/admin/locket" style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Tìm user Locket, IP..."
                className="vt-input"
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12.5, width: 180 }}
              />
              <button
                type="submit"
                className="vt-btn-sm"
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12.5, cursor: "pointer" }}
              >
                <Search size={14} />
              </button>
            </form>

            {/* Clear logs */}
            {totalLogs > 0 && (
              <form action={clearServiceLogs}>
                <input type="hidden" name="serviceType" value="LOCKET_GOLD" />
                <button
                  type="submit"
                  className="vt-btn-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  title="Dọn sạch nhật ký Locket Gold"
                >
                  <Trash2 size={13} style={{ marginRight: 4, display: "inline-block" }} />
                  Xóa Lịch Sử Locket
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--vi-border)", textAlign: "left", color: "var(--vi-muted)" }}>
                <th style={{ padding: "10px 12px" }}>ID</th>
                <th style={{ padding: "10px 12px" }}>Tài khoản Locket</th>
                <th style={{ padding: "10px 12px" }}>Thành viên</th>
                <th style={{ padding: "10px 12px" }}>IP & Thiết bị</th>
                <th style={{ padding: "10px 12px" }}>Trạng thái</th>
                <th style={{ padding: "10px 12px" }}>Chi tiết / Metadata</th>
                <th style={{ padding: "10px 12px" }}>Thời gian</th>
                <th style={{ padding: "10px 12px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "30px", textAlign: "center", color: "var(--vi-muted)" }}>
                    Không có nhật ký nào phù hợp.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  let meta: any = {};
                  try {
                    meta = JSON.parse(log.metadata || "{}");
                  } catch {}

                  return (
                    <tr key={log.id} style={{ borderBottom: "1px solid var(--vi-border)" }}>
                      <td style={{ padding: "10px 12px", color: "var(--vi-muted)", fontFamily: "monospace" }}>
                        #{log.id}
                      </td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--vi-text)" }}>
                        <span style={{ fontFamily: "monospace", color: "#d97706" }}>
                          @{log.targetUser || "ẩn danh"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {log.user ? (
                          <span style={{ fontWeight: 600, color: "var(--vi-text)" }}>
                            {log.user.name || log.user.username}
                          </span>
                        ) : (
                          <span style={{ color: "var(--vi-muted)", fontSize: 12 }}>Khách vãng lai</span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--vi-muted)" }}>
                        <div>{log.ip || "—"}</div>
                        {log.device && <div style={{ fontSize: 11 }}>{log.device}</div>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {log.status === "SUCCESS" ? (
                          <span
                            style={{
                              background: "rgba(16, 185, 129, 0.12)",
                              color: "#10b981",
                              padding: "3px 8px",
                              borderRadius: 6,
                              fontSize: 11.5,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <CheckCircle2 size={12} />
                            THÀNH CÔNG
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "rgba(239, 68, 68, 0.12)",
                              color: "#ef4444",
                              padding: "3px 8px",
                              borderRadius: 6,
                              fontSize: 11.5,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <XCircle size={12} />
                            THẤT BẠI
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--vi-muted)", maxWidth: 220 }}>
                        {meta.expiresDate ? (
                          <div>Hạn: <b style={{ color: "var(--vi-text)" }}>{meta.expiresDate}</b></div>
                        ) : null}
                        {meta.uid ? (
                          <div style={{ fontFamily: "monospace", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }}>
                            UID: {meta.uid}
                          </div>
                        ) : null}
                        {!meta.expiresDate && !meta.uid && log.metadata !== "{}" ? (
                          <span style={{ fontFamily: "monospace", fontSize: 11 }}>{log.metadata}</span>
                        ) : null}
                      </td>
                      <td style={{ padding: "10px 12px", color: "var(--vi-muted)", fontSize: 12 }}>
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <form action={deleteServiceLog} style={{ display: "inline-block" }}>
                          <input type="hidden" name="id" value={log.id} />
                          <button
                            type="submit"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              padding: "4px 8px",
                              borderRadius: 6,
                              fontSize: 12.5,
                            }}
                            title="Xóa nhật ký này"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/locket?page=${p}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12.5,
                  textDecoration: "none",
                  fontWeight: 600,
                  background: page === p ? "var(--vi-accent)" : "var(--vi-surface)",
                  color: page === p ? "#fff" : "var(--vi-muted)",
                  border: "1px solid var(--vi-border)",
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
