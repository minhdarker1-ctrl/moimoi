import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveLinkBox, deleteLinkBox } from "../actions";

export const dynamic = "force-dynamic";

export default async function LinkBoxesPage() {
  const rows = await db.linkBox.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/linkboxes" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm link box</h2>
        <form action={saveLinkBox} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Tiêu đề</span>
              <input type="text" name="title" required />
            </label>
            <label className="vt-field">
              <span>Mô tả</span>
              <input type="text" name="subtitle" />
            </label>
          </div>
          <div className="vt-row">
            <label className="vt-field">
              <span>URL icon</span>
              <input type="url" name="iconUrl" />
            </label>
            <label className="vt-field">
              <span>Link tới</span>
              <input type="url" name="url" required />
            </label>
            <label className="vt-field">
              <span>Thứ tự</span>
              <input type="number" name="order" defaultValue={rows.length} />
            </label>
          </div>
          <label className="vt-check">
            <input type="checkbox" name="visible" defaultChecked />
            Hiện
          </label>
          <button className="vt-btn-primary" type="submit">
            Thêm
          </button>
        </form>
      </div>

      {rows.map((r) => (
        <div key={r.id} className="vt-card">
          <form action={saveLinkBox} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="vt-row">
              <label className="vt-field">
                <span>Tiêu đề</span>
                <input type="text" name="title" defaultValue={r.title} required />
              </label>
              <label className="vt-field">
                <span>Mô tả</span>
                <input type="text" name="subtitle" defaultValue={r.subtitle} />
              </label>
            </div>
            <div className="vt-row">
              <label className="vt-field">
                <span>URL icon</span>
                <input type="url" name="iconUrl" defaultValue={r.iconUrl} />
              </label>
              <label className="vt-field">
                <span>Link tới</span>
                <input type="url" name="url" defaultValue={r.url} required />
              </label>
              <label className="vt-field">
                <span>Thứ tự</span>
                <input type="number" name="order" defaultValue={r.order} />
              </label>
            </div>
            <label className="vt-check">
              <input type="checkbox" name="visible" defaultChecked={r.visible} />
              Hiện
            </label>
            <div className="vt-actions">
              <button className="vt-btn-sm" type="submit">
                Lưu
              </button>
            </div>
          </form>
          <form action={deleteLinkBox} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={r.id} />
            <button className="vt-btn-sm vt-btn-danger" type="submit">
              Xoá
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
