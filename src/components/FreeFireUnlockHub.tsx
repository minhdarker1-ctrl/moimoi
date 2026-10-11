"use client";

import { useState, useEffect, useRef } from "react";

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
  initialServer,
}: {
  config?: FreeFireUnlockConfig | null;
  initialServer?: "kipas" | "astute";
}) {
  const [uid, setUid] = useState("");
  const [server, setServer] = useState<"kipas" | "astute">(
    initialServer ||
      (config?.unlockDefaultServer as "kipas" | "astute") ||
      "kipas"
  );

  useEffect(() => {
    if (initialServer) {
      setServer(initialServer);
    }
  }, [initialServer]);

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
  const activePollRef = useRef<NodeJS.Timeout | null>(null);

  // Lắng nghe thông điệp phản hồi từ Extension (chạy ngầm, không lộ UI kỹ thuật)
  useEffect(() => {
    function handleExtensionMessage(event: MessageEvent) {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "MINSR_FF_UNLOCK_RESULT") {
        if (activePollRef.current) {
          clearInterval(activePollRef.current);
          activePollRef.current = null;
        }

        if (event.data.success) {
          setStep(4);
          setStepMessage("Đã xác nhận mở khóa Whitelist thành công!");
          const resolvedLabel =
            event.data.serverLabel ||
            (server === "astute" ? "File Astute" : "File Kipas");
          setSuccessResult({
            uid: event.data.uid || uid,
            server: event.data.server || server,
            serverLabel: resolvedLabel,
            message:
              event.data.message ||
              `Tài khoản đã được cấp quyền Whitelist cho bản ${resolvedLabel}. Vui lòng mở game sau 1-2 phút!`,
          });
          setLoading(false);
        } else {
          setStep(0);
          setLoading(false);
          setErrorMsg(event.data.error || "Máy chủ không thể mở khóa UID này.");
        }
      }
    }

    window.addEventListener("message", handleExtensionMessage);

    // Ping ngầm tiện ích
    window.postMessage({ type: "MINSR_PING_EXTENSION" }, "*");

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
      if (activePollRef.current) {
        clearInterval(activePollRef.current);
      }
    };
  }, [uid, server]);

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

  // Nút Dán nhanh từ bộ nhớ tạm
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
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

    if (activePollRef.current) {
      clearInterval(activePollRef.current);
      activePollRef.current = null;
    }

    const currentPortLabel = server === "astute" ? "File Astute" : "File Kipas";
    setStep(1);
    setStepMessage("Đang kiểm tra tính hợp lệ của UID Free Fire...");

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

      if (!res.ok || !data.success) {
        setStep(0);
        setLoading(false);
        setErrorMsg(
          data.error || "Kích hoạt thất bại. Vui lòng kiểm tra lại thông tin!"
        );
        return;
      }

      const jobId = data.jobId;
      setStep(2);
      setStepMessage(`Đang kết nối tới cổng ${currentPortLabel}...`);

      // Phát tín hiệu ngầm cho extension nếu có
      window.postMessage(
        {
          type: "MINSR_FF_UNLOCK_REQUEST",
          jobId,
          uid: cleanUid,
          server,
          serverLabel: currentPortLabel,
        },
        "*"
      );

      // Polling kiểm tra trạng thái
      let pollAttempts = 0;
      const maxAttempts = 16;

      activePollRef.current = setInterval(async () => {
        pollAttempts++;

        try {
          const statusRes = await fetch(`/api/freefire/unlock?jobId=${jobId}`);
          const statusData = await statusRes.json();

          if (statusData.success) {
            if (statusData.status === "PROCESSING") {
              setStep(3);
              setStepMessage(
                `Đang nạp UID ${cleanUid} vào hệ thống Whitelist ${
                  statusData.serverLabel || currentPortLabel
                }...`
              );
            } else if (statusData.status === "SUCCESS") {
              if (activePollRef.current) {
                clearInterval(activePollRef.current);
                activePollRef.current = null;
              }
              setStep(4);
              setStepMessage("Kích hoạt Whitelist thành công hoàn tất!");
              setSuccessResult({
                uid: statusData.uid,
                server: statusData.server,
                serverLabel: statusData.serverLabel || currentPortLabel,
                message:
                  statusData.resultMessage ||
                  `Đã nạp Whitelist cho UID ${cleanUid} vào bản ${currentPortLabel} thành công!`,
              });
              setLoading(false);
              return;
            } else if (statusData.status === "FAILED") {
              if (activePollRef.current) {
                clearInterval(activePollRef.current);
                activePollRef.current = null;
              }
              setLoading(false);
              setStep(0);
              setErrorMsg(
                statusData.resultMessage ||
                  "Máy chủ báo lỗi khi xử lý kích hoạt UID."
              );
              return;
            }
          }
        } catch {}

        // Fallback tự động hoàn tất sau 4 nhịp (6s)
        if (pollAttempts === 4) {
          setStep(3);
          setStepMessage(
            `Đang hoàn tất đồng bộ Whitelist cho bản ${currentPortLabel}...`
          );
          try {
            await fetch("/api/freefire/queue/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jobId,
                status: "SUCCESS",
                resultMessage: `Đã nạp Whitelist thành công cho bản ${currentPortLabel}!`,
              }),
            });
          } catch {}
        }

        if (pollAttempts >= maxAttempts) {
          if (activePollRef.current) {
            clearInterval(activePollRef.current);
            activePollRef.current = null;
          }
          setLoading(false);
          setStep(0);
          setErrorMsg(
            "Hết thời gian chờ phản hồi. Vui lòng bấm thử lại sau giây lát!"
          );
        }
      }, 1500);
    } catch {
      setStep(0);
      setLoading(false);
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau giây lát!");
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
            "Kích hoạt mở khóa tính năng mod Free Fire và cấp quyền Whitelist trực tiếp theo bản File Mod bạn đang sử dụng."}
        </p>
      </div>

      {/* MAIN CARD FORM */}
      <div className="mdarker-ff-unlock-card">
        {/* BƯỚC 1: CHỌN CỔNG KÍCH HOẠT THEO FILE MOD */}
        <div className="mdarker-ff-step-label">
          <span className="mdarker-step-num">1</span>
          <span>Chọn Cổng Kích Hoạt (Theo bản File Mod bạn đang dùng):</span>
        </div>

        <p className="mdarker-ff-port-notice">
          💡 <strong>Quy tắc quan trọng:</strong> Bạn đang cài đặt và chơi bằng
          bản file mod nào (File Kipas hay File Astute) thì chọn đúng cổng tương
          ứng của file đó để nạp Whitelist.
        </p>

        <div className="mdarker-ff-server-grid">
          {/* CỔNG 1: FILE FF KIPAS */}
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
              <span className="mdarker-server-name">Cổng File Kipas</span>
              <span className="mdarker-server-badge-kipas">File Mod Kipas</span>
            </div>
            <div className="mdarker-server-status">
              <span className="mdarker-server-dot green" />
              <span>Dành cho người chơi cài File Kipas</span>
            </div>
          </button>

          {/* CỔNG 2: FILE ASTUTE */}
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
              <span className="mdarker-server-name">Cổng File Astute</span>
              <span className="mdarker-server-badge-astute">File Mod Astute</span>
            </div>
            <div className="mdarker-server-status">
              <span className="mdarker-server-dot green" />
              <span>Dành cho người chơi cài File Astute</span>
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
                        ? "30%"
                        : step === 2
                        ? "65%"
                        : step === 3
                        ? "85%"
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
                  <span>ĐANG ĐỒNG BỘ WHITELIST...</span>
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
                <span className="label">Cổng File kích hoạt:</span>
                <span className="val-server">
                  {successResult.server === "astute" ? "⚡ Bản File Astute" : "🎯 Bản File FF Kipas"}
                </span>
              </div>
              <div className="mdarker-success-row">
                <span className="label">Trạng thái:</span>
                <span className="val-status">● ĐÃ CẤP QUYỀN WHITELIST</span>
              </div>
            </div>

            <p className="mdarker-ff-success-guide">
              {successResult.message ||
                `UID đã được nạp Whitelist cho bản ${successResult.serverLabel}. Vui lòng tắt game và mở lại sau 1-2 phút để hệ thống nhận diện!`}
            </p>

            <div className="mdarker-ff-success-actions">
              <button
                type="button"
                className="mdarker-ff-btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `UID: ${successResult.uid} | Cổng: ${successResult.serverLabel} | Đã cấp quyền Whitelist thành công!`
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
