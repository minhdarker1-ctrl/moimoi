import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { saveFreeFireConfig } from "../actions";

export const dynamic = "force-dynamic";

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const pathParts = u.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "embed" && pathParts[1]) return `https://www.youtube-nocookie.com/embed/${pathParts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default async function AdminFreeFirePage() {
  const config = await db.freeFireConfig.findUnique({ where: { id: 1 } });

  const embedUrl = config?.videoUrl ? getYouTubeEmbedUrl(config.videoUrl) : null;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/freefire" />

      <div className="vt-card">
        <h2 style={{ fontSize: 17, marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🔥 Cấu hình Chú thích & Hướng dẫn Free Fire</span>
        </h2>
        <p className="vt-hint" style={{ marginBottom: 16 }}>
          Các thông tin này sẽ được hiển thị trên trang <strong>/freefire</strong> (Độ Nhạy Free Fire Pro).
          Mọi mục bên dưới đều là <strong>tùy chọn (không bắt buộc)</strong>, nếu bỏ trống thì sẽ tự động ẩn đi.
        </p>

        <form action={saveFreeFireConfig} className="vt-form">
          <label className="vt-check" style={{ marginBottom: 12 }}>
            <input
              type="checkbox"
              name="visible"
              defaultChecked={config?.visible ?? true}
            />
            <span>Hiển thị phần chú thích này trên trang Free Fire</span>
          </label>

          <label className="vt-field">
            <span>Tiêu đề chú thích</span>
            <input
              type="text"
              name="title"
              defaultValue={config?.title ?? "Lưu ý & Hướng dẫn cài đặt"}
              placeholder="VD: Lưu ý khi kéo tâm & hướng dẫn cài đặt"
            />
          </label>

          <label className="vt-field">
            <span>Nội dung hướng dẫn / Ghi chú (Text)</span>
            <textarea
              name="content"
              rows={5}
              defaultValue={config?.content ?? ""}
              placeholder="Nhập nội dung lưu ý, quy tắc kéo tâm, mẹo chỉnh DPI hoặc thông báo đến game thủ... (hỗ trợ xuống dòng)"
            />
          </label>

          <div className="vt-row">
            <label className="vt-field">
              <span>Đường link đính kèm (URL)</span>
              <input
                type="text"
                name="linkUrl"
                defaultValue={config?.linkUrl ?? ""}
                placeholder="https://... hoặc link nhóm / file tải"
              />
            </label>
            <label className="vt-field">
              <span>Chữ hiển thị trên nút link</span>
              <input
                type="text"
                name="linkText"
                defaultValue={config?.linkText ?? ""}
                placeholder="VD: Tải File Tối Ưu, Tham Gia Nhóm Zalo..."
              />
            </label>
          </div>

          <label className="vt-field">
            <span>URL hình ảnh minh họa</span>
            <input
              type="text"
              name="imageUrl"
              defaultValue={config?.imageUrl ?? ""}
              placeholder="https://i.ibb.co/... hoặc link ảnh trực tiếp"
            />
          </label>

          <label className="vt-field">
            <span>URL video YouTube</span>
            <input
              type="text"
              name="videoUrl"
              defaultValue={config?.videoUrl ?? ""}
              placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
            />
          </label>

          <div className="vt-actions" style={{ marginTop: 16 }}>
            <button className="vt-btn-primary" type="submit">
              Lưu cấu hình Free Fire
            </button>
            <a
              href="/freefire"
              target="_blank"
              rel="noopener noreferrer"
              className="vt-btn-sm"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>Xem trang Free Fire</span>
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          </div>
        </form>
      </div>

      {/* Khối xem trước (Live Preview) cho Admin */}
      {(config?.content || config?.imageUrl || config?.videoUrl || config?.linkUrl) && (
        <div className="vt-card" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 12 }}>
            👀 Xem trước hiển thị thực tế:
          </h3>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "rgba(255, 107, 0, 0.05)",
              border: "1px solid rgba(255, 107, 0, 0.2)",
            }}
          >
            {config.title && (
              <h4 style={{ margin: "0 0 8px 0", color: "#ff6b00", fontSize: 16 }}>
                🔥 {config.title}
              </h4>
            )}
            {config.content && (
              <p style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px 0" }}>
                {config.content}
              </p>
            )}
            {config.imageUrl && (
              <div style={{ marginBottom: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.imageUrl}
                  alt="Ảnh minh họa"
                  style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8, objectFit: "cover" }}
                />
              </div>
            )}
            {embedUrl && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 8, marginBottom: 12 }}>
                <iframe
                  src={embedUrl}
                  title="Video YouTube"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {config.linkUrl && (
              <div>
                <a
                  href={config.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vt-btn-primary"
                  style={{ textDecoration: "none", display: "inline-block", fontSize: 13 }}
                >
                  🔗 {config.linkText || "Xem liên kết đính kèm"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
