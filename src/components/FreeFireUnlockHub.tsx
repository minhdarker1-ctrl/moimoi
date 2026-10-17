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
  source?: "WEB" | "TELEGRAM";
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
  const [toastMsg, setToastMsg] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isRestoredFlash, setIsRestoredFlash] = useState(false);

  const isUidValid = uid.length >= 8 && uid.length <= 12;

  // Khôi phục UID 2 lớp (URL query param + localStorage) & Làm sạch thanh địa chỉ
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    const urlUid = sp.get("uid")?.trim().replace(/\D/g, "");

    if (urlUid) {
      setUid(urlUid);
      setIsRestoredFlash(true);
      setTimeout(() => setIsRestoredFlash(false), 2400);
      try {
        localStorage.setItem(
          "ff_saved_uid",
          JSON.stringify({ uid: urlUid, exp: Date.now() + 24 * 60 * 60 * 1000 })
        );
      } catch {}
    } else {
      try {
        const raw = localStorage.getItem("ff_saved_uid");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.uid && parsed?.exp > Date.now()) {
            setUid(parsed.uid);
            setIsRestoredFlash(true);
            setTimeout(() => setIsRestoredFlash(false), 2400);
          }
        }
      } catch {}
    }

    if (sp.get("ontop") === "success") {
      const credits = sp.get("credits") || "1";
      setToastMsg(`🎉 VƯỢT LINK THÀNH CÔNG! Bạn đã nhận được +1 lượt Verify UID (Số dư: ${credits} lượt).`);
      setTimeout(() => setToastMsg(""), 8000);
    }

    // Dọn sạch URL query param để tránh "bóng ma" toast ảo khi F5
    if (sp.has("ontop") || sp.has("uid") || sp.has("credits") || sp.has("step") || sp.has("unlimited")) {
      try {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("ontop");
        cleanUrl.searchParams.delete("step");
        cleanUrl.searchParams.delete("credits");
        cleanUrl.searchParams.delete("uid");
        cleanUrl.searchParams.delete("unlimited");
        window.history.replaceState(null, "", cleanUrl.toString());
      } catch {}
    }
  }, []);

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
          try {
            localStorage.removeItem("ff_saved_uid");
          } catch {}
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

  // Tự động lưu UID vào localStorage khi nhập/dán để người dùng không phải nhập lại
  function handleUidChange(val: string) {
    const clean = val.replace(/\D/g, "");
    setUid(clean);
    if (errorMsg) setErrorMsg("");
    if (clean) {
      try {
        localStorage.setItem(
          "ff_saved_uid",
          JSON.stringify({ uid: clean, exp: Date.now() + 24 * 60 * 60 * 1000 })
        );
      } catch {}
    }
  }

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
        handleUidChange(clean.slice(0, 15));
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

  const earnedCount = ontopPass?.earnedCount ?? ontopPass?.count ?? 0;
  const activeGatewayName = ontopPass?.activeGatewayName || (earnedCount >= 2 ? "Link4m" : "VietUser");
  const currentGatewayStep = ontopPass?.currentGatewayStep || (earnedCount < 2 ? earnedCount + 1 : (earnedCount - 2) + 1);
  const allGatewaysExhausted = Boolean(ontopPass?.allGatewaysExhausted || earnedCount >= 4);

  // Chuyển hướng sang trang Vượt Link (Bảo toàn UID 2 lớp & Kiểm tra định dạng trước)
  async function handleRedirectToBypassLink() {
    const cleanUid = uid.trim().replace(/\D/g, "");
    if (cleanUid && (cleanUid.length < 5 || cleanUid.length > 15)) {
      setErrorMsg("UID không hợp lệ. Vui lòng nhập từ 5–15 chữ số trước khi vượt link.");
      return;
    }

    setIsRedirecting(true);
    setErrorMsg("");

    // Lớp 2: Lưu localStorage phòng trường hợp mở tab mới
    if (cleanUid) {
      try {
        localStorage.setItem(
          "ff_saved_uid",
          JSON.stringify({ uid: cleanUid, exp: Date.now() + 30 * 60 * 1000 })
        );
      } catch {}
    }

    try {
      const res = await fetch("/api/ontop/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: "freefire", uid: cleanUid }),
      });
      const json = await res.json();
      const targetLink = json.link || json.redirectUrl || json.url;
      if (json.success && targetLink) {
        window.location.href = targetLink;
      } else {
        setIsRedirecting(false);
        setErrorMsg(json.error || "Không thể tạo liên kết vượt link lúc này. Vui lòng thử lại sau!");
      }

    } catch {
      setIsRedirecting(false);
      setErrorMsg("Lỗi kết nối khi khởi tạo liên kết. Vui lòng thử lại!");
    }
  }

  // Thực thi Verify UID khi đã có Credit khả dụng
  async function handleExecuteVerify() {
    // Chặn Bot honeypot
    if (honeypot.trim()) {
      setStatus("error");
      setErrorMsg("Yêu cầu không hợp lệ.");
      return;
    }

    const cleanUid = uid.trim().replace(/\D/g, "");

    // Kiểm tra UID
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

    if (!canVerify) {
      setStatus("error");
      setErrorMsg("Bạn chưa có lượt Verify khả dụng. Vui lòng hoàn thành vượt link ở nút bên dưới để nhận lượt!");
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

      // Polling kiểm tra tiến độ thời gian thực
      let phase: "PENDING" | "PROCESSING" = "PENDING";
      let phaseElapsedSeconds = 0;
      const PENDING_TIMEOUT = 45; // Tối đa 45s chờ Worker nhận task
      const PROCESSING_TIMEOUT = 35; // Tối đa 35s chờ Worker giải và nạp Whitelist
      const POLL_INTERVAL_MS = 2000;

      activePollRef.current = setInterval(async () => {
        phaseElapsedSeconds += POLL_INTERVAL_MS / 1000;

        try {
          const statusRes = await fetch(`/api/freefire/unlock?jobId=${jobId}`);
          const statusData = await statusRes.json();

          if (statusData.success) {
            if (statusData.status === "PROCESSING") {
              if (phase !== "PROCESSING") {
                // Worker vừa chuyển từ PENDING sang PROCESSING -> Reset đồng hồ cho phase này
                phase = "PROCESSING";
                phaseElapsedSeconds = 0;
              }
              setStatus("processing");
              const pct = Math.min(
                85,
                45 + Math.round((phaseElapsedSeconds / PROCESSING_TIMEOUT) * 40)
              );
              setProgressPct(pct);
              setStepMessage(
                `Đang nạp UID ${cleanUid} vào hệ thống ${
                  statusData.serverLabel || currentPortLabel
                }... (${Math.round(phaseElapsedSeconds)}s)`
              );
            } else if (statusData.status === "PENDING") {
              setStatus("queued");
              const pct = Math.min(
                40,
                15 + Math.round((phaseElapsedSeconds / PENDING_TIMEOUT) * 25)
              );
              setProgressPct(pct);
              setStepMessage(
                `Đang xếp hàng chờ Worker tiếp nhận... (${Math.round(
                  phaseElapsedSeconds
                )}s)`
              );
            } else if (statusData.status === "SUCCESS") {
              if (activePollRef.current) {
                clearInterval(activePollRef.current);
                activePollRef.current = null;
              }
              try {
                localStorage.removeItem("ff_saved_uid");
              } catch {}
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
                statusData.resultMessage ||
                  "Máy chủ báo lỗi khi xử lý kích hoạt UID. Lượt Verify đã được hoàn trả!"
              );
              // Phục hồi lượt hiển thị trên UI
              try {
                const refreshRes = await fetch("/api/ontop/status");
                const refreshData = await refreshRes.json();
                if (refreshData.success) {
                  setOntopPass(refreshData);
                } else {
                  setOntopPass((prev) =>
                    prev
                      ? {
                          ...prev,
                          usedCount: Math.max(0, prev.usedCount - 1),
                          availableCredits: prev.availableCredits + 1,
                          hasAccess: true,
                        }
                      : null
                  );
                }
              } catch {
                setOntopPass((prev) =>
                  prev
                    ? {
                        ...prev,
                        usedCount: Math.max(0, prev.usedCount - 1),
                        availableCredits: prev.availableCredits + 1,
                        hasAccess: true,
                      }
                    : null
                );
              }
              return;
            }
          }
        } catch {}

        // Kiểm tra timeout theo từng giai đoạn
        if (
          (phase === "PENDING" && phaseElapsedSeconds >= PENDING_TIMEOUT) ||
          (phase === "PROCESSING" && phaseElapsedSeconds >= PROCESSING_TIMEOUT)
        ) {
          if (activePollRef.current) {
            clearInterval(activePollRef.current);
            activePollRef.current = null;
          }
          setStatus("error");
          setErrorMsg(
            phase === "PENDING"
              ? "Worker đang bận hoặc tạm nghỉ. Yêu cầu chưa kịp xử lý và lượt của bạn đã được bảo lưu an toàn. Vui lòng thử lại sau ít phút!"
              : "Hết thời gian kết nối tới máy chủ game. Hệ thống đang dọn dẹp và sẽ tự động hoàn lại lượt Verify cho bạn nếu thất bại!"
          );
          // Đồng bộ lại lượt thực tế
          try {
            const refreshRes = await fetch("/api/ontop/status");
            const refreshData = await refreshRes.json();
            if (refreshData.success) {
              setOntopPass(refreshData);
            }
          } catch {}
        }
      }, POLL_INTERVAL_MS);
    } catch {
      setStatus("error");
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng kiểm tra đường truyền và thử lại!");
    }
  }

  // Điều phối Submit Form: Khi có credit thì Verify, khi chưa có thì vượt link
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBusy || isRedirecting) return;

    if (allGatewaysExhausted && availableCredits === 0) {
      setErrorMsg("Bạn đã đạt giới hạn vượt link tối đa trong ngày (4 lượt). Vui lòng quay lại sau 00:00!");
      return;
    }

    if (availableCredits > 0) {
      await handleExecuteVerify();
    } else {
      await handleRedirectToBypassLink();
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

          {/* CỤM HERO INPUT: UID FREE FIRE */}
          <div className={`kps-hero-input-container ${isUidValid ? "is-valid" : ""} ${isRestoredFlash ? "flash-restored" : ""}`}>
            {/* Header của ô Input: Label + Trạng thái kết nối gộp chung */}
            <div className="kps-hero-input-header">
              <label htmlFor="uid" className="kps-hero-label">
                <span className="kps-hero-pulse-dot" aria-hidden="true" />
                <span>Nhập UID Free Fire Cần Mở Khóa</span>
              </label>

              {/* Đưa trạng thái cổng lên góc phải để tiết kiệm diện tích */}
              <div className={`kps-hero-status-badge ${workerStatus?.isOnline ? "online" : "offline"}`}>
                <span className="kps-hero-status-dot" aria-hidden="true" />
                <span>
                  {server === "astute" ? "Astute" : "FF Kipas"}: {workerStatus?.isOnline ? "Sẵn sàng" : "Bảo trì"}
                </span>
              </div>
            </div>

            {/* Ô Input chính & Nút Dán & Icon */}
            <div className="kps-hero-input-wrap">
              <div className={`kps-hero-input-icon ${isUidValid ? "valid" : ""}`} aria-hidden="true">
                {isUidValid ? (
                  <i className="fa-solid fa-circle-check" />
                ) : (
                  <i className="fa-solid fa-user" />
                )}
              </div>

              <input
                id="uid"
                name="uid"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                autoComplete="off"
                aria-describedby="uid-help"
                placeholder="VD: 1234567890..."
                value={uid}
                onChange={(e) => handleUidChange(e.target.value)}
                disabled={isBusy}
                className="kps-hero-input"
              />

              {/* Cụm góc phải: Bộ đếm ký tự & Nút dán ID */}
              <div className="kps-hero-actions-right">
                {uid.length > 0 && (
                  <span className={`kps-hero-char-count ${isUidValid ? "valid" : ""}`}>
                    {uid.length} số {isUidValid ? "✓" : ""}
                  </span>
                )}
                <button
                  type="button"
                  className="kps-hero-paste-btn"
                  onClick={handlePaste}
                  disabled={isBusy}
                  title="Dán nhanh UID từ bộ nhớ tạm"
                  aria-label="Dán UID từ bộ nhớ tạm"
                >
                  <i className="fa-regular fa-clipboard" />
                  <span>{pasteToast || "📋 Dán ID"}</span>
                </button>
              </div>
            </div>

            {/* Dòng nhắc bảo mật dịu mắt (Chống Warning Fatigue) */}
            <p id="uid-help" className="kps-hero-security-notice">
              <i className="fa-solid fa-lock" />
              <span>Chỉ nhập <strong>UID số</strong>. Tuyệt đối không nhập mật khẩu hay mã OTP.</span>
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

          {/* THẺ TIẾN ĐỘ VƯỢT LINK ONTOP.LINK (ĐẶT NGAY TRÊN NÚT BẤM CTA ĐỂ TỐI ƯU TÂM LÝ UX) */}
          <OntopPassWidget service="freefire" onStatusChange={setOntopPass} />

          {/* BANNER BÁO SẴN SÀNG VERIFY KHI CÓ CREDIT */}
          {availableCredits > 0 && !isBusy && (
            <div className="ontop-ready-banner">
              <i className="fa-solid fa-circle-check" />
              <span>
                Bạn đang có <strong>{availableCredits} lượt Verify khả dụng</strong>. Nhập UID và bấm <strong>VERIFY UID NGAY</strong> bên dưới!
              </span>
            </div>
          )}

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
            /* NÚT SUBMIT CHÍNH (SINGLE DYNAMIC ACTION CTA) */
            <div className="kps-btn-wrap">
              {isBusy ? (
                <button type="button" className="kps-verify-btn" disabled>
                  <i className="fa-solid fa-bolt fa-spin" />
                  <span>⚡ ĐANG XÁC MINH...</span>
                </button>
              ) : isRedirecting ? (
                <button type="button" className="kps-verify-btn bypass-mode" disabled>
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>ĐANG TẠO LIÊN KẾT ({activeGatewayName})...</span>
                </button>
              ) : availableCredits > 0 ? (
                /* STATE D: CÓ LƯỢT KHẢ DỤNG -> NÚT VERIFY CHUẨN XANH NEON */
                <>
                  <button
                    type="submit"
                    className="kps-verify-btn ready-mode"
                    disabled={!uid.trim()}
                  >
                    <i className="fa-solid fa-shield-halved" />
                    <span>🛡️ VERIFY UID NGAY ({availableCredits} LƯỢT KHẢ DỤNG)</span>
                  </button>
                  <p className="kps-btn-subnote" style={{ color: "#34d399" }}>
                    <i className="fa-solid fa-circle-check" /> Sẵn sàng! Bấm để kích hoạt Whitelist cho UID của bạn.
                  </p>
                </>
              ) : allGatewaysExhausted ? (
                /* STATE E: TOÀN BỘ CỔNG ĐÃ HẾT LƯỢT TRONG NGÀY */
                <>
                  <button
                    type="button"
                    className="kps-verify-btn exhausted-mode"
                    disabled
                  >
                    <i className="fa-solid fa-hourglass-half" />
                    <span>⏳ ĐÃ ĐẠT GIỚI HẠN HÔM NAY (QUAY LẠI SAU 00:00)</span>
                  </button>
                  <p className="kps-btn-subnote" style={{ color: "#94a3b8" }}>
                    <i className="fa-solid fa-circle-info" /> Bạn đã vượt đủ 4/4 lượt hôm nay. Hạn mức sẽ tự động mở lại sau 00:00!
                  </p>
                </>
              ) : (
                /* STATE A/B/C: CHƯA CÓ CREDIT -> NÚT VƯỢT LINK ĐỘNG THEO CỔNG */
                <>
                  <button
                    type="submit"
                    className="kps-verify-btn bypass-mode"
                  >
                    {earnedCount === 0 ? (
                      <>
                        <i className="fa-solid fa-rocket" />
                        <span>🚀 VƯỢT LINK ĐỂ VERIFY UID (LƯỢT 1/2)</span>
                      </>
                    ) : earnedCount === 1 ? (
                      <>
                        <i className="fa-solid fa-bolt" />
                        <span>⚡ VƯỢT LINK {activeGatewayName.toUpperCase()} (LƯỢT 2/2) ĐỂ VERIFY</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-arrows-rotate" />
                        <span>🔄 VƯỢT LINK {activeGatewayName.toUpperCase()} (LƯỢT {currentGatewayStep}/2) ĐỂ VERIFY</span>
                      </>
                    )}
                  </button>
                  <p className="kps-btn-subnote">
                    <i className="fa-solid fa-circle-info" /> Nhập UID ở trên (không bắt buộc) rồi bấm để vượt link nhận lượt Verify.
                  </p>
                </>
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
                <span className="recent-server">
                  {item.server}
                  {item.source === "TELEGRAM" && (
                    <span className="kps-source-tele" title="Kích hoạt từ Telegram Bot @mdarker_bot">
                      ⚡ Tele
                    </span>
                  )}
                </span>
                <span className="recent-time">{item.timeAgo}</span>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
