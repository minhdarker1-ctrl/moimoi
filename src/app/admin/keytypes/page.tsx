import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveKeyType, deleteKeyType } from "../actions";

export const dynamic = "force-dynamic";

function ids(json: string): string {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.join(",") : "";
  } catch {
    return "";
  }
}

export default async function KeyTypesPage() {
  const [rows, shorteners] = await Promise.all([
    db.keyType.findMany({ orderBy: { id: "asc" }, include: { _count: { select: { apps: true } } } }),
    db.shortener.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/keytypes" />

      <div className="vt-card">
        <p className="vt-hint" style={{ marginTop: 0 }}>
          <strong>Thứ tự cổng</strong>: nhập ID cổng cách nhau bằng dấu phẩy, theo đúng thứ tự user
          phải vượt. Ví dụ <code>3,1,2</code> = vượt cổng 3 trước, rồi 1, rồi 2.
          <br />
          <strong>Số cổng phải vượt</strong> nhỏ hơn số ID trong danh sách thì chỉ lấy các cổng đầu.
          Cổng đang tắt hoặc hết quota sẽ bị bỏ qua, hệ thống lấy cổng kế tiếp.
        </p>
        {shorteners.length === 0 ? (
          <p className="vt-msg vt-msg-err" style={{ padding: 0 }}>
            Chưa có cổng nào. Thêm ở <a href="/admin/shorteners">Cổng vượt link</a> trước.
          </p>
        ) : (
          <table className="vt-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Cổng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {shorteners.map((s) => (
                <tr key={s.id}>
                  <td className="vt-mono">{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.provider}</td>
                  <td>{s.enabled ? "Bật" : "Tắt"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm loại key</h2>
        <form action={saveKeyType} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Tên loại key</span>
              <input type="text" name="name" required placeholder="Key AOV 24h" />
            </label>
            <label className="vt-field">
              <span>Thứ tự cổng (ID, cách bằng dấu phẩy)</span>
              <input type="text" name="providerIds" placeholder="1,2,3" />
            </label>
          </div>
          <div className="vt-row">
            <label className="vt-field">
              <span>Số cổng phải vượt (1-8)</span>
              <input type="number" name="steps" defaultValue={2} min={1} max={8} />
            </label>
            <label className="vt-field">
              <span>Hạn key (giờ)</span>
              <input type="number" name="ttlHours" defaultValue={24} min={1} />
            </label>
            <label className="vt-field">
              <span>Giãn cách tối thiểu (giây)</span>
              <input type="number" name="minSeconds" defaultValue={8} min={0} max={120} />
            </label>
            <label className="vt-field">
              <span>Số lần dùng (0 = vô hạn)</span>
              <input type="number" name="maxUses" defaultValue={1} min={0} />
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

      {rows.map((r) => (
        <div key={r.id} className="vt-card">
          <div className="vt-actions" style={{ marginBottom: 10 }}>
            <span className="vt-tag">ID {r.id}</span>
            <span className="vt-tag">{r._count.apps} ứng dụng dùng</span>
          </div>
          <form action={saveKeyType} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="vt-row">
              <label className="vt-field">
                <span>Tên loại key</span>
                <input type="text" name="name" defaultValue={r.name} required />
              </label>
              <label className="vt-field">
                <span>Thứ tự cổng (ID, cách bằng dấu phẩy)</span>
                <input type="text" name="providerIds" defaultValue={ids(r.providerIds)} />
              </label>
            </div>
            <div className="vt-row">
              <label className="vt-field">
                <span>Số cổng phải vượt</span>
                <input type="number" name="steps" defaultValue={r.steps} min={1} max={8} />
              </label>
              <label className="vt-field">
                <span>Hạn key (giờ)</span>
                <input type="number" name="ttlHours" defaultValue={r.ttlHours} min={1} />
              </label>
              <label className="vt-field">
                <span>Giãn cách tối thiểu (giây)</span>
                <input type="number" name="minSeconds" defaultValue={r.minSeconds} min={0} max={120} />
              </label>
              <label className="vt-field">
                <span>Số lần dùng</span>
                <input type="number" name="maxUses" defaultValue={r.maxUses} min={0} />
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
          <form action={deleteKeyType} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={r.id} />
            <button className="vt-btn-sm vt-btn-danger" type="submit">
              Xoá loại key (xoá cả key đã phát thuộc loại này)
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
