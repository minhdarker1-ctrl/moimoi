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
          <strong style={{ fontSize: 14, color: "#10b981", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <i className="fa-solid fa-shield-halved" />
            <span>Hệ Thống Bảo Mật Anti-Bot & Phát Hiện Giả Lập (CreepJS & TrafficVN Pattern)</span>
          </strong>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
            <label className="vt-check">
              <input type="checkbox" name="antiBotEnabled" defaultChecked={s?.antiBotEnabled ?? true} />
              Bật hệ thống bảo vệ Anti-Bot (Pre-check Barrier & Quét phần cứng trình duyệt)
            </label>
            <label className="vt-check">
              <input type="checkbox" name="blockEmulators" defaultChecked={s?.blockEmulators ?? true} />
              Chặn triệt để máy giả lập Android trên PC (LDPlayer, NoxPlayer, BlueStacks, MEmu, F12 DevTools Responsive)
            </label>
            <label className="vt-check">
              <input type="checkbox" name="cfTurnstileEnabled" defaultChecked={s?.cfTurnstileEnabled ?? false} />
              Bật xác minh Cloudflare Turnstile Captcha (Tùy chọn nâng cao)
            </label>
          </div>

          <div className="vt-row">
            <label className="vt-field">
              <span>Cloudflare Turnstile Site Key</span>
              <input type="text" name="cfTurnstileSiteKey" defaultValue={s?.cfTurnstileSiteKey ?? ""} placeholder="0x4AAAAAA..." />
            </label>
            <label className="vt-field">
              <span>Cloudflare Turnstile Secret Key</span>
              <input
                type="password"
                name="cfTurnstileSecretKey"
                defaultValue=""
                placeholder={s?.cfTurnstileSecretKey ? "•••••••• (Đã lưu — để trống nếu giữ nguyên)" : "0x4AAAAAA..."}
                autoComplete="new-password"
              />
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
