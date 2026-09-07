import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import { addMusicTrack, deleteMusicTrack, toggleMusicTrack, moveMusicTrack } from "../actions";

export const dynamic = "force-dynamic";

export default async function MusicAdminPage() {
  const tracks = await db.musicTrack.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/music" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>🎵 Thêm bài nhạc</h2>
        <p style={{ fontSize: 13, color: "var(--vi-muted)", marginTop: -8 }}>
          Dán link YouTube (youtube.com/watch?v=..., youtu.be/..., Shorts) hoặc video ID 11 ký tự.
        </p>
        <form action={addMusicTrack} className="vt-form">
          <label className="vt-field">
            <span>Link YouTube hoặc Video ID</span>
            <input type="text" name="youtubeId" placeholder="https://youtu.be/xxxxxxxx..." required />
          </label>
          <label className="vt-field">
            <span>Tên bài</span>
            <input type="text" name="title" placeholder="Tên bài hát" required />
          </label>
          <label className="vt-field">
            <span>Nghệ sĩ</span>
            <input type="text" name="artist" placeholder="Tên nghệ sĩ" />
          </label>
          <button className="vt-btn-primary" type="submit">Thêm</button>
        </form>
      </div>

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Playlist ({tracks.length} bài)</h2>
        {tracks.length === 0 && (
          <p style={{ color: "var(--vi-muted)", fontSize: 13 }}>Chưa có bài nào.</p>
        )}
        {tracks.map((t, i) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0", borderBottom: "1px solid var(--vi-border)",
          }}>
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${t.youtubeId}/default.jpg`}
              alt={t.title}
              width={60} height={45}
              style={{ borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--vi-muted)" }}>{t.artist || "—"}</div>
              <a
                href={`https://youtu.be/${t.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 11, color: "var(--vi-accent)" }}
              >
                {t.youtubeId}
              </a>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {/* Lên */}
              <form action={moveMusicTrack}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="dir" value="up" />
                <button className="vt-btn-sm" type="submit" disabled={i === 0} title="Lên">↑</button>
              </form>
              {/* Xuống */}
              <form action={moveMusicTrack}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="dir" value="down" />
                <button className="vt-btn-sm" type="submit" disabled={i === tracks.length - 1} title="Xuống">↓</button>
              </form>
              {/* Bật/tắt */}
              <form action={toggleMusicTrack}>
                <input type="hidden" name="id" value={t.id} />
                <button
                  className={`vt-btn-sm${t.visible ? "" : " vt-btn-danger"}`}
                  type="submit"
                  title={t.visible ? "Đang hiện — bấm để ẩn" : "Đang ẩn — bấm để hiện"}
                >
                  {t.visible ? "👁 Hiện" : "🙈 Ẩn"}
                </button>
              </form>
              {/* Xoá */}
              <form action={deleteMusicTrack}>
                <input type="hidden" name="id" value={t.id} />
                <button className="vt-btn-sm vt-btn-danger" type="submit" title="Xoá bài này">🗑</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
