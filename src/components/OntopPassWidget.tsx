"use client";

import { useState, useEffect } from "react";

export interface OntopStatusData {
  count: number;
  target: number;
  isUnlimited: boolean;
  date?: string;
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
        console.error("Lỗi lấy trạng thái OnTop:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();

    // Kiểm tra query param sau khi OnTop callback về
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("ontop") === "success") {
        const step = parseInt(sp.get("step") || "1", 10);
        const unlimited = sp.get("unlimited") === "1" || step >= 2;

        if (unlimited) {
          setToastType("gold");
          setToastMsg(
            "👑 CHÚC MỪNG: Bạn đã vượt đủ 2 lượt liên tục! Quyền sử dụng VÔ HẠN hôm nay đã được kích hoạt!"
          );
        } else {
          setToastType("success");
          setToastMsg(
            `🎉 Đã hoàn thành lượt 1/2! Hãy vượt tiếp lượt 2 để mở khóa quyền DÙNG VÔ HẠN cả ngày hôm nay.`
          );
        }

        // Dọn sạch URL param để tránh hiện lại khi F5
        try {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("ontop");
          cleanUrl.searchParams.delete("step");
          cleanUrl.searchParams.delete("unlimited");
          window.history.replaceState({}, "", cleanUrl.toString());
        } catch {}

        setTimeout(() => setToastMsg(""), 8000);
      }
    }
  }, [onStatusChange]);

  // Xử lý bấm nút bắt đầu vượt OnTop
  async function handleStart() {
    setStarting(true);
    try {
      const res = await fetch("/api/ontop/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service }),
      });

      const json = await res.json();

      if (json.success) {
        if (json.alreadyUnlimited) {
          alert("Bạn đã mở khóa chế độ VÔ HẠN hôm nay rồi!");
          setStarting(false);
          return;
        }
        if (json.redirectUrl) {
          window.location.href = json.redirectUrl;
          return;
        }
      }

      alert(json.error || "Không thể tạo liên kết OnTop. Vui lòng thử lại!");
      setStarting(false);
    } catch {
      alert("Lỗi kết nối tới máy chủ OnTop. Vui lòng kiểm tra lại mạng!");
      setStarting(false);
    }
  }

  const count = data?.count || 0;
  const isUnlimited = Boolean(data?.isUnlimited) || count >= 2;

  return (
    <div className="ontop-widget-container" aria-label="Thẻ Vô Hạn OnTop.link">
      {/* THÔNG BÁO TOAST NỔI BẬT NẾU VỪA VƯỢT VỀ */}
      {toastMsg && (
        <div className={`ontop-toast-banner ${toastType}`} role="alert">
          <i
            className={`fa-solid ${
              toastType === "gold" ? "fa-crown fa-beat-fade" : "fa-circle-check"
            }`}
          />
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

      {/* 1. TRẠNG THÁI ĐÃ CÓ VÔ HẠN */}
      {isUnlimited ? (
        <div className="ontop-vip-card">
          <div className="ontop-vip-top">
            <div className="ontop-vip-badge">
              <span className="ontop-crown">👑</span>
              <span className="ontop-vip-tag">CHẾ ĐỘ VÔ HẠN · ĐANG BẬT</span>
            </div>
            <span className="ontop-status-live">● Có hiệu lực cả ngày</span>
          </div>

          <h3 className="ontop-vip-heading">
            {service === "freefire"
              ? "UNLOCK ID KHÔNG GIỚI HẠN"
              : "BUFF LOCKET GOLD KHÔNG GIỚI HẠN"}
          </h3>

          <p className="ontop-vip-sub">
            Bạn đã hoàn thành <strong>2/2 lượt vượt link OnTop.link</strong> hôm nay.
            Toàn bộ giới hạn đã được gỡ bỏ cho đến hết 23:59:59 đêm nay!
          </p>
        </div>
      ) : (
        /* 2. TRẠNG THÁI TIẾN ĐỘ 0/2 HOẶC 1/2 */
        <div className="ontop-pass-card">
          <div className="ontop-pass-header">
            <div className="ontop-pass-title-wrap">
              <span className="ontop-bolt-icon">⚡</span>
              <div>
                <strong className="ontop-pass-title">
                  VƯỢT ONTOP.LINK ➔ DÙNG VÔ HẠN HÔM NAY
                </strong>
                <small className="ontop-pass-desc">
                  Vượt 2 lần liên tục trong ngày để mở khóa sử dụng không giới hạn
                </small>
              </div>
            </div>

            <div className="ontop-count-pill">
              Tiến độ: <strong>{loading ? "..." : `${count}/2 lượt`}</strong>
            </div>
          </div>

          {/* THANH 2 NẤC TIẾN TRÌNH */}
          <div className="ontop-steps-track">
            <div
              className={`ontop-step-block ${
                count >= 1 ? "done" : "current"
              }`}
            >
              <div className="step-num">{count >= 1 ? "✓" : "1"}</div>
              <div className="step-label">
                <strong>Lượt 1</strong>
                <small>{count >= 1 ? "Đã hoàn tất" : "Cần vượt link"}</small>
              </div>
            </div>

            <div className="ontop-step-connector">
              <div
                className="connector-line"
                style={{ width: count >= 1 ? "100%" : "0%" }}
              />
            </div>

            <div
              className={`ontop-step-block ${
                count >= 2 ? "done" : count === 1 ? "current" : "pending"
              }`}
            >
              <div className="step-num">{count >= 2 ? "✓" : "2"}</div>
              <div className="step-label">
                <strong>Lượt 2</strong>
                <small>
                  {count >= 2 ? "Đã kích hoạt" : "Mở khóa Vô Hạn 👑"}
                </small>
              </div>
            </div>
          </div>

          {/* NÚT BẮT ĐẦU VƯỢT ONTOP */}
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
                  <span>ĐANG KẾT NỐI ONTOP.LINK...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  <span>
                    {count === 0
                      ? "🚀 VƯỢT LINK ONTOP.LINK (LƯỢT 1/2)"
                      : "⚡ VƯỢT LINK ONTOP.LINK (LƯỢT 2/2) ĐỂ MỞ VÔ HẠN"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
