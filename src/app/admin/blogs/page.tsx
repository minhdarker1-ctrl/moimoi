import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveBlogPost, deleteBlogPost } from "./actions";

export const dynamic = "force-dynamic";

function parseTags(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function AdminBlogsPage() {
  const posts = await db.blogPost.findMany({
    orderBy: [{ pinned: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/blogs" />

      <div className="vt-card">
        <h1 style={{ fontSize: 18, marginTop: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span>📝 Quản Lý Bài Viết Blog mdarker</span>
          <span className="vt-tag">{posts.length} bài</span>
        </h1>
        <p className="vt-hint" style={{ marginTop: 0, marginBottom: 16 }}>
          Các bài viết này sẽ xuất hiện trực tiếp trên trang chủ thay cho menu ALL. Bạn có thể thêm, sửa, ghim bài hoặc ẩn bất kỳ bài viết nào.
        </p>

        <h2 style={{ fontSize: 15, marginTop: 16, marginBottom: 12 }}>+ Thêm bài viết mới</h2>
        <form action={saveBlogPost} className="vt-form">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <label className="vt-field">
              <span>Tiêu đề bài viết (*)</span>
              <input type="text" name="title" placeholder="VD: Chia sẻ kinh nghiệm..." required />
            </label>
            <label className="vt-field">
              <span>Chuyên mục</span>
              <input type="text" name="category" placeholder="VD: Giới thiệu, Free Fire, Thủ thuật..." defaultValue="Chia sẻ" />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="vt-field">
              <span>Đường dẫn tĩnh (Slug - tuỳ chọn)</span>
              <input type="text" name="slug" placeholder="Tự tạo từ tiêu đề nếu để trống" />
            </label>
            <label className="vt-field">
              <span>Thứ tự hiển thị (Order)</span>
              <input type="number" name="order" defaultValue={0} />
            </label>
          </div>

          <label className="vt-field">
            <span>Link ảnh bìa (Cover Image URL)</span>
            <input type="url" name="coverUrl" placeholder="https://..." />
          </label>

          <label className="vt-field">
            <span>Thẻ tag (phân cách bằng dấu phẩy)</span>
            <input type="text" name="tags" placeholder="VD: mdarker, iOS, FreeFire, ThủThuật" />
          </label>

          <label className="vt-field">
            <span>Tóm tắt ngắn (Excerpt)</span>
            <textarea name="summary" rows={2} placeholder="Đoạn văn ngắn hiển thị ngoài danh sách bài viết..." />
          </label>

          <label className="vt-field">
            <span>Nội dung bài viết chi tiết (Hỗ trợ Markdown)</span>
            <textarea
              name="content"
              rows={8}
              placeholder="Nội dung bài viết chi tiết... Hỗ trợ cú pháp Markdown (## Tiêu đề, - gạch đầu dòng, **in đậm**...)"
              required
            />
          </label>

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <label className="vt-check">
              <input type="checkbox" name="pinned" />
              <span>📌 Ghim bài viết lên đầu</span>
            </label>
            <label className="vt-check">
              <input type="checkbox" name="visible" defaultChecked />
              <span>Hiển thị bài viết</span>
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="vt-btn-primary" type="submit">
              Đăng Bài Viết
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Danh sách bài viết đã đăng ({posts.length})</h2>

        {posts.map((p) => {
          const tags = parseTags(p.tags);
          return (
            <div key={p.id} className="vt-card" style={{ marginBottom: 16 }}>
              <form action={saveBlogPost} className="vt-form">
                <input type="hidden" name="id" value={p.id} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="vt-tag" style={{ background: "rgba(124, 92, 255, 0.2)", color: "#a78bfa" }}>
                      #{p.id} • {p.category}
                    </span>
                    {p.pinned && (
                      <span className="vt-tag" style={{ background: "rgba(255, 140, 0, 0.2)", color: "#ff8c00" }}>
                        📌 Ghim
                      </span>
                    )}
                    {!p.visible && (
                      <span className="vt-tag" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>
                        Đang ẩn
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>
                    {p.createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <label className="vt-field">
                    <span>Tiêu đề</span>
                    <input type="text" name="title" defaultValue={p.title} required />
                  </label>
                  <label className="vt-field">
                    <span>Chuyên mục</span>
                    <input type="text" name="category" defaultValue={p.category} />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label className="vt-field">
                    <span>Slug</span>
                    <input type="text" name="slug" defaultValue={p.slug} />
                  </label>
                  <label className="vt-field">
                    <span>Thứ tự</span>
                    <input type="number" name="order" defaultValue={p.order} />
                  </label>
                </div>

                <label className="vt-field">
                  <span>Link ảnh bìa</span>
                  <input type="url" name="coverUrl" defaultValue={p.coverUrl} />
                </label>

                <label className="vt-field">
                  <span>Thẻ tags</span>
                  <input type="text" name="tags" defaultValue={tags.join(", ")} />
                </label>

                <label className="vt-field">
                  <span>Tóm tắt ngắn</span>
                  <textarea name="summary" rows={2} defaultValue={p.summary} />
                </label>

                <label className="vt-field">
                  <span>Nội dung chi tiết</span>
                  <textarea name="content" rows={6} defaultValue={p.content} />
                </label>

                <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 4 }}>
                  <label className="vt-check">
                    <input type="checkbox" name="pinned" defaultChecked={p.pinned} />
                    <span>📌 Ghim</span>
                  </label>
                  <label className="vt-check">
                    <input type="checkbox" name="visible" defaultChecked={p.visible} />
                    <span>Hiển thị</span>
                  </label>
                </div>

                <div className="vt-actions" style={{ marginTop: 12 }}>
                  <button className="vt-btn-sm" type="submit">
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>

              <form action={deleteBlogPost} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  className="vt-btn-sm vt-btn-danger"
                  type="submit"
                >
                  Xoá bài viết
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
