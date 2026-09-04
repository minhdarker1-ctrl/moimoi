import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveNotice, deleteNotice } from "../actions";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const rows = await db.notice.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/notices" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm thông báo</h2>
        <form action={saveNotice} className="vt-form">
          <label className="vt-field">
            <span>Tiêu đề</span>
            <input type="text" name="title" required />
          </label>
          <label className="vt-field">
            <span>Nội dung</span>
            <textarea name="body" />
          </label>
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
          <form action={saveNotice} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <label className="vt-field">
              <span>Tiêu đề</span>
              <input type="text" name="title" defaultValue={r.title} required />
            </label>
            <label className="vt-field">
              <span>Nội dung</span>
              <textarea name="body" defaultValue={r.body} />
            </label>
            <label className="vt-check">
              <input type="checkbox" name="visible" defaultChecked={r.visible} />
              Hiện
            </label>
            <div className="vt-actions">
              <button className="vt-btn-sm" type="submit">
                Lưu
              </button>
              <span className="vt-tag">
                {r.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
              </span>
            </div>
          </form>
          <form action={deleteNotice} style={{ marginTop: 8 }}>
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
