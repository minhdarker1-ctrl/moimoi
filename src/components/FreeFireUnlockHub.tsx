"use client";

import { useState, useEffect } from "react";

export interface FreeFireUnlockConfig {
  unlockEnabled?: boolean;
  unlockRequireKey?: boolean;
  unlockDefaultServer?: string;
  unlockNotice?: string;
  unlockSuccessMsg?: string;
  teleBotLink?: string;
  staticKey?: string;
}

interface RecentLog {
  id: number;
  maskedUid: string;
  server: string;
  timeAgo: string;
}

export default function FreeFireUnlockHub({
  config,
}: {
  config?: FreeFireUnlockConfig | null;
}) {
  const [uid, setUid] = useState("");
  const [server, setServer] = useState<"kipas" | "astute">(
    (config?.unlockDefaultServer as "kipas" | "astute") || "kipas"
  );
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [stepMessage, setStepMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successResult, setSuccessResult] = useState<{
    uid: string;
    server: string;
    serverLabel: string;
    message: string;
  } | null>(null);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [copiedUid, setCopiedUid] = useState(false);

  // Lấy danh sách UID vừa kích hoạt gần đây
  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/freefire/unlock");
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setRecentLogs(data.logs);
        }
      } catch {}
    }
    fetchRecent();
  }, [successResult]);

  // Nút Dán nhanh từ bộ nhớ tạm (Clipboard)
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Chỉ lấy các chữ số
        const clean = text.trim().replace(/\D/g, "");
        if (clean) {
          setUid(clean);
          setErrorMsg("");
        } else {
          setErrorMsg("Bộ nhớ tạm không chứa số UID hợp lệ.");
        }
      }
    } catch {
      setErrorMsg("Không thể đọc bộ nhớ tạm. Vui lòng nhập hoặc dán thủ công!");
    }
  }

  // Gửi yêu cầu kích hoạt Unlock ID
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanUid = uid.trim().replace(/\D/g, "");

    if (!cleanUid) {
      setErrorMsg("Vui lòng nhập UID tài khoản Free Fire của bạn.");
      return;
    }

    if (cleanUid.length < 5 || cleanUid.length > 12) {
      setErrorMsg("UID Free Fire không hợp lệ (gồm từ 5 đến 12 chữ số).");
      return;
    }

    if (config?.unlockRequireKey && !keyInput.trim()) {
      setErrorMsg("Vui lòng nhập Key mở khóa hoặc vượt link để lấy key.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setSuccessResult(null);

    // Chuỗi hiệu ứng giả lập tiến trình kích hoạt
    setStep(1);
    setStepMessage("Đang kiểm tra tính hợp lệ của UID Free Fire...");

    const t1 = setTimeout(() => {
      setStep(2);
      setStepMessage(
        `Đang kết nối tới máy chủ ${server === "astute" ? "Astute" : "FF Kipas"}...`
      );
    }, 700);

    const t2 = setTimeout(() => {
      setStep(3);
      setStepMessage("Đang nạp dữ liệu whitelist & kích hoạt tính năng mod...");
    }, 1500);

    try {
      const res = await fetch("/api/freefire/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: cleanUid,
          server,
          key: keyInput.trim(),
        }),
      });

      const data = await res.json();

      // Đợi hiệu ứng bước 3 hoàn tất
      await new Promise((r) => setTimeout(r, 1900));

      if (!res.ok || !data.success) {
        setStep(0);
        setLoading(false);
        setErrorMsg(
          data.error || "Kích hoạt thất bại. Vui lòng kiểm tra lại thông tin!"
        );
        return;
      }

      setStep(4);
      setStepMessage("Kích hoạt thành công hoàn tất!");
      setSuccessResult({
        uid: data.uid,
        server: data.server,
        serverLabel: data.serverLabel,
        message: data.message,
      });
      setLoading(false);
    } catch {
      setStep(0);
      setLoading(false);
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau giây lát!");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
    }
  }

  const teleLink = config?.teleBotLink || "https://t.me/mdarker_bot";

  return (
    <section className="mdarker-ff-unlock-hub" aria-label="Unlock ID Free Fire">
      {/* HEADER SECTION */}
      <div className="mdarker-ff-unlock-header">
        <div className="mdarker-ff-unlock-badge-wrap">
          <span className="mdarker-ff-unlock-badge">
            <i className="fa-solid fa-bolt mdarker-ff-unlock-icon" />
            <span>WHITELIST SERVER PRO</span>
          </span>
        </div>
        <h2 className="mdarker-ff-unlock-title">
          UNLOCK ID <span>FREE FIRE</span>
        </h2>
        <p className="mdarker-ff-unlock-desc">
          {config?.unlockNotice ||
            "Kích hoạt mở khóa tính năng mod Free Fire và cấp quyền Whitelist trực tiếp lên máy chủ bảo mật."}
        </p>
      </div>

      {/* MAIN CARD FORM */}
      <div className="mdarker-ff-unlock-card">
        {/* BƯỚC 1: CHỌN MÁY CHỦ */}
        <div className="mdarker-ff-step-label">
          <span className="mdarker-step-num">1</span>
          <span>Chọn Máy Chủ Kích Hoạt:</span>
        </div>

        <div className="mdarker-ff-server-grid">
          {/* SERVER 1: FF KIPAS */}
          <button
            type="button"
            className={`mdarker-ff-server-btn ${
              server === "kipas" ? "active" : ""
            }`}
            onClick={() => setServer("kipas")}
            disabled={loading}
          >
            <div className="mdarker-server-top">
              <span className="mdarker-server-icon">🎯</span>
              <span className="mdarker-server-name">FF Kipas</span>
              <span className="mdarker-server-badge-rec">Khuyên dùng</span>
            </div>
            <div className="mdarker-server-status">
              <span className="mdarker-server-dot green" />
              <span>Máy chủ 1 · Ổn định 99.9%</span>
            </div>
          </button>

          {/* SERVER 2: ASTUTE */}
          <button
            type="button"
            className={`mdarker-ff-server-btn ${
              server === "astute" ? "active" : ""
            }`}
            onClick={() => setServer("astute")}
            disabled={loading}
          >
            <div className="mdarker-server-top">
              <span className="mdarker-server-icon">⚡</span>
              <span className="mdarker-server-name">Astute</span>
              <span className="mdarker-server-badge-vip">Dự phòng</span>
            </div>
            <div className="mdarker-server-status">
              <span className="mdarker-server-dot green" />
              <span>Máy chủ 2 · Đa tính năng</span>
            </div>
          </button>
        </div>

        {/* BƯỚC 2: NHẬP UID INGAME */}
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="mdarker-ff-step-label">
            <span className="mdarker-step-num">2</span>
            <span>Nhập UID Free Fire Của Bạn:</span>
          </div>

          <div className="mdarker-ff-input-group">
            <div className="mdarker-ff-input-wrap">
              <span className="mdarker-ff-input-icon">
                <i className="fa-solid fa-gamepad" />
              </span>
              <input
                type="text"
                className="mdarker-ff-input"
                placeholder="Nhập UID tài khoản (VD: 1982736452)..."
                value={uid}
                onChange={(e) => {
                  setUid(e.target.value.replace(/\D/g, ""));
                  setErrorMsg("");
                }}
                disabled={loading}
                maxLength={12}
                autoComplete="off"
              />
              <button
                type="button"
                className="mdarker-ff-paste-btn"
                onClick={handlePaste}
                disabled={loading}
                title="Dán từ bộ nhớ tạm"
              >
                <i className="fa-regular fa-clipboard" />
                <span>DÁN</span>
              </button>
            </div>
          </div>

          <p className="mdarker-ff-input-hint">
            <i className="fa-solid fa-circle-info" /> UID gồm từ 5 - 12 chữ số
            nguyên. Bạn có thể sao chép trong hồ sơ trang cá nhân trong game.
          </p>

          {/* NẾU YÊU CẦU KEY */}
          {config?.unlockRequireKey && (
            <div style={{ marginTop: 16 }}>
              <div className="mdarker-ff-step-label">
                <span className="mdarker-step-num">3</span>
                <span>Nhập Mã Key Kích Hoạt:</span>
              </div>
              <div className="mdarker-ff-input-wrap">
                <span className="mdarker-ff-input-icon">
                  <i className="fa-solid fa-key" />
                </span>
                <input
                  type="text"
                  className="mdarker-ff-input"
                  placeholder="Nhập key mở khóa của bạn..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* THÔNG BÁO LỖI NẾU CÓ */}
          {errorMsg && (
            <div className="mdarker-ff-error-box">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* THANH TIẾN TRÌNH KHI ĐANG CHẠY */}
          {loading && (
            <div className="mdarker-ff-progress-box">
              <div className="mdarker-ff-progress-header">
                <span className="mdarker-ff-spinner">
                  <i className="fa-solid fa-circle-notch fa-spin" />
                </span>
                <span className="mdarker-ff-progress-text">{stepMessage}</span>
              </div>
              <div className="mdarker-ff-progress-track">
                <div
                  className="mdarker-ff-progress-fill"
                  style={{
                    width:
                      step === 1
                        ? "35%"
                        : step === 2
                        ? "70%"
                        : step === 3
                        ? "90%"
                        : "100%",
                  }}
                />
              </div>
            </div>
          )}

          {/* NÚT SUBMIT CHÍNH */}
          <div style={{ marginTop: 22 }}>
            <button
              type="submit"
              className="mdarker-ff-unlock-submit-btn"
              disabled={loading || !uid.trim()}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>ĐANG XỬ LÝ KÍCH HOẠT...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt" />
                  <span>KÍCH HOẠT UNLOCK ID NGAY</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* KẾT QUẢ KÍCH HOẠT THÀNH CÔNG */}
        {successResult && (
          <div className="mdarker-ff-success-modal">
            <div className="mdarker-ff-success-badge">
              <i className="fa-solid fa-circle-check" />
              <span>KÍCH HOẠT THÀNH CÔNG</span>
            </div>

            <h3 className="mdarker-ff-success-title">
              ID ĐÃ ĐƯỢC MỞ KHÓA WHITELIST
            </h3>

            <div className="mdarker-ff-success-details">
              <div className="mdarker-success-row">
                <span className="label">UID Tài khoản:</span>
                <span className="val-uid">{successResult.uid}</span>
              </div>
              <div className="mdarker-success-row">
                <span className="label">Máy chủ kích hoạt:</span>
                <span className="val-server">
                  🎯 {successResult.serverLabel}
                </span>
              </div>
              <div className="mdarker-success-row">
                <span className="label">Trạng thái:</span>
                <span className="val-status">● ĐÃ HOÀN TẤT</span>
              </div>
            </div>

            <p className="mdarker-ff-success-guide">
              {successResult.message ||
                "Dữ liệu đã được cập nhật thành công lên server. Vui lòng tắt game và mở lại sau 1-2 phút để hệ thống nhận diện!"}
            </p>

            <div className="mdarker-ff-success-actions">
              <button
                type="button"
                className="mdarker-ff-btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `UID: ${successResult.uid} | Server: ${successResult.serverLabel} | Đã kích hoạt whitelist thành công!`
                  );
                  setCopiedUid(true);
                  setTimeout(() => setCopiedUid(false), 2000);
                }}
              >
                <i className="fa-regular fa-copy" />
                <span>{copiedUid ? "Đã sao chép!" : "Sao chép thông tin"}</span>
              </button>

              <button
                type="button"
                className="mdarker-ff-btn-primary"
                onClick={() => {
                  setSuccessResult(null);
                  setUid("");
                }}
              >
                <span>Kích hoạt UID khác</span>
              </button>
            </div>
          </div>
        )}

        {/* TÙY CHỌN TELEGRAM BOT BRIDGE */}
        <div className="mdarker-ff-tele-bridge-wrap">
          <div className="mdarker-ff-divider">
            <span>HOẶC SỬ DỤNG BOT TELEGRAM</span>
          </div>

          <a
            href={teleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mdarker-ff-tele-btn"
          >
            <div className="mdarker-tele-icon-circle">
              <i className="fa-brands fa-telegram" />
            </div>
            <div className="mdarker-tele-text">
              <strong>Kích hoạt qua Telegram Bot @mdarker_bot</strong>
              <small>
                Nhận kết quả tự động &amp; lưu thông báo riêng tư về máy
              </small>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square mdarker-tele-arrow" />
          </a>
        </div>
      </div>

      {/* LIVE RECENT UNLOCK TICKER */}
      {recentLogs.length > 0 && (
        <div className="mdarker-ff-recent-box">
          <div className="mdarker-ff-recent-title">
            <span className="live-dot" />
            <span>KÍCH HOẠT GẦN ĐÂY TRÊN HỆ THỐNG</span>
          </div>

          <div className="mdarker-ff-recent-list">
            {recentLogs.map((item) => (
              <div key={item.id} className="mdarker-ff-recent-item">
                <span className="recent-uid">
                  <i className="fa-solid fa-user-shield" /> {item.maskedUid}
                </span>
                <span className="recent-server">{item.server}</span>
                <span className="recent-time">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
