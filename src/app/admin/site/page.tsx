import { db } from "@/lib/db";
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
  const s = await db.site.findUnique({ where: { id: 1 } });

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
            <span>URL ảnh đại diện</span>
            <input type="url" name="avatarUrl" defaultValue={s?.avatarUrl ?? ""} />
          </label>
          <label className="vt-field">
            <span>URL khung avatar (PNG trong suốt)</span>
            <input type="url" name="avatarFrameUrl" defaultValue={s?.avatarFrameUrl ?? ""} />
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
