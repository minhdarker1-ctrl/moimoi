import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import { PROVIDERS } from "@/lib/shorteners";
import AdminNav from "../AdminNav";
import { saveShortener, deleteShortener } from "../actions";

export const dynamic = "force-dynamic";

export default async function ShortenersPage() {
  const rows = await db.shortener.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  const today = vnDate();

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/shorteners" />

      <div className="vt-card">
        <p className="vt-hint" style={{ marginTop: 0 }}>
          Token lấy từ dashboard của từng cổng. Token được mã hoá trước khi lưu và không bao giờ
          gửi xuống trình duyệt. Ontops và GTraffic giới hạn 1000 link/ngày — đặt Giới hạn ngày =
          1000 để hệ thống tự nhảy cổng khác khi hết.
        </p>
      </div>

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm cổng</h2>
        <form action={saveShortener} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Cổng</span>
              <select name="provider" required>
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                    {p.dailyLimit > 0 ? ` (${p.dailyLimit}/ngày)` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="vt-field">
              <span>Tên gợi nhớ</span>
              <input type="text" name="name" placeholder="Traffic4K chính" />
            </label>
          </div>
          <label className="vt-field">
            <span>Token / API key</span>
            <input type="text" name="token" required autoComplete="off" />
          </label>
          <div className="vt-row">
            <label className="vt-field">
              <span>Giới hạn ngày (0 = không giới hạn)</span>
              <input type="number" name="dailyLimit" defaultValue={0} min={0} />
            </label>
            <label className="vt-field">
              <span>Thứ tự</span>
              <input type="number" name="order" defaultValue={rows.length} />
            </label>
          </div>
          <label className="vt-check">
            <input type="checkbox" name="enabled" defaultChecked />
            Bật
          </label>
          <button className="vt-btn-primary" type="submit">
            Thêm
          </button>
        </form>
      </div>

      {rows.map((r) => {
        const used = r.dailyDate === today ? r.dailyUsed : 0;
        const left = r.dailyLimit > 0 ? r.dailyLimit - used : null;
        return (
          <div key={r.id} className="vt-card">
            <div className="vt-actions" style={{ marginBottom: 10 }}>
              <span className="vt-tag">ID {r.id}</span>
              <span className="vt-tag">{r.provider}</span>
              <span className="vt-tag">token ••••{r.tokenHint}</span>
              <span className="vt-tag">
                hôm nay: {used}
                {left !== null ? ` / còn ${Math.max(0, left)}` : ""}
              </span>
            </div>
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
                <span>Token mới (để trống = giữ token cũ)</span>
                <input type="text" name="token" autoComplete="off" />
              </label>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Giới hạn ngày</span>
                  <input type="number" name="dailyLimit" defaultValue={r.dailyLimit} min={0} />
                </label>
                <label className="vt-field">
                  <span>Thứ tự</span>
                  <input type="number" name="order" defaultValue={r.order} />
                </label>
              </div>
              <label className="vt-check">
                <input type="checkbox" name="enabled" defaultChecked={r.enabled} />
                Bật
              </label>
              <div className="vt-actions">
                <button className="vt-btn-sm" type="submit">
                  Lưu
                </button>
              </div>
            </form>
            <form action={deleteShortener} style={{ marginTop: 8 }}>
              <input type="hidden" name="id" value={r.id} />
              <button className="vt-btn-sm vt-btn-danger" type="submit">
                Xoá
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
