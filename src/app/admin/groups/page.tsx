import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveGroup, deleteGroup } from "../actions";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const rows = await db.group.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { apps: true } } },
  });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/groups" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm nhóm</h2>
        <form action={saveGroup} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Tên nhóm</span>
              <input type="text" name="title" required placeholder="APP" />
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
          <form action={saveGroup} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="vt-row">
              <label className="vt-field">
                <span>Tên nhóm</span>
                <input type="text" name="title" defaultValue={r.title} required />
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
              <span className="vt-tag">{r._count.apps} ứng dụng</span>
            </div>
          </form>
          <form action={deleteGroup} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={r.id} />
            <button className="vt-btn-sm vt-btn-danger" type="submit">
              Xoá nhóm (xoá cả {r._count.apps} ứng dụng)
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
