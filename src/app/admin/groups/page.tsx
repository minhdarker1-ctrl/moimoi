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
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Thêm mảng / lĩnh vực</h2>
        <form action={saveGroup} className="vt-form">
          <div className="vt-row">
            <label className="vt-field">
              <span>Tên mảng / lĩnh vực</span>
              <input type="text" name="title" required placeholder="Liên Quân Mobile, Free Fire, App..." />
            </label>
            <label className="vt-field">
              <span>Icon (Class hoặc URL ảnh)</span>
              <input type="text" name="icon" placeholder="fa-solid fa-fire hoặc https://..." />
            </label>
          </div>
          <div className="vt-row">
            <label className="vt-field">
              <span>Huy hiệu (Badge)</span>
              <input type="text" name="badge" placeholder="HOT, NEW, UPDATE..." />
            </label>
            <label className="vt-field">
              <span>Slug (Đường dẫn trang web - VD: free-fire, lienquan...)</span>
              <input type="text" name="slug" placeholder="free-fire (để trống tự tạo)" />
            </label>
            <label className="vt-field">
              <span>Thứ tự</span>
              <input type="number" name="order" defaultValue={rows.length} />
            </label>
          </div>
          <label className="vt-field">
            <span>Mô tả ngắn</span>
            <input type="text" name="desc" placeholder="Tóm tắt ngắn về mảng này..." />
          </label>
          <label className="vt-check">
            <input type="checkbox" name="visible" defaultChecked />
            Hiện mảng này trên trang chủ
          </label>
          <button className="vt-btn-primary" type="submit">
            Thêm mảng
          </button>
        </form>
      </div>

      {rows.map((r) => (
        <div key={r.id} className="vt-card">
          <form action={saveGroup} className="vt-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="vt-row">
              <label className="vt-field">
                <span>Tên mảng</span>
                <input type="text" name="title" defaultValue={r.title} required />
              </label>
              <label className="vt-field">
                <span>Icon</span>
                <input type="text" name="icon" defaultValue={r.icon} placeholder="fa-solid fa-fire" />
              </label>
            </div>
            <div className="vt-row">
              <label className="vt-field">
                <span>Huy hiệu (Badge)</span>
                <input type="text" name="badge" defaultValue={r.badge} placeholder="HOT, NEW..." />
              </label>
              <label className="vt-field">
                <span>Slug</span>
                <input type="text" name="slug" defaultValue={r.slug} />
              </label>
              <label className="vt-field">
                <span>Thứ tự</span>
                <input type="number" name="order" defaultValue={r.order} />
              </label>
            </div>
            <label className="vt-field">
              <span>Mô tả ngắn</span>
              <input type="text" name="desc" defaultValue={r.desc} />
            </label>
            <label className="vt-check">
              <input type="checkbox" name="visible" defaultChecked={r.visible} />
              Hiện mảng này trên trang chủ
            </label>
            <div className="vt-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button className="vt-btn-sm" type="submit">
                Lưu thay đổi
              </button>
              <span className="vt-tag">{r._count.apps} mục bên trong</span>
              {r.slug && (
                <a
                  href={`/${r.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vt-btn-sm"
                  style={{
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(99, 102, 241, 0.12)",
                    color: "var(--vi-accent)",
                    fontWeight: 700,
                  }}
                >
                  <span>🔗 Mở trang: /{r.slug}</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </a>
              )}
            </div>
          </form>
          <form action={deleteGroup} style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={r.id} />
            <button className="vt-btn-sm vt-btn-danger" type="submit">
              Xoá mảng này (xoá cả {r._count.apps} mục)
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
