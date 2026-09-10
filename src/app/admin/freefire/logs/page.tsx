import Link from "next/link";
import { db } from "@/lib/db";
import AdminNav from "../../AdminNav";
import { deleteFreeFireLog, clearAllFreeFireLogs } from "../../actions";
import LogVisitorCell from "./LogVisitorCell";

export const dynamic = "force-dynamic";

export default async function FreeFireLogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; device?: string; page?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const query = sp.q?.trim() || "";
  const deviceFilter = sp.device?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  // Xây dựng điều kiện lọc
  const where: any = {};
  if (query) {
    where.OR = [
      { visitorId: { contains: query, mode: "insensitive" } },
      { ip: { contains: query, mode: "insensitive" } },
      { deviceInput: { contains: query, mode: "insensitive" } },
      { browser: { contains: query, mode: "insensitive" } },
      { os: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
    ];
  }
  if (deviceFilter) {
    where.device = deviceFilter;
  }

  const [totalLogs, logs, totalAll, mobileCount, desktopCount] = await Promise.all([
    db.freeFireKeyLog.count({ where }),
    db.freeFireKeyLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.freeFireKeyLog.count(),
    db.freeFireKeyLog.count({ where: { device: "Mobile" } }),
    db.freeFireKeyLog.count({ where: { device: "Desktop" } }),
  ]);

  const totalPages = Math.ceil(totalLogs / pageSize) || 1;

  // Thống kê khách duy nhất
  const uniqueVisitorsRaw = await db.freeFireKeyLog.groupBy({
    by: ["visitorId"],
    _count: true,
  });
  const uniqueVisitors = uniqueVisitorsRaw.length;

  const fmt = (d: Date) =>
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

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/freefire" />

      {/* THANH CHUYỂN TAB CỦA FREE FIRE */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: "1px solid var(--vi-border)", paddingBottom: 12 }}>
        <Link
          href="/admin/freefire"
          className="vt-btn-sm"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            fontSize: 13,
            background: "transparent",
            color: "var(--vi-muted)",
          }}
        >
          <i className="fa-solid fa-sliders" />
          <span>Cấu Hình & Cài Đặt Khóa Key</span>
        </Link>
        <Link
          href="/admin/freefire/logs"
          className="vt-btn-sm"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            fontSize: 13,
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            color: "#f59e0b",
            fontWeight: 700,
          }}
        >
          <i className="fa-solid fa-chart-simple" />
          <span>Nhật Ký Khách Lấy Key ({totalAll})</span>
        </Link>
      </div>

      {/* THẺ TỔNG HỢP NHANH */}
      <div className="vt-row" style={{ marginBottom: 20 }}>
        <div className="vt-card">
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>
            {new Intl.NumberFormat("vi-VN").format(totalAll)}
          </div>
          <div className="vt-hint">Tổng Lượt Bấm Lấy Key</div>
        </div>
        <div className="vt-card">
          <div style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>
            {new Intl.NumberFormat("vi-VN").format(uniqueVisitors)}
          </div>
          <div className="vt-hint">Khách Duy Nhất (Unique Visitor ID)</div>
        </div>
        <div className="vt-card">
          <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>
            {new Intl.NumberFormat("vi-VN").format(mobileCount)}
          </div>
          <div className="vt-hint">Thiết Bị Mobile ({totalAll > 0 ? Math.round((mobileCount / totalAll) * 100) : 0}%)</div>
        </div>
        <div className="vt-card">
          <div style={{ fontSize: 24, fontWeight: 800, color: "#a855f7" }}>
            {new Intl.NumberFormat("vi-VN").format(desktopCount)}
          </div>
          <div className="vt-hint">Thiết Bị Desktop ({totalAll > 0 ? Math.round((desktopCount / totalAll) * 100) : 0}%)</div>
        </div>
      </div>

      {/* BẢNG LOGS */}
      <div className="vt-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fa-solid fa-list" style={{ color: "#f59e0b" }} />
            <span>Lịch Sử Lấy Key Free Fire ({totalLogs} kết quả)</span>
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Form tìm kiếm */}
            <form method="GET" style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Tìm IP, Visitor ID, máy..."
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  borderRadius: 6,
                  border: "1px solid var(--vi-border)",
                  background: "var(--vi-bg)",
                  color: "var(--vi-text)",
                  width: 200,
                }}
              />
              <select
                name="device"
                defaultValue={deviceFilter}
                style={{
                  padding: "6px 10px",
                  fontSize: 12,
                  borderRadius: 6,
                  border: "1px solid var(--vi-border)",
                  background: "var(--vi-bg)",
                  color: "var(--vi-text)",
                }}
              >
                <option value="">Tất cả thiết bị</option>
                <option value="Mobile">Mobile</option>
                <option value="Desktop">Desktop</option>
                <option value="Tablet">Tablet</option>
              </select>
              <button type="submit" className="vt-btn-sm">
                <i className="fa-solid fa-magnifying-glass" />
              </button>
              {(query || deviceFilter) && (
                <Link href="/admin/freefire/logs" className="vt-btn-sm" style={{ textDecoration: "none" }}>
                  Xóa lọc
                </Link>
              )}
            </form>

            {totalAll > 0 && (
              <form action={clearAllFreeFireLogs}>
                <button
                  type="submit"
                  className="vt-btn-sm vt-btn-danger"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <i className="fa-solid fa-trash" />
                  <span>Xóa Hết Logs</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--vi-muted)" }}>
            <i className="fa-solid fa-inbox" style={{ fontSize: 32, marginBottom: 10, opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Chưa có lượt bấm lấy key nào được ghi nhận.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="vt-table" style={{ minWidth: 780 }}>
              <thead>
                <tr>
                  <th style={{ width: 140 }}>VISITOR ID</th>
                  <th style={{ width: 155 }}>THỜI GIAN</th>
                  <th style={{ width: 130 }}>IP</th>
                  <th style={{ minWidth: 140 }}>THIẾT BỊ</th>
                  <th style={{ minWidth: 160 }}>BROWSER / OS</th>
                  <th style={{ width: 120 }}>VỊ TRÍ</th>
                  <th style={{ width: 60, textAlign: "right" }}>XOÁ</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <LogVisitorCell visitorId={log.visitorId} />
                    </td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {fmt(log.createdAt)}
                    </td>
                    <td className="vt-mono" style={{ fontSize: 12 }}>
                      {log.ip}
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: log.device === "Mobile" ? "#10b981" : "#3b82f6",
                        }}
                      >
                        <i className={log.device === "Mobile" ? "fa-solid fa-mobile-screen" : "fa-solid fa-desktop"} />
                        <span>{log.device}</span>
                      </span>
                      {log.deviceInput && (
                        <div style={{ fontSize: 11, color: "var(--vi-muted)", marginTop: 2 }}>
                          {log.deviceInput}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <span style={{ color: "var(--vi-text)" }}>
                        {log.browser || "Browser"}
                      </span>{" "}
                      /{" "}
                      <span style={{ color: "var(--vi-muted)" }}>
                        {log.os?.toLowerCase() || "os"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: log.location !== "—" ? "#10b981" : "var(--vi-muted)" }}>
                      {log.location}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <form action={deleteFreeFireLog}>
                        <input type="hidden" name="id" value={log.id} />
                        <button
                          type="submit"
                          className="vt-btn-sm vt-btn-danger"
                          style={{ padding: "4px 8px", fontSize: 11 }}
                          title="Xóa dòng log này"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--vi-border)", fontSize: 13 }}>
            <span style={{ color: "var(--vi-muted)" }}>
              Trang {page} / {totalPages} (Tổng {totalLogs} bản ghi)
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {page > 1 && (
                <Link
                  href={`/admin/freefire/logs?page=${page - 1}&q=${encodeURIComponent(query)}&device=${encodeURIComponent(deviceFilter)}`}
                  className="vt-btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  &larr; Trang trước
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/freefire/logs?page=${page + 1}&q=${encodeURIComponent(query)}&device=${encodeURIComponent(deviceFilter)}`}
                  className="vt-btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Trang sau &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
