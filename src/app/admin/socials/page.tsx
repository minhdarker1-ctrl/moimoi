import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveSocial, deleteSocial } from "../actions";

export const dynamic = "force-dynamic";

export default async function SocialsPage() {
  const rows = await db.social.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/socials" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm social</h2>
        <form action={saveSocial} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>URL icon</span>
              <input type="url" name="iconUrl" required />
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
          <form action={saveSocial} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="vt-row">
              <label className="vt-field">
                <span>URL icon</span>
                <input type="url" name="iconUrl" defaultValue={r.iconUrl} required />
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
          <form action={deleteSocial} style={{ marginTop: 8 }}>
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
