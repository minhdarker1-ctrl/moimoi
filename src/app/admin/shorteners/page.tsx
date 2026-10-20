import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import { PROVIDERS } from "@/lib/shorteners";
import AdminNav from "../AdminNav";
import { saveShortener, deleteShortener } from "../actions";
import { Network, Plus, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShortenersPage() {
  const rows = await db.shortener.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  const today = vnDate();

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/shorteners" />

      {/* HEADER BANNER & HƯỚNG DẪN */}
      <div className="vt-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99, 102, 241, 0.12)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Network size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "var(--vi-text)" }}>
              Quản Lý Cổng Rút Gọn Link &amp; Quota
            </h1>
            <p className="vt-hint" style={{ margin: 0, lineHeight: 1.6 }}>
              Hệ thống điều phối liên kết vượt link tự động. Cổng <strong>VietUser</strong> được cấu hình làm cổng ưu tiên mặc định số 1.
              Khi một cổng chạm mốc Giới hạn ngày (Quota limit), hệ thống sẽ tự động nhảy sang cổng kế tiếp theo thứ tự sắp xếp bên dưới.
            </p>
          </div>
        </div>
      </div>

      {/* FORM THÊM CỔNG MỚI */}
      <div className="vt-card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Plus size={18} className="text-indigo-400" />
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Thêm Cổng Rút Gọn Mới</h2>
        </div>

        <form action={saveShortener} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Loại Cổng (Provider)</span>
              <select name="provider" required defaultValue="VIETUSER">
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id === "VIETUSER" ? `⭐ [ƯU TIÊN #1] ${p.label}` : p.label}
                    {p.dailyLimit > 0 ? ` (${p.dailyLimit}/ngày)` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="vt-field">
              <span>Tên Gợi Nhớ (Ghi chú)</span>
              <input type="text" name="name" placeholder="VD: VietUser Cổng Chính" />
            </label>
          </div>

          <label className="vt-field">
            <span>Token / API Key Bảo Mật</span>
            <input type="text" name="token" required autoComplete="off" placeholder="Nhập API token của cổng..." />
            <small className="vt-hint">Token được mã hóa an toàn AES-256 trước khi lưu vào cơ sở dữ liệu.</small>
          </label>

          <div className="vt-row">
            <label className="vt-field">
              <span>Giới Hạn Ngày (0 = Không giới hạn)</span>
              <input type="number" name="dailyLimit" defaultValue={0} min={0} />
            </label>
            <label className="vt-field">
              <span>Thứ Tự Ưu Tiên (Nhỏ hơn = Chạy trước)</span>
              <input type="number" name="order" defaultValue={rows.length} />
            </label>
          </div>

          <label className="vt-check" style={{ marginBottom: 16 }}>
            <input type="checkbox" name="enabled" defaultChecked />
            <span>Kích hoạt cổng này ngay lập tức</span>
          </label>

          <button className="vt-btn-primary" type="submit" style={{ padding: "10px 22px", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} />
            <span>Thêm Cổng Vào Hệ Thống</span>
          </button>
        </form>
      </div>

      {/* DANH SÁCH CÁC CỔNG HIỆN CÓ KÈM THANH TIẾN ĐỘ QUOTA THẬT */}
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px", color: "var(--vi-text)" }}>
        Danh Sách Cổng Rút Gọn Hoạt Động ({rows.length} Cổng)
      </h2>

      {rows.length === 0 ? (
        <div className="vt-card" style={{ textAlign: "center", padding: "32px 16px" }}>
          <p style={{ color: "var(--vi-muted)", margin: 0 }}>Chưa có cổng rút gọn nào được cấu hình. Vui lòng thêm cổng ở form trên!</p>
        </div>
      ) : (
        rows.map((r) => {
          const used = r.dailyDate === today ? r.dailyUsed : 0;
          const hasLimit = r.dailyLimit > 0;
          const left = hasLimit ? Math.max(0, r.dailyLimit - used) : null;
          const pct = hasLimit ? Math.min(100, Math.round((used / r.dailyLimit) * 100)) : 0;
          const isVietUser = r.provider === "VIETUSER";

          return (
            <div
              key={r.id}
              className="vt-card"
              style={{
                marginBottom: 16,
                border: isVietUser ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid var(--vi-border)",
                background: isVietUser ? "linear-gradient(180deg, rgba(245, 158, 11, 0.04), var(--vi-card))" : "var(--vi-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="vt-tag">ID #{r.id}</span>
                  <span className="vt-tag" style={{ fontWeight: 700, color: "var(--vi-text)" }}>
                    {r.provider}
                  </span>
                  {isVietUser && (
                    <span
                      style={{
                        background: "rgba(245, 158, 11, 0.15)",
                        color: "#f59e0b",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ⭐ CỔNG ƯU TIÊN #1
                    </span>
                  )}
                  <span className="vt-tag" style={{ color: "var(--vi-muted)" }}>
                    token ••••{r.tokenHint}
                  </span>
                  <span className={`admin-status-pill ${r.enabled ? "success" : "failed"}`}>
                    {r.enabled ? "Đang bật" : "Đã tắt"}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: "var(--vi-muted)" }}>
                  Thứ tự: <strong>#{r.order}</strong>
                </div>
              </div>

              {/* THANH TIẾN ĐỘ QUOTA THỜI GIAN THỰC TỪ CƠ SỞ DỮ LIỆU */}
              <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "var(--vi-text)", fontWeight: 600 }}>
                    Tiến độ Quota hôm nay ({today}):
                  </span>
                  {hasLimit ? (
                    <span style={{ color: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981", fontWeight: 700 }}>
                      {used} / {r.dailyLimit} ({pct}%)
                    </span>
                  ) : (
                    <span style={{ color: "#10b981", fontWeight: 700 }}>
                      {used} lượt (Không giới hạn)
                    </span>
                  )}
                </div>

                {hasLimit && (
                  <>
                    <div style={{ width: "100%", height: 8, background: "rgba(255, 255, 255, 0.1)", borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981",
                          borderRadius: 4,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <small style={{ display: "block", marginTop: 6, fontSize: 11.5, color: "var(--vi-muted)" }}>
                      {left !== null && left > 0
                        ? `Còn khả dụng ${left} lượt trước khi tự động chuyển sang cổng khác.`
                        : "⚠️ Đã hết quota trong ngày! Hệ thống đang tự động fallback."}
                    </small>
                  </>
                )}
              </div>

              {/* FORM CHỈNH SỬA CỔNG */}
              <form action={saveShortener} className="vt-form">
                <input type="hidden" name="id" value={r.id} />
                <div className="vt-row">
                  <label className="vt-field">
                    <span>Cổng</span>
                    <select name="provider" defaultValue={r.provider}>
                      {PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="vt-field">
                    <span>Tên gợi nhớ</span>
                    <input type="text" name="name" defaultValue={r.name} />
                  </label>
                </div>

                <label className="vt-field">
                  <span>Token mới (để trống = giữ token hiện tại)</span>
                  <input type="text" name="token" autoComplete="off" placeholder="••••••••••••" />
                </label>

                <div className="vt-row">
                  <label className="vt-field">
                    <span>Giới hạn ngày (0 = không giới hạn)</span>
                    <input type="number" name="dailyLimit" defaultValue={r.dailyLimit} min={0} />
                  </label>
                  <label className="vt-field">
                    <span>Thứ tự</span>
                    <input type="number" name="order" defaultValue={r.order} />
                  </label>
                </div>

                <label className="vt-check" style={{ marginBottom: 12 }}>
                  <input type="checkbox" name="enabled" defaultChecked={r.enabled} />
                  <span>Bật hoạt động cổng này</span>
                </label>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button className="vt-btn-sm" type="submit">
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>

              <form action={deleteShortener} style={{ marginTop: 8 }}>
                <input type="hidden" name="id" value={r.id} />
                <button
                  className="vt-btn-sm vt-btn-danger"
                  type="submit"
                  onClick={(e) => {
                    if (!confirm("Bạn có chắc chắn muốn xóa cổng rút gọn này?")) {
                      e.preventDefault();
                    }
                  }}
                >
                  Xoá Cổng
                </button>
              </form>
            </div>
          );
        })
      )}
    </div>
  );
}
