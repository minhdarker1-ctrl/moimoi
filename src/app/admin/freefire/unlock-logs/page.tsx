import Link from "next/link";
import { db } from "@/lib/db";
import AdminNav from "../../AdminNav";
import { deleteServiceLog, clearServiceLogs } from "../../actions";

export const dynamic = "force-dynamic";

export default async function FreeFireUnlockLogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; server?: string; page?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const query = sp.q?.trim() || "";
  const serverFilter = sp.server?.trim() || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const pageSize = 50;
  const skip = (page - 1) * pageSize;

  const where: any = {
    serviceType: "FREE_FIRE",
    serviceName: { contains: "Unlock" },
  };

  if (query) {
    where.OR = [
      { targetUser: { contains: query, mode: "insensitive" } },
      { ip: { contains: query, mode: "insensitive" } },
      { device: { contains: query, mode: "insensitive" } },
    ];
  }

  if (serverFilter) {
    if (serverFilter === "kipas") {
      where.serviceName = { contains: "FF Kipas" };
    } else if (serverFilter === "astute") {
      where.serviceName = { contains: "Astute" };
    }
  }

  const [totalLogs, logs, totalAll, kipasCount, astuteCount, keyLogCount, ffConfig] = await Promise.all([
    db.serviceUsageLog.count({ where }),
    db.serviceUsageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.serviceUsageLog.count({
      where: { serviceType: "FREE_FIRE", serviceName: { contains: "Unlock" } },
    }),
    db.serviceUsageLog.count({
      where: { serviceType: "FREE_FIRE", serviceName: { contains: "Kipas" } },
    }),
    db.serviceUsageLog.count({
      where: { serviceType: "FREE_FIRE", serviceName: { contains: "Astute" } },
    }),
    db.freeFireKeyLog.count(),
    db.freeFireConfig.findUnique({ where: { id: 1 } }),
  ]);

  const totalPages = Math.ceil(totalLogs / pageSize) || 1;

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
          <span>Cấu Hình & Khóa Key</span>
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
            background: "transparent",
            color: "var(--vi-muted)",
          }}
        >
          <i className="fa-solid fa-chart-simple" />
          <span>Nhật Ký Lấy Key ({keyLogCount})</span>
        </Link>
        <Link
          href="/admin/freefire/unlock-logs"
          className="vt-btn-sm"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            fontSize: 13,
            background: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            color: "#38bdf8",
            fontWeight: 700,
          }}
        >
          <i className="fa-solid fa-bolt" />
          <span>Nhật Ký Unlock ID ({totalAll})</span>
        </Link>
      </div>

      {/* HỘP THỐNG KÊ NHANH */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div className="vt-card" style={{ padding: "14px 18px", borderLeft: "4px solid #38bdf8" }}>
          <div style={{ fontSize: 12, color: "var(--vi-muted)", marginBottom: 4 }}>Tổng số lượt Unlock ID</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>{totalAll}</div>
        </div>
        <div className="vt-card" style={{ padding: "14px 18px", borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: 12, color: "var(--vi-muted)", marginBottom: 4 }}>Cổng File Kipas</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{kipasCount}</div>
        </div>
        <div className="vt-card" style={{ padding: "14px 18px", borderLeft: "4px solid #a855f7" }}>
          <div style={{ fontSize: 12, color: "var(--vi-muted)", marginBottom: 4 }}>Cổng File Astute</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#a855f7" }}>{astuteCount}</div>
        </div>
      </div>

      {/* THANH XUẤT WHITELIST VÀ TRẠNG THÁI TELEGRAM BOT */}
      <div
        className="vt-card"
        style={{
          marginBottom: 20,
          background: "rgba(14, 165, 233, 0.05)",
          border: "1px solid rgba(14, 165, 233, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "14px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: ffConfig?.telegramNotifyEnabled ? "#22c55e" : "#64748b",
              boxShadow: ffConfig?.telegramNotifyEnabled ? "0 0 8px #22c55e" : "none",
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--vi-text)" }}>
            {ffConfig?.telegramNotifyEnabled ? (
              <>
                <strong>Bot Telegram:</strong> Đang bật tự động bắn thông báo khi có lượt unlock
              </>
            ) : (
              <>
                <strong>Bot Telegram:</strong> Chưa bật (
                <Link href="/admin/freefire" style={{ color: "#38bdf8", textDecoration: "underline" }}>
                  Bật trong Cấu hình
                </Link>
                )
              </>
            )}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <a
            href="/api/freefire/whitelist?port=kipas&format=download"
            className="vt-btn-sm"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(245, 158, 11, 0.15)",
              color: "#f59e0b",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
            }}
            title="Tải file .txt danh sách UID Kipas đã lọc trùng"
          >
            <i className="fa-solid fa-download" />
            <span>Tải TXT File Kipas</span>
          </a>

          <a
            href="/api/freefire/whitelist?port=astute&format=download"
            className="vt-btn-sm"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(168, 85, 247, 0.15)",
              color: "#c084fc",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
            }}
            title="Tải file .txt danh sách UID Astute đã lọc trùng"
          >
            <i className="fa-solid fa-download" />
            <span>Tải TXT File Astute</span>
          </a>

          <a
            href="/api/freefire/whitelist?format=download"
            className="vt-btn-sm"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
            }}
            title="Tải toàn bộ UID của cả 2 cổng"
          >
            <i className="fa-solid fa-file-arrow-down" />
            <span>Tải Toàn Bộ UID</span>
          </a>
        </div>
      </div>

      {/* BỘ LỌC & TÌM KIẾM */}
      <div className="vt-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <form method="GET" style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Tìm theo UID Free Fire hoặc IP..."
              className="vt-input"
              style={{ minWidth: 240, flex: 1 }}
            />
            <select name="server" defaultValue={serverFilter} className="vt-input" style={{ width: 170 }}>
              <option value="">Tất cả máy chủ</option>
              <option value="kipas">🎯 Cổng File Kipas</option>
              <option value="astute">⚡ Cổng File Astute</option>
            </select>
            <button type="submit" className="vt-btn-primary" style={{ padding: "8px 16px" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 6 }} />
              Tìm kiếm
            </button>
            {(query || serverFilter) && (
              <Link href="/admin/freefire/unlock-logs" className="vt-btn-sm" style={{ alignSelf: "center", textDecoration: "none" }}>
                Đặt lại
              </Link>
            )}
          </form>

          {totalAll > 0 && (
            <form action={clearServiceLogs}>
              <input type="hidden" name="serviceType" value="FREE_FIRE" />
              <button
                type="submit"
                className="vt-btn-sm"
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "8px 14px",
                  cursor: "pointer",
                }}
              >
                <i className="fa-solid fa-trash-can" style={{ marginRight: 6 }} />
                Xóa tất cả nhật ký
              </button>
            </form>
          )}
        </div>
      </div>

      {/* BẢNG DANH SÁCH NHẬT KÝ */}
      <div className="vt-card" style={{ overflowX: "auto" }}>
        <table className="vt-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid var(--vi-border)", fontSize: 13, color: "var(--vi-muted)" }}>
              <th style={{ padding: "12px 14px" }}>ID</th>
              <th style={{ padding: "12px 14px" }}>UID Free Fire</th>
              <th style={{ padding: "12px 14px" }}>Máy Chủ</th>
              <th style={{ padding: "12px 14px" }}>Thiết Bị / IP</th>
              <th style={{ padding: "12px 14px" }}>Thời Gian</th>
              <th style={{ padding: "12px 14px" }}>Trạng Thái</th>
              <th style={{ padding: "12px 14px", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px 14px", color: "var(--vi-muted)" }}>
                  Chưa có lượt Unlock ID nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isAstute = log.serviceName.includes("Astute");
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--vi-border)", fontSize: 13 }}>
                    <td style={{ padding: "12px 14px", color: "var(--vi-muted)" }}>#{log.id}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#ff8c00",
                          background: "rgba(255, 140, 0, 0.1)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(255, 140, 0, 0.25)",
                        }}
                      >
                        {log.targetUser}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: isAstute ? "rgba(168, 85, 247, 0.15)" : "rgba(34, 197, 94, 0.15)",
                          color: isAstute ? "#a855f7" : "#22c55e",
                        }}
                      >
                        {isAstute ? "⚡ Astute" : "🎯 FF Kipas"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div>{log.device || "Không rõ"}</div>
                      <small style={{ color: "var(--vi-muted)", fontSize: 11 }}>{log.ip || "unknown"}</small>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--vi-muted)" }}>{fmt(log.createdAt)}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          color: log.status === "SUCCESS" ? "#22c55e" : "#ef4444",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        ● {log.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <form action={deleteServiceLog} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={log.id} />
                        <button
                          type="submit"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--vi-muted)",
                            cursor: "pointer",
                            padding: "4px 8px",
                            fontSize: 13,
                          }}
                          title="Xóa bản ghi này"
                        >
                          <i className="fa-solid fa-trash-can" />
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

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (serverFilter) params.set("server", serverFilter);
            params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/admin/freefire/unlock-logs?${params.toString()}`}
                className="vt-btn-sm"
                style={{
                  padding: "6px 12px",
                  textDecoration: "none",
                  fontWeight: active ? 700 : 400,
                  background: active ? "var(--vi-primary)" : "transparent",
                  color: active ? "#fff" : "var(--vi-text)",
                  border: "1px solid var(--vi-border)",
                }}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
