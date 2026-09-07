import { db } from "@/lib/db";
import Link from "next/link";
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
  const [config, keyTypes, shorteners] = await Promise.all([
    db.freeFireConfig.findUnique({ where: { id: 1 } }),
    db.keyType.findMany({ where: { enabled: true }, orderBy: { id: "asc" } }),
    db.shortener.findMany({ orderBy: { order: "asc" } }),
  ]);

  const embedUrl = config?.videoUrl ? getYouTubeEmbedUrl(config.videoUrl) : null;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/freefire" />

      <form action={saveFreeFireConfig} className="vt-form">
        {/* CARD 1: CÀI ĐẶT BẢO VỆ BẰNG KEY & CỔNG VƯỢT LINK API BÊN THỨ 3 */}
        <div className="vt-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, marginTop: 0, display: "flex", alignItems: "center", gap: 8, color: "#f59e0b" }}>
            <i className="fa-solid fa-key" />
            <span>1. Cài Đặt Khóa Key & Cổng Vượt Link API Bên Thứ 3</span>
          </h2>
          <p className="vt-hint" style={{ marginBottom: 16 }}>
            - Nếu chọn <strong>&quot;Không cần key&quot;</strong>: người dùng bấm &quot;Lấy độ nhạy ngay&quot; sẽ chuyển thẳng đến trang chứa kết quả độ nhạy.
            <br />
            - Nếu chọn <strong>&quot;Loại key vượt link&quot;</strong> hoặc <strong>&quot;Link get key ngoài&quot;</strong>: người dùng sẽ phải vượt link qua các cổng rút gọn bên thứ 3 để nhận key. Cơ chế: <strong>Hạn sống (TTL) và Số lượt dùng (maxUses) chạy song song</strong> (hết thời hạn hoặc dùng đủ số lượt là Key die, không lưu key trên browser).
          </p>

          <div className="vt-row">
            <label className="vt-field">
              <span>Loại key (Cổng Vượt Link API Bên Thứ 3)</span>
              <select name="keyTypeId" defaultValue={config?.keyTypeId ?? 0}>
                <option value={0}>Không cần key (truy cập trực tiếp, không bắt vượt link)</option>
                {keyTypes.map((kt) => (
                  <option key={kt.id} value={kt.id}>
                    {kt.name} ({kt.steps} bước, sống {kt.ttlHours}h, {kt.maxUses > 0 ? `${kt.maxUses} lượt dùng` : "vô hạn lượt"})
                  </option>
                ))}
              </select>
            </label>

            <label className="vt-field">
              <span>Key tĩnh dự phòng / Mật khẩu nhanh (Tùy chọn)</span>
              <input
                type="text"
                name="staticKey"
                defaultValue={config?.staticKey ?? ""}
                placeholder="VD: FREEFIRE2026 hoặc VIPKEY"
              />
              <small className="vt-hint">Mật khẩu admin tự đặt để mở khóa nhanh mà không cần vượt link.</small>
            </label>
          </div>

          <label className="vt-field" style={{ marginTop: 10 }}>
            <span>Link Get Key bên ngoài — chỉ dùng nếu vượt link ngoài (Linkvertise, Link4m...)</span>
            <input
              type="text"
              name="getKeyUrl"
              defaultValue={config?.getKeyUrl ?? ""}
              placeholder="https://linkvertise.com/... hoặc link rút gọn bên ngoài của bạn"
            />
          </label>

          {/* Hộp thông tin Cổng Vượt Link API Bên Thứ 3 đã cài đặt trong hệ thống */}
          <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 10, background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <strong style={{ fontSize: 13, color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 6 }}>
                <i className="fa-solid fa-server" style={{ color: "#3b82f6" }} />
                <span>Các cổng vượt link API bên thứ 3 hiện có trong hệ thống:</span>
              </strong>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/admin/shorteners"
                  className="vt-btn-sm"
                  style={{ textDecoration: "none", fontSize: 12, padding: "4px 10px" }}
                >
                  <i className="fa-solid fa-plus" style={{ marginRight: 4 }} />
                  Cài đặt API Key / Token
                </Link>
                <Link
                  href="/admin/keytypes"
                  className="vt-btn-sm"
                  style={{ textDecoration: "none", fontSize: 12, padding: "4px 10px" }}
                >
                  <i className="fa-solid fa-gear" style={{ marginRight: 4 }} />
                  Quản lý Loại Key
                </Link>
              </div>
            </div>

            {shorteners.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>
                ⚠️ Chưa có cổng rút gọn link bên thứ 3 nào. Hãy bấm vào &quot;Cài đặt API Key / Token&quot; để thêm cổng (Ontops, Traffic4K, Linktop...).
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {shorteners.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: s.enabled ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${s.enabled ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                      color: s.enabled ? "#10b981" : "#ef4444",
                    }}
                  >
                    <i className={s.enabled ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"} />
                    <strong>{s.name}</strong> ({s.provider})
                    <span style={{ fontSize: 11, opacity: 0.8 }}>...{s.tokenHint}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: QUẢN LÝ MÃ SETTING HUD */}
        <div className="vt-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, marginTop: 0, display: "flex", alignItems: "center", gap: 8, color: "#10b981" }}>
            <i className="fa-solid fa-gamepad" />
            <span>2. Quản Lý Mã Setting HUD (2 - 3 - 4 Ngón)</span>
          </h2>
          <p className="vt-hint" style={{ marginBottom: 16 }}>
            Nhập các mã setting nút trong game Free Fire. Mỗi dòng là 1 mã riêng biệt, có thể nhập nhiều mã cho từng thể loại.
          </p>

          <label className="vt-field">
            <span>Mã HUD 2 Ngón (Mỗi dòng một mã)</span>
            <textarea
              name="hud2Codes"
              rows={3}
              defaultValue={
                config?.hud2Codes ||
                "#FFHUDT6O3jnaeTI9Po7eO\n#FFHUDT6O3jqljudJPo7eP\n#FFHUDT6O3ji+xzsRPo7eM"
              }
              placeholder="#FFHUD..."
            />
          </label>

          <label className="vt-field" style={{ marginTop: 10 }}>
            <span>Mã HUD 3 Ngón (Mỗi dòng một mã)</span>
            <textarea
              name="hud3Codes"
              rows={3}
              defaultValue={
                config?.hud3Codes ||
                "#FFHUDT6O3jqljudJPo7eP\n#FFHUDT6O3jh982BJPo7eO\n#FFHUDT6O3jiiaNUpPo7eO"
              }
              placeholder="#FFHUD..."
            />
          </label>

          <label className="vt-field" style={{ marginTop: 10 }}>
            <span>Mã HUD 4 Ngón (Mỗi dòng một mã)</span>
            <textarea
              name="hud4Codes"
              rows={4}
              defaultValue={
                config?.hud4Codes ||
                "#FFHUDT6O3jFQs9ZNPo7eN\n#FFHUDT6O3jwW3vlFPo7eP\n#FFHUDT6O3jnaeTI9Po7eO\n#FFHUDT6O3jiiaNUpPo7eO"
              }
              placeholder="#FFHUD..."
            />
          </label>
        </div>

        {/* CARD 3: ĐIỀU CHỈNH KHOẢNG ĐỘ NHẠY */}
        <div className="vt-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, marginTop: 0, display: "flex", alignItems: "center", gap: 8, color: "#3b82f6" }}>
            <i className="fa-solid fa-sliders" />
            <span>3. Điều Chỉnh Khoảng Độ Nhạy & Nút Bắn Cho Các Thiết Bị</span>
          </h2>
          <p className="vt-hint" style={{ marginBottom: 16 }}>
            Hệ thống sẽ dựa vào tên thiết bị của người chơi để tính toán giá trị ngẫu nhiên tối ưu trong khoảng (Min - Max) này.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {/* Nhìn xung quanh iOS */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>🍎 Nhìn xung quanh (iOS / iPhone / iPad)</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Min</span>
                  <input type="number" name="iosGeneralMin" defaultValue={config?.iosGeneralMin ?? 85} />
                </label>
                <label className="vt-field">
                  <span>Max</span>
                  <input type="number" name="iosGeneralMax" defaultValue={config?.iosGeneralMax ?? 155} />
                </label>
              </div>
            </div>

            {/* Nhìn xung quanh Android */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>🤖 Nhìn xung quanh (Android)</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Min</span>
                  <input type="number" name="androidGeneralMin" defaultValue={config?.androidGeneralMin ?? 110} />
                </label>
                <label className="vt-field">
                  <span>Max</span>
                  <input type="number" name="androidGeneralMax" defaultValue={config?.androidGeneralMax ?? 200} />
                </label>
              </div>
            </div>

            {/* Nhìn xung quanh PC */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>💻 Nhìn xung quanh (PC Giả Lập)</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Min</span>
                  <input type="number" name="pcGeneralMin" defaultValue={config?.pcGeneralMin ?? 80} />
                </label>
                <label className="vt-field">
                  <span>Max</span>
                  <input type="number" name="pcGeneralMax" defaultValue={config?.pcGeneralMax ?? 135} />
                </label>
              </div>
            </div>

            {/* Red Dot & 2X */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>🔴 Red Dot & Ống ngắm 2X</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Red Dot (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="redDotMin" defaultValue={config?.redDotMin ?? 65} />
                    <input type="number" name="redDotMax" defaultValue={config?.redDotMax ?? 95} />
                  </div>
                </label>
                <label className="vt-field">
                  <span>2X (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="scope2xMin" defaultValue={config?.scope2xMin ?? 65} />
                    <input type="number" name="scope2xMax" defaultValue={config?.scope2xMax ?? 92} />
                  </div>
                </label>
              </div>
            </div>

            {/* 4X & Sniper */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>🔭 Ống ngắm 4X & Súng ngắm (Sniper)</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>4X (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="scope4xMin" defaultValue={config?.scope4xMin ?? 60} />
                    <input type="number" name="scope4xMax" defaultValue={config?.scope4xMax ?? 90} />
                  </div>
                </label>
                <label className="vt-field">
                  <span>Sniper (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="sniperMin" defaultValue={config?.sniperMin ?? 30} />
                    <input type="number" name="sniperMax" defaultValue={config?.sniperMax ?? 48} />
                  </div>
                </label>
              </div>
            </div>

            {/* Camera tự do & Nút bắn */}
            <div style={{ padding: 12, borderRadius: 8, border: "1px solid var(--vi-line)", background: "rgba(255,255,255,0.02)" }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>👁️ Camera tự do & Kích thước Nút Bắn (%)</strong>
              <div className="vt-row">
                <label className="vt-field">
                  <span>Camera (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="freeLookMin" defaultValue={config?.freeLookMin ?? 40} />
                    <input type="number" name="freeLookMax" defaultValue={config?.freeLookMax ?? 65} />
                  </div>
                </label>
                <label className="vt-field">
                  <span>Nút bắn % (Min - Max)</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" name="fireButtonMin" defaultValue={config?.fireButtonMin ?? 35} />
                    <input type="number" name="fireButtonMax" defaultValue={config?.fireButtonMax ?? 55} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <label className="vt-field" style={{ marginTop: 14 }}>
            <span>Nội dung Mẹo kéo tâm Full Đỏ hiển thị dưới kết quả</span>
            <textarea
              name="tipsText"
              rows={3}
              defaultValue={
                config?.tipsText ||
                "Kéo tâm chữ J cho cận chiến và kéo thẳng lên khi bắn tầm trung/xa. Chỉnh nút bắn vừa ngón tay cái."
              }
              placeholder="Nhập mẹo kéo tâm..."
            />
          </label>
        </div>

        {/* CARD 4: CHÚ THÍCH & HƯỚNG DẪN TRANG CHỦ FREE FIRE */}
        <div className="vt-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, marginTop: 0, display: "flex", alignItems: "center", gap: 8, color: "#ec4899" }}>
            <i className="fa-solid fa-circle-info" />
            <span>4. Chú Thích & Hướng Dẫn Trang Tra Cứu (/freefire)</span>
          </h2>
          <p className="vt-hint" style={{ marginBottom: 16 }}>
            Các thông tin này sẽ hiển thị bên dưới form tìm kiếm trên trang <strong>/freefire</strong>. Bỏ trống mục nào sẽ tự ẩn mục đó.
          </p>

          <label className="vt-check" style={{ marginBottom: 12 }}>
            <input
              type="checkbox"
              name="visible"
              defaultChecked={config?.visible ?? true}
            />
            <span>Hiển thị phần chú thích này trên trang /freefire</span>
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
              rows={4}
              defaultValue={config?.content ?? ""}
              placeholder="Nhập nội dung lưu ý, quy tắc kéo tâm, mẹo chỉnh DPI... (hỗ trợ xuống dòng)"
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

          <div className="vt-row">
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
          </div>
        </div>

        {/* NÚT LƯU TOÀN DIỆN */}
        <div className="vt-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <button className="vt-btn-primary" type="submit" style={{ padding: "12px 24px", fontSize: 15 }}>
            <i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />
            Lưu Tất Cả Cấu Hình Free Fire
          </button>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/freefire"
              target="_blank"
              rel="noopener noreferrer"
              className="vt-btn-sm"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>Xem trang tra cứu</span>
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
            <a
              href="/freefire/result?device=Poco&type=android"
              target="_blank"
              rel="noopener noreferrer"
              className="vt-btn-sm"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>Xem thử trang kết quả (Poco)</span>
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          </div>
        </div>
      </form>

      {/* Khối xem trước Chú thích */}
      {(config?.content || config?.imageUrl || config?.videoUrl || config?.linkUrl) && (
        <div className="vt-card" style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 15, marginTop: 0, marginBottom: 12 }}>
            👀 Xem trước chú thích trên trang /freefire:
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
              <p style={{ margin: "0 0 12px 0", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line", color: "var(--vi-sub)" }}>
                {config.content}
              </p>
            )}
            {config.linkUrl && (
              <div style={{ marginBottom: 12 }}>
                <a
                  href={config.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mdarker-action-btn"
                  style={{ textDecoration: "none", display: "inline-flex", padding: "6px 14px", fontSize: 13 }}
                >
                  <span>{config.linkText || "Xem Chi Tiết"}</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 11, marginLeft: 6 }} />
                </a>
              </div>
            )}
            {config.imageUrl && (
              <div style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden", maxWidth: 500 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.imageUrl}
                  alt="Ảnh minh họa"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            )}
            {embedUrl && (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 8,
                  maxWidth: 500,
                }}
              >
                <iframe
                  src={embedUrl}
                  title="YouTube video"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
