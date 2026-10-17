"use client";

import { useState, useEffect, useRef } from "react";
import OntopPassWidget, { OntopStatusData } from "@/components/OntopPassWidget";

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

export type ServerType = "kipas" | "astute";
export type VerifyStatus =
  | "idle"
  | "validating"
  | "queued"
  | "processing"
  | "success"
  | "error"
  | "failover";

export default function FreeFireUnlockHub({
  config,
  initialServer,
  onBack,
}: {
  config?: FreeFireUnlockConfig | null;
  initialServer?: ServerType;
  onBack?: () => void;
}) {
  const [uid, setUid] = useState("");
  const [server, setServer] = useState<ServerType>(
    initialServer ||
      (config?.unlockDefaultServer as ServerType) ||
      "kipas"
  );

  useEffect(() => {
    if (initialServer) {
      setServer(initialServer);
    }
  }, [initialServer]);

  // State Machine
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [ontopPass, setOntopPass] = useState<OntopStatusData | null>(null);
  const availableCredits = ontopPass?.availableCredits ?? 0;
  const canVerify = availableCredits > 0;
  const [keyInput, setKeyInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [stepMessage, setStepMessage] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [pasteToast, setPasteToast] = useState("");
  const [copiedUid, setCopiedUid] = useState(false);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);

  const [successResult, setSuccessResult] = useState<{
    uid: string;
    server: ServerType;
    serverLabel: string;
    message: string;
  } | null>(null);

  const activePollRef = useRef<NodeJS.Timeout | null>(null);

  // Trạng thái Bot Worker
  const [workerStatus, setWorkerStatus] = useState<{
    isOnline: boolean;
    lastSeenSeconds: number;
    adminWakeupUrl: string;
    wakeupMessage: string;
  } | null>(null);

  useEffect(() => {
    async function checkWorker() {
      try {
        const res = await fetch("/api/freefire/worker/status");
        const data = await res.json();
        if (data.success) {
          setWorkerStatus(data);
        }
      } catch {}
    }
    checkWorker();
    const timer = setInterval(checkWorker, 12000);
    return () => clearInterval(timer);
  }, []);

  // Lắng nghe tín hiệu ngầm từ Extension
  useEffect(() => {
    function handleExtensionMessage(event: MessageEvent) {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "MINSR_FF_UNLOCK_RESULT") {
        if (activePollRef.current) {
          clearInterval(activePollRef.current);
          activePollRef.current = null;
        }

        if (event.data.success) {
          setStatus("success");
          setProgressPct(100);
          setStepMessage("Xác minh thành công!");
          const resolvedLabel =
            event.data.serverLabel || (server === "astute" ? "Astute" : "FF Kipas");
          setSuccessResult({
            uid: event.data.uid || uid,
            server: (event.data.server as ServerType) || server,
            serverLabel: resolvedLabel,
            message:
              event.data.message ||
              `Tài khoản đã được cấp quyền Whitelist cho bản ${resolvedLabel}. Vui lòng mở game sau 1–2 phút!`,
          });
        } else {
          setStatus("error");
          setErrorMsg(event.data.error || "Máy chủ không thể mở khóa UID này.");
        }
      }
    }

    window.addEventListener("message", handleExtensionMessage);
    window.postMessage({ type: "MINSR_PING_EXTENSION" }, "*");

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
      if (activePollRef.current) {
        clearInterval(activePollRef.current);
      }
    };
  }, [uid, server]);

  // Lấy lịch sử kích hoạt gần đây
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

  // Nút Dán UID từ Clipboard
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setPasteToast("Trống");
        setTimeout(() => setPasteToast(""), 1500);
        return;
      }
      const clean = text.trim().replace(/\D/g, "");
      if (clean) {
        setUid(clean.slice(0, 15));
        setErrorMsg("");
        setPasteToast("Đã dán!");
        setTimeout(() => setPasteToast(""), 1500);
      } else {
        setErrorMsg("Bộ nhớ tạm không chứa số UID hợp lệ.");
        setPasteToast("Lỗi");
        setTimeout(() => setPasteToast(""), 1500);
      }
    } catch {
      setErrorMsg("Trình duyệt chưa cấp quyền dán tự động. Vui lòng dán thủ công!");
      setPasteToast("Lỗi");
      setTimeout(() => setPasteToast(""), 1500);
    }
  }

  // Chuyển cổng failover khi có sự cố
  function handleFailover() {
    const nextServer: ServerType = server === "kipas" ? "astute" : "kipas";
    setServer(nextServer);
    setStatus("failover");
    setErrorMsg("");
    setStepMessage(`Đang chuyển sang cổng ${nextServer === "astute" ? "Astute" : "FF Kipas"}...`);
    setTimeout(() => {
      setStatus("idle");
    }, 1200);
  }

  // Gửi xác minh UID
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBusy) return;

    // Chặn Bot honeypot
    if (honeypot.trim()) {
      setStatus("error");
      setErrorMsg("Yêu cầu không hợp lệ.");
      return;
    }

    const cleanUid = uid.trim().replace(/\D/g, "");

    // Trạng thái 1 & 2: Kiểm tra UID
    setStatus("validating");

    if (!cleanUid) {
      setStatus("error");
      setErrorMsg("Vui lòng nhập UID Free Fire của bạn.");
      return;
    }

    if (cleanUid.length < 5 || cleanUid.length > 15) {
      setStatus("error");
      setErrorMsg("UID không hợp lệ. Vui lòng nhập từ 5–15 chữ số.");
      return;
    }

    // Bắt buộc có credit mới cho phép gửi yêu cầu
    if (!canVerify) {
      setStatus("error");
      setErrorMsg("Bạn chưa có lượt Verify khả dụng. Vui lòng hoàn thành vượt link ở khung phía trên để nhận lượt!");
      const widget = document.getElementById("pass-widget");
      if (widget) {
        widget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrorMsg("");
    setSuccessResult(null);
    setStatus("processing");
    setProgressPct(20);

    const currentPortLabel = server === "astute" ? "Astute" : "FF Kipas";
    setStepMessage(`Đang kết nối cổng ${currentPortLabel}...`);

    if (activePollRef.current) {
      clearInterval(activePollRef.current);
      activePollRef.current = null;
    }

    try {
      const res = await fetch("/api/freefire/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: cleanUid,
          server,
          key: keyInput.trim(),
          website: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMsg(data.error || "Không thể xử lý UID lúc này. Vui lòng thử lại sau!");
        if (data.requirePass) {
          const widget = document.getElementById("pass-widget");
          if (widget) {
            widget.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
        return;
      }

      // Đã tiêu hao thành công 1 credit -> Cập nhật state cục bộ
      setOntopPass((prev) =>
        prev
          ? {
              ...prev,
              usedCount: prev.usedCount + 1,
              availableCredits: Math.max(0, prev.availableCredits - 1),
              hasAccess: Math.max(0, prev.availableCredits - 1) > 0,
            }
          : null
      );

      const jobId = data.jobId;
      setStatus("queued");
      setProgressPct(45);
      setStepMessage(`UID đã tiếp nhận vào hàng đợi cổng ${currentPortLabel}...`);

      // Phát tín hiệu ngầm cho extension worker
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

      // Polling kiểm tra tiến độ
      let pollAttempts = 0;
      const maxAttempts = 18;

      activePollRef.current = setInterval(async () => {
        pollAttempts++;

        try {
          const statusRes = await fetch(`/api/freefire/unlock?jobId=${jobId}`);
          const statusData = await statusRes.json();

          if (statusData.success) {
            if (statusData.status === "PROCESSING") {
              setStatus("processing");
              setProgressPct(Math.min(85, 45 + pollAttempts * 4));
              setStepMessage(
                `Đang nạp UID ${cleanUid} vào hệ thống ${
                  statusData.serverLabel || currentPortLabel
                }...`
              );
            } else if (statusData.status === "SUCCESS") {
              if (activePollRef.current) {
                clearInterval(activePollRef.current);
                activePollRef.current = null;
              }
              setStatus("success");
              setProgressPct(100);
              setSuccessResult({
                uid: statusData.uid,
                server: statusData.server,
                serverLabel: statusData.serverLabel || currentPortLabel,
                message:
                  statusData.resultMessage ||
                  `Xác minh và nạp Whitelist cho UID ${cleanUid} thành công!`,
              });
              return;
            } else if (statusData.status === "FAILED") {
              if (activePollRef.current) {
                clearInterval(activePollRef.current);
                activePollRef.current = null;
              }
              setStatus("error");
              setErrorMsg(
                statusData.resultMessage || "Máy chủ báo lỗi khi xử lý kích hoạt UID."
              );
              return;
            }
          }
        } catch {}

        // Fallback tự động hoàn tất sau 5 nhịp nếu worker đã xong ngầm
        if (pollAttempts === 5) {
          setProgressPct(90);
          setStepMessage(`Đang hoàn tất đồng bộ danh sách cổng ${currentPortLabel}...`);
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
          setStatus("error");
          setErrorMsg("Hết thời gian chờ phản hồi. Vui lòng bấm thử lại sau giây lát!");
        }
      }, 1500);
    } catch {
      setStatus("error");
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng kiểm tra đường truyền và thử lại!");
    }
  }

  const isBusy =
    status === "validating" || status === "processing" || status === "queued";

  const teleLink = config?.teleBotLink || "https://t.me/mdarker_bot";

  return (
    <div className="kps-verify-wrapper" aria-label="Xác minh UID Free Fire">
      {/* 1. HEADER THƯƠNG HIỆU THỐNG NHẤT */}
      <header className="kps-verify-topbar">
        <div className="kps-topbar-brand">
          <span className="kps-brand-badge">XD</span>
          <span className="kps-brand-title">XDARKER UID VERIFY</span>
          <span className="kps-brand-port-tag">
            Cổng hiện tại: {server === "astute" ? "ASTUTE" : "FF KIPAS"}
          </span>
        </div>

        {onBack && (
          <button
            type="button"
            className="kps-back-btn"
            onClick={onBack}
            title="Quay lại danh sách công cụ"
          >
            <i className="fa-solid fa-chevron-left" />
            <span>Quay lại</span>
          </button>
        )}
      </header>

      {/* 2. THẺ XÁC MINH TRUNG TÂM (CENTERED CARD) */}
      <main className="kps-verify-card">
        {/* Dải sáng Neon Cyan ở đỉnh thẻ */}
        <div className="kps-card-glow-bar" aria-hidden="true" />

        {/* TIÊU ĐỀ CHÍNH & MÔ TẢ */}
        <div className="kps-verify-header">
          <h1 className="kps-verify-title">
            VERIFY YOUR <span>UID</span>
          </h1>
          <p className="kps-verify-desc">
            Nhập UID Free Fire để bắt đầu xác minh. Thời gian xử lý dự kiến: 1–2 phút.
          </p>
        </div>

        {/* 3. BỘ CHỌN CỔNG CHUYỂN ĐỔI (SEGMENTED PILL SWITCHER) */}
        <div className="kps-port-section">
          <div
            className="kps-port-toggle"
            role="tablist"
            aria-label="Chọn cổng xử lý Free Fire"
          >
            <button
              type="button"
              role="tab"
              aria-selected={server === "kipas"}
              className={`kps-port-btn ${server === "kipas" ? "active" : ""}`}
              onClick={() => {
                if (!isBusy) {
                  setServer("kipas");
                  setErrorMsg("");
                }
              }}
              disabled={isBusy}
            >
              <span className="kps-port-icon">🎯</span>
              <span className="kps-port-name">FF KIPAS</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={server === "astute"}
              className={`kps-port-btn ${server === "astute" ? "active" : ""}`}
              onClick={() => {
                if (!isBusy) {
                  setServer("astute");
                  setErrorMsg("");
                }
              }}
              disabled={isBusy}
            >
              <span className="kps-port-icon">⚡</span>
              <span className="kps-port-name">ASTUTE</span>
            </button>
          </div>

          <p className="kps-port-subtext">
            <i className="fa-solid fa-circle-info" />
            <span>
              {server === "astute"
                ? "Đang sử dụng cổng Astute. Bạn có thể đổi cổng nếu cổng hiện tại gặp sự cố."
                : "Đang sử dụng cổng FF Kipas. Bạn có thể đổi cổng nếu cổng hiện tại gặp sự cố."}
            </span>
          </p>
        </div>

        {/* THẺ TIẾN ĐỘ VƯỢT LINK ONTOP.LINK MỞ KHÓA VÔ HẠN */}
        <OntopPassWidget service="freefire" onStatusChange={setOntopPass} />

        {/* 4. FORM NHẬP UID FREE FIRE */}
        <form onSubmit={handleSubmit} className="kps-verify-form" noValidate>
          {/* Honeypot chống bot tự động */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="kps-honeypot"
            aria-hidden="true"
          />

          <div className="kps-input-group">
            <label htmlFor="uid" className="kps-input-label">
              UID Free Fire
            </label>

            <div className="kps-input-wrap">
              <span className="kps-input-icon" aria-hidden="true">
                <i className="fa-solid fa-user" />
              </span>

              <input
                id="uid"
                name="uid"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{5,15}"
                maxLength={15}
                autoComplete="off"
                aria-describedby="uid-help"
                placeholder="Nhập UID 5–15 chữ số..."
                value={uid}
                onChange={(e) => {
                  setUid(e.target.value.replace(/\D/g, ""));
                  if (errorMsg) setErrorMsg("");
                }}
                disabled={isBusy}
                className="kps-input"
              />

              <button
                type="button"
                className="kps-paste-btn"
                onClick={handlePaste}
                disabled={isBusy}
                title="Dán nhanh UID từ bộ nhớ tạm"
                aria-label="Dán UID từ bộ nhớ tạm"
              >
                <i className="fa-regular fa-clipboard" />
                <span>{pasteToast || "Dán"}</span>
              </button>
            </div>

            {/* CẢNH BÁO AN TOÀN THEO YÊU CẦU KIỂM DUYỆT */}
            <p id="uid-help" className="kps-security-notice">
              <i className="fa-solid fa-lock" />
              <span>
                Chỉ nhập UID Free Fire. Không nhập mật khẩu, OTP hoặc mã khôi phục tài khoản.
              </span>
            </p>
          </div>

          {/* NẾU ADMIN YÊU CẦU KEY VÀ CHƯA CÓ VÔ HẠN ONTOP */}
          {config?.unlockRequireKey && !ontopPass?.isUnlimited && (
            <div className="kps-key-group">
              <label htmlFor="keyInput" className="kps-input-label">
                Mã Key Kích Hoạt
              </label>
              <div className="kps-input-wrap">
                <span className="kps-input-icon" aria-hidden="true">
                  <i className="fa-solid fa-key" />
                </span>
                <input
                  id="keyInput"
                  name="keyInput"
                  type="text"
                  placeholder="Nhập key mở khóa của bạn..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  disabled={isBusy}
                  className="kps-input"
                />
              </div>
            </div>
          )}

          {/* TRẠNG THÁI MÁY CHỦ SẴN SÀNG */}
          <div className="kps-server-status-pill">
            <span
              className={`kps-status-dot ${
                workerStatus?.isOnline ? "online" : "offline"
              }`}
            />
            <span className="kps-status-text">
              {server === "astute" ? "Astute: " : "FF Kipas: "}
              {workerStatus?.isOnline ? "Sẵn sàng kết nối" : "Tạm thời không khả dụng"}
            </span>
            <span className="kps-status-subnote">
              · Xác minh nhanh, không yêu cầu thao tác CAPTCHA thủ công
            </span>
          </div>

          {/* THÔNG BÁO LỖI (NẾU CÓ) */}
          {errorMsg && (
            <div className="kps-error-banner" role="alert">
              <i className="fa-solid fa-circle-exclamation" />
              <div className="kps-error-content">
                <strong>XÁC MINH THẤT BẠI</strong>
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                className="kps-failover-btn"
                onClick={handleFailover}
                title="Đổi cổng thử lại"
              >
                Đổi cổng {server === "kipas" ? "Astute" : "FF Kipas"}
              </button>
            </div>
          )}

          {/* TIẾN TRÌNH ĐANG XỬ LÝ / QUEUED */}
          {isBusy && (
            <div className="kps-progress-banner">
              <div className="kps-progress-header">
                <i className="fa-solid fa-circle-notch fa-spin" />
                <span>
                  {status === "queued"
                    ? "⏳ ĐÃ TIẾP NHẬN - Đang trong hàng đợi xử lý..."
                    : stepMessage}
                </span>
              </div>
              <div className="kps-progress-track">
                <div
                  className="kps-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <small className="kps-progress-note">
                UID: <strong>{uid}</strong> · Cổng:{" "}
                <strong>{server === "astute" ? "Astute" : "FF Kipas"}</strong> (Vui lòng không đóng trang)
              </small>
            </div>
          )}

          {/* TRẠNG THÁI BOT CHỢP MẮT (NẾU WORKER OFFLINE) */}
          {workerStatus && !workerStatus.isOnline ? (
            <div className="kps-sleep-banner">
              <div className="kps-sleep-header">
                <span className="kps-sleep-icon">💤</span>
                <strong>
                  {workerStatus.wakeupMessage ||
                    "Bot chợp mắt 1 tý, ai dùng thì kêu admin gọi bot dậy nha"}
                </strong>
              </div>
              <p className="kps-sleep-sub">
                Máy chủ tự động đang tạm nghỉ ngơi. Bạn hãy bấm nút bên dưới để gọi Admin bật bot thức dậy ngay nhé!
              </p>
              <a
                href={workerStatus.adminWakeupUrl || "https://t.me/mdarker_bot"}
                target="_blank"
                rel="noopener noreferrer"
                className="kps-wakeup-btn"
              >
                <i className="fa-solid fa-bell" />
                <span>WAKE UP - GỌI ADMIN BẬT BOT DẬY</span>
              </a>
            </div>
          ) : (
            /* NÚT SUBMIT CHÍNH VERIFY UID */
            <div className="kps-btn-wrap">
              <button
                type="submit"
                className={`kps-verify-btn ${!canVerify ? "kps-btn-locked" : ""}`}
                disabled={isBusy || !uid.trim() || !canVerify}
              >
                {isBusy ? (
                  <>
                    <i className="fa-solid fa-bolt fa-spin" />
                    <span>⚡ ĐANG XÁC MINH...</span>
                  </>
                ) : !canVerify ? (
                  <>
                    <i className="fa-solid fa-lock" />
                    <span>🔒 VƯỢT LINK ĐỂ NHẬN LƯỢT VERIFY UID</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-shield-halved" />
                    <span>VERIFY UID ({availableCredits} LƯỢT KHẢ DỤNG)</span>
                  </>
                )}
              </button>

              {!canVerify && (
                <p className="kps-btn-subnote">
                  <i className="fa-solid fa-circle-exclamation" />{" "}
                  Mỗi lượt vượt link mở khóa 1 lần Verify UID. Vui lòng bấm nhận lượt ở khung phía trên!
                </p>
              )}
            </div>
          )}
        </form>

        {/* 5. THẺ KẾT QUẢ THÀNH CÔNG */}
        {successResult && (
          <div
            className="kps-success-card"
            role="dialog"
            aria-labelledby="kps-success-title"
          >
            <div className="kps-success-badge">
              <i className="fa-solid fa-circle-check" />
              <span>XÁC MINH THÀNH CÔNG</span>
            </div>

            <h2 id="kps-success-title" className="kps-success-title">
              ID ĐÃ ĐƯỢC MỞ KHÓA WHITELIST
            </h2>

            <div className="kps-success-rows">
              <div className="kps-success-row">
                <span className="label">UID Tài khoản:</span>
                <span className="val-uid">{successResult.uid}</span>
              </div>
              <div className="kps-success-row">
                <span className="label">Cổng xử lý:</span>
                <span className="val-server">
                  {successResult.server === "astute" ? "⚡ Astute" : "🎯 FF Kipas"}
                </span>
              </div>
              <div className="kps-success-row">
                <span className="label">Trạng thái:</span>
                <span className="val-status">● ĐÃ CẤP QUYỀN WHITELIST</span>
              </div>
            </div>

            <p className="kps-success-guide">
              {successResult.message ||
                `UID đã được nạp Whitelist cho bản ${successResult.serverLabel}. Vui lòng mở game sau 1–2 phút để hệ thống nhận diện!`}
            </p>

            <div className="kps-success-actions">
              <button
                type="button"
                className="kps-btn-copy"
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
                className="kps-btn-reset"
                onClick={() => {
                  setSuccessResult(null);
                  setUid("");
                  setStatus("idle");
                }}
              >
                <span>Kích hoạt UID khác</span>
              </button>
            </div>
          </div>
        )}

        {/* TÙY CHỌN HỖ TRỢ TELEGRAM BOT */}
        <div className="kps-tele-bridge-wrap">
          <div className="kps-divider">
            <span>HOẶC SỬ DỤNG BOT TELEGRAM</span>
          </div>

          <a
            href={teleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="kps-tele-btn"
          >
            <div className="kps-tele-icon-circle">
              <i className="fa-brands fa-telegram" />
            </div>
            <div className="kps-tele-text">
              <strong>Kích hoạt qua Telegram Bot @mdarker_bot</strong>
              <small>Nhận kết quả tự động &amp; lưu thông báo riêng tư</small>
            </div>
            <i className="fa-solid fa-arrow-up-right-from-square kps-tele-arrow" />
          </a>
        </div>

        {/* TUYÊN BỐ MIỄN TRỪ PHÁP LÝ CHUẨN KIỂM DUYỆT */}
        <p className="kps-disclaimer">
          Dịch vụ độc lập, không thuộc sở hữu hoặc liên kết với Garena.
        </p>
      </main>

      {/* 6. CHÂN TRANG BẢN QUYỀN */}
      <footer className="kps-footer">
        © 2026 XDARKER Verify System. All rights reserved.
      </footer>

      {/* 7. LIVE RECENT UNLOCK TICKER */}
      {recentLogs.length > 0 && (
        <aside className="kps-recent-box" aria-label="Hoạt động kích hoạt gần đây">
          <div className="kps-recent-title">
            <span className="live-dot" />
            <span>KÍCH HOẠT GẦN ĐÂY TRÊN HỆ THỐNG</span>
          </div>

          <div className="kps-recent-list">
            {recentLogs.map((item) => (
              <div key={item.id} className="kps-recent-item">
                <span className="recent-uid">
                  <i className="fa-solid fa-user-shield" /> {item.maskedUid}
                </span>
                <span className="recent-server">{item.server}</span>
                <span className="recent-time">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
