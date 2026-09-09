import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import AdminNav from "./AdminNav";
import { updateCounter } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams?: Promise<{ counter_saved?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const isSaved = sp.counter_saved === "1";
  const today = vnDate();

  const [counter, daily, apps, keys, active, shorteners] = await Promise.all([
    db.counter.findUnique({ where: { id: 1 } }),
    db.dailyHit.findUnique({ where: { date: today } }),
    db.app.count(),
    db.appKey.count(),
    db.appKey.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
    db.shortener.count({ where: { enabled: true } }),
  ]);

  const stats = [
    ["Tổng truy cập", counter?.total ?? 0],
    ["Hôm nay", daily?.count ?? 0],
    ["Ứng dụng", apps],
    ["Key còn hiệu lực", active],
    ["Tổng key đã phát", keys],
    ["Cổng đang bật", shorteners],
  ] as const;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin" />

      {isSaved && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            background: "rgba(34, 197, 94, 0.15)",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            color: "#4ade80",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ fontSize: 18 }} />
          <span>Đã lưu thành công thông số lượt truy cập! Hệ thống đã áp dụng ra ngoài trang chủ.</span>
        </div>
      )}

      {/* THẺ THỐNG KÊ TỔNG QUAN */}
      <div className="vt-row">
        {stats.map(([label, value]) => (
          <div key={label} className="vt-card">
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {new Intl.NumberFormat("vi-VN").format(value)}
            </div>
            <div className="vt-hint">{label}</div>
          </div>
        ))}
      </div>

      {/* FORM TÙY CHỈNH THÔNG SỐ LƯỢT TRUY CẬP */}
      <div className="vt-card" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginTop: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 10, color: "#3b82f6" }}>
          <i className="fa-solid fa-chart-line" />
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

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
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
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              }}
            >
              <i className="fa-solid fa-floppy-disk" />
              <span>Lưu Thông Số Lượt Truy Cập</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
