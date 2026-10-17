"use client";

import { useState, useEffect } from "react";

export interface OntopStatusData {
  earnedCount: number;
  usedCount: number;
  availableCredits: number;
  currentGateway: string;
  isExhausted: boolean;
  hasAccess: boolean;
  target: number;
  date?: string;
  count?: number;
  isUnlimited?: boolean;
  remainingSteps?: number;
}

export default function OntopPassWidget({
  service,
  onStatusChange,
}: {
  service: "freefire" | "locket";
  onStatusChange?: (data: OntopStatusData) => void;
}) {
  const [data, setData] = useState<OntopStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "gold">("success");

  // Lấy trạng thái OnTop Pass
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/ontop/status");
        const json = await res.json();
        if (json.success) {
          setData(json);
          onStatusChange?.(json);
        }
      } catch (err) {
        console.error("Lỗi lấy trạng thái Pass:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();

    // Kiểm tra query param sau khi callback về
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("ontop") === "success") {
        const step = parseInt(sp.get("step") || "1", 10);
        const credits = parseInt(sp.get("credits") || "1", 10);

        setToastType("gold");
        setToastMsg(
          `🎉 VƯỢT LINK THÀNH CÔNG! Bạn đã nhận được +1 lượt ${
            service === "freefire" ? "Verify UID" : "Buff Locket"
          } (Số dư khả dụng: ${credits} lượt).`
        );

        // Dọn sạch URL param để tránh hiện lại khi F5
        try {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("ontop");
          cleanUrl.searchParams.delete("step");
          cleanUrl.searchParams.delete("credits");
          cleanUrl.searchParams.delete("unlimited");
          window.history.replaceState({}, "", cleanUrl.toString());
        } catch {}

        setTimeout(() => setToastMsg(""), 8000);
      }
    }
  }, [service, onStatusChange]);

  // Xử lý bấm nút bắt đầu vượt link
  async function handleStart() {
    setStarting(true);
    try {
      const res = await fetch("/api/ontop/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service }),
      });

      const json = await res.json();

      if (json.success && json.redirectUrl) {
        window.location.href = json.redirectUrl;
        return;
      }

      alert(json.error || "Không thể tạo liên kết vượt link. Vui lòng thử lại!");
      setStarting(false);
    } catch {
      alert("Lỗi kết nối tới máy chủ. Vui lòng kiểm tra lại đường truyền mạng!");
      setStarting(false);
    }
  }

  const earnedCount = data?.earnedCount ?? data?.count ?? 0;
  const availableCredits = data?.availableCredits ?? 0;
  const isExhausted = earnedCount >= 2;
  const gatewayName = isExhausted ? data?.currentGateway || "LINK4M" : "OnTop.link";

  return (
    <div className="ontop-widget-container" id="pass-widget" aria-label="Thẻ Lượt Vượt Link">
      {/* THÔNG BÁO TOAST NỔI BẬT NẾU VỪA VƯỢT VỀ */}
      {toastMsg && (
        <div className={`ontop-toast-banner ${toastType}`} role="alert">
          <i className="fa-solid fa-crown fa-beat-fade" />
          <span>{toastMsg}</span>
          <button
            type="button"
            className="ontop-toast-close"
            onClick={() => setToastMsg("")}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      {/* THẺ TIẾN ĐỘ & SỐ DƯ */}
      <div className={`ontop-pass-card ${availableCredits > 0 ? "has-credits" : ""}`}>
        <div className="ontop-pass-header">
          <div className="ontop-pass-title-wrap">
            <span className="ontop-bolt-icon">⚡</span>
            <div>
              <strong className="ontop-pass-title">
                VƯỢT LINK ➔ NHẬN LƯỢT VERIFY (1 VIEW = 1 LẦN)
              </strong>
              <small className="ontop-pass-desc">
                {isExhausted
                  ? "Đã hoàn thành 2/2 lượt OnTop hôm nay. Hệ thống chuyển sang Cổng 2 để tiếp tục cấp lượt."
                  : "Mỗi lượt vượt link mở khóa 1 lần Verify UID. Tối đa 2 lượt/ngày trên OnTop."}
              </small>
            </div>
          </div>

          <div className={`ontop-count-pill ${availableCredits > 0 ? "active" : "empty"}`}>
            {loading ? (
              "..."
            ) : (
              <>
                Số dư: <strong>{availableCredits} lượt</strong>
              </>
            )}
          </div>
        </div>

        {/* THANH 2 NẤC TIẾN ĐỘ CỔNG ONTOP */}
        <div className="ontop-steps-track">
          <div className={`ontop-step-block ${earnedCount >= 1 ? "done" : "current"}`}>
            <div className="step-num">{earnedCount >= 1 ? "✓" : "1"}</div>
            <div className="step-label">
              <strong>OnTop Lượt 1</strong>
              <small>{earnedCount >= 1 ? "Đã nhận (+1 Lượt)" : "Cần vượt link"}</small>
            </div>
          </div>

          <div className="ontop-step-connector">
            <div
              className="connector-line"
              style={{ width: earnedCount >= 1 ? "100%" : "0%" }}
            />
          </div>

          <div
            className={`ontop-step-block ${
              earnedCount >= 2 ? "done" : earnedCount === 1 ? "current" : "pending"
            }`}
          >
            <div className="step-num">{earnedCount >= 2 ? "✓" : "2"}</div>
            <div className="step-label">
              <strong>OnTop Lượt 2</strong>
              <small>
                {earnedCount >= 2 ? "Đã nhận (+1 Lượt)" : "Lượt cuối OnTop"}
              </small>
            </div>
          </div>
        </div>

        {/* THÔNG BÁO HƯỚNG DẪN KHI ĐANG CÓ SẴN LƯỢT */}
        {availableCredits > 0 && (
          <div className="ontop-credit-alert">
            <i className="fa-solid fa-circle-check" />
            <span>
              Bạn đang có <strong>{availableCredits} lượt Verify</strong> khả dụng! Hãy nhập UID và bấm nút{" "}
              <strong>VERIFY UID</strong> bên dưới.
            </span>
          </div>
        )}

        {/* NÚT BẮT ĐẦU VƯỢT LINK */}
        <div className="ontop-action-wrap">
          <button
            type="button"
            className="ontop-start-btn"
            onClick={handleStart}
            disabled={starting || loading}
          >
            {starting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                <span>ĐANG KẾT NỐI {gatewayName.toUpperCase()}...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-up-right-from-square" />
                <span>
                  {earnedCount === 0
                    ? "🚀 VƯỢT LINK CỔNG 1 (ONTOP - LƯỢT 1/2)"
                    : earnedCount === 1
                    ? "⚡ VƯỢT LINK CỔNG 1 (ONTOP - LƯỢT 2/2)"
                    : availableCredits > 0
                    ? `🔄 VƯỢT TIẾP CỔNG 2 (${gatewayName}) ĐỂ TÍCH THÊM LƯỢT`
                    : `🔄 VƯỢT LINK CỔNG 2 (${gatewayName}) ĐỂ LẤY LƯỢT`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
