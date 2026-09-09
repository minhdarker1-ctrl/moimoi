import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import AdminNav from "../AdminNav";
import { saveSite } from "../actions";

export const dynamic = "force-dynamic";

function lines(json: string): string {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.join("\n") : "";
  } catch {
    return "";
  }
}

export default async function SitePage() {
  const today = vnDate();
  const [s, counter, daily] = await Promise.all([
    db.site.findUnique({ where: { id: 1 } }),
    db.counter.findUnique({ where: { id: 1 } }),
    db.dailyHit.findUnique({ where: { date: today } }),
  ]);

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/site" />
      <form action={saveSite} className="vt-card vt-form">
        <div className="vt-row">
          <label className="vt-field">
            <span>Tên hiển thị</span>
            <input type="text" name="name" defaultValue={s?.name ?? ""} required />
          </label>
          <label className="vt-field">
            <span>Dòng chào (VD: Hi, i am)</span>
            <input type="text" name="iam" defaultValue={s?.iam ?? ""} />
          </label>
        </div>

        <label className="vt-check">
          <input type="checkbox" name="verified" defaultChecked={s?.verified ?? true} />
          Hiện tick xác minh
        </label>

        <div className="vt-row">
          <label className="vt-field">
            <span>URL ảnh đại diện (link trực tiếp hoặc /avatar.jpg)</span>
            <input type="text" name="avatarUrl" defaultValue={s?.avatarUrl ?? ""} placeholder="https://... hoặc /avatar.jpg" />
          </label>
          <label className="vt-field">
            <span>URL khung avatar (PNG trong suốt)</span>
            <input type="text" name="avatarFrameUrl" defaultValue={s?.avatarFrameUrl ?? ""} placeholder="https://... hoặc /frame.png" />
          </label>
        </div>

        <label className="vt-field">
          <span>Chữ chạy — mỗi dòng 1 câu</span>
          <textarea name="typedLines" defaultValue={lines(s?.typedLines ?? "[]")} />
        </label>

        <div className="vt-row">
          <label className="vt-field">
            <span>Tiêu đề SEO</span>
            <input type="text" name="seoTitle" defaultValue={s?.seoTitle ?? ""} />
          </label>
          <label className="vt-field">
            <span>Từ khoá SEO</span>
            <input type="text" name="seoKeywords" defaultValue={s?.seoKeywords ?? ""} />
          </label>
        </div>

        <label className="vt-field">
          <span>Mô tả SEO</span>
          <textarea name="seoDescription" defaultValue={s?.seoDescription ?? ""} />
        </label>

        <div className="vt-row">
          <label className="vt-field">
            <span>URL ảnh OG (chia sẻ mạng xã hội)</span>
            <input type="url" name="ogImageUrl" defaultValue={s?.ogImageUrl ?? ""} />
          </label>
          <label className="vt-field">
            <span>URL favicon</span>
            <input type="url" name="faviconUrl" defaultValue={s?.faviconUrl ?? ""} />
          </label>
        </div>

        <div className="vt-row">
          <label className="vt-field">
            <span>Link kênh YouTube</span>
            <input type="url" name="ytChannelUrl" defaultValue={s?.ytChannelUrl ?? ""} />
          </label>
          <label className="vt-field">
            <span>Chữ footer</span>
            <input type="text" name="footerText" defaultValue={s?.footerText ?? ""} />
          </label>
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: 14 }}>
          <strong style={{ fontSize: 14, color: "#3b82f6", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <i className="fa-solid fa-chart-line" />
            <span>Thông Số Lượt Truy Cập (StatsBar Live Ngoài Trang Chủ)</span>
          </strong>
          <div className="vt-row">
            <label className="vt-field">
              <span>Tổng lượt truy cập (Total Visits)</span>
              <input key={String(counter?.total ?? 0)} type="number" name="counterTotal" defaultValue={counter?.total ?? 3000} min={0} />
              <small className="vt-hint">Hiển thị ở cột &quot;Tổng Truy Cập&quot; ngoài trang chủ.</small>
            </label>
            <label className="vt-field">
              <span>Lượt truy cập hôm nay ({today})</span>
              <input key={String(daily?.count ?? 0)} type="number" name="counterToday" defaultValue={daily?.count ?? 0} min={0} />
              <small className="vt-hint">Hiển thị ở cột &quot;+ Hôm Nay&quot; ngoài trang chủ.</small>
            </label>
          </div>
        </div>

        <label className="vt-check">
          <input type="checkbox" name="ytBannerOn" defaultChecked={s?.ytBannerOn ?? true} />
          Hiện banner Subscribe YouTube
        </label>

        <button className="vt-btn-primary" type="submit">
          Lưu
        </button>
      </form>
    </div>
  );
}
