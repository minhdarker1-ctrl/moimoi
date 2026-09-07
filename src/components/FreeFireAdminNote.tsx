"use client";

export interface FreeFireNoteData {
  title?: string;
  content?: string;
  linkUrl?: string;
  linkText?: string;
  imageUrl?: string;
  videoUrl?: string;
  visible?: boolean;
  requireKey?: boolean;
  keyTypeId?: number | null;
  getKeyUrl?: string;
  staticKey?: string;
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const pathParts = u.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "embed" && pathParts[1]) return `https://www.youtube-nocookie.com/embed/${pathParts[1]}`;
      if (pathParts[0] === "shorts" && pathParts[1]) return `https://www.youtube-nocookie.com/embed/${pathParts[1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("?")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function FreeFireAdminNote({ note }: { note?: FreeFireNoteData | null }) {
  if (!note || note.visible === false) return null;

  const hasContent = Boolean(
    note.content?.trim() ||
    note.imageUrl?.trim() ||
    note.videoUrl?.trim() ||
    note.linkUrl?.trim()
  );

  if (!hasContent) return null;

  const embedUrl = getYouTubeEmbedUrl(note.videoUrl);

  return (
    <section className="mdarker-ff-note-box" aria-label="Chú thích từ Admin">
      {/* Header chú thích */}
      <div className="mdarker-ff-note-header">
        <div className="mdarker-ff-note-tag">
          <i className="fa-solid fa-fire mdarker-ff-note-fire" aria-hidden="true" />
          <span>LƯU Ý TỪ ADMIN</span>
        </div>
        {note.title && <h3 className="mdarker-ff-note-title">{note.title}</h3>}
      </div>

      {/* Nội dung text */}
      {note.content && (
        <div className="mdarker-ff-note-body">
          <p>{note.content}</p>
        </div>
      )}

      {/* Hình ảnh minh họa (nếu có) */}
      {note.imageUrl && (
        <div className="mdarker-ff-note-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={note.imageUrl}
            alt={note.title || "Hình ảnh hướng dẫn"}
            className="mdarker-ff-note-img"
            loading="lazy"
          />
        </div>
      )}

      {/* Video YouTube (nếu có) */}
      {embedUrl && (
        <div className="mdarker-ff-note-video-wrap">
          <iframe
            src={embedUrl}
            title={note.title || "Video hướng dẫn cài đặt Free Fire"}
            className="mdarker-ff-note-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Nút liên kết ngoài (nếu có) */}
      {note.linkUrl && (
        <div className="mdarker-ff-note-footer">
          <a
            href={note.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mdarker-ff-note-btn"
          >
            <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            <span>{note.linkText || "Xem liên kết đính kèm"}</span>
          </a>
        </div>
      )}
    </section>
  );
}
