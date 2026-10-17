"use client";

import { useState, useEffect } from "react";

export interface OntopStatusData {
  earnedCount: number;
  usedCount: number;
  availableCredits: number;
  currentGateway: string;
  activeGatewayName?: string;
  currentGatewayStep?: number;
  allGatewaysExhausted?: boolean;
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

  // Lấy trạng thái Pass từ backend
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
  }, [onStatusChange]);

  const earnedCount = data?.earnedCount ?? data?.count ?? 0;
  const availableCredits = data?.availableCredits ?? 0;
  const activeGatewayName = data?.activeGatewayName || (earnedCount >= 2 ? "Link4m" : "OnTop");
  const currentGatewayStep = data?.currentGatewayStep || (earnedCount < 2 ? earnedCount + 1 : (earnedCount - 2) + 1);
  const allGatewaysExhausted = Boolean(data?.allGatewaysExhausted || earnedCount >= 4);

  return (
    <div className="ontop-mini-header" id="pass-widget" aria-label="Tiến độ lượt dùng">
      <div className="ontop-mini-header-top">
        <div className="ontop-mini-tag-wrap">
          <span className="ontop-mini-icon">⚡</span>
          <div className="ontop-mini-text">
            <span className="ontop-mini-label">
              {allGatewaysExhausted
                ? "ĐÃ HOÀN THÀNH TOÀN BỘ CỔNG HÔM NAY"
                : `TIẾN ĐỘ: CỔNG ${activeGatewayName.toUpperCase()} (LƯỢT ${currentGatewayStep}/2)`}
            </span>
            <small className="ontop-mini-sub">
              {allGatewaysExhausted
                ? "Bạn đã dùng hết hạn mức 4 lượt/ngày. Vui lòng quay lại sau 00:00!"
                : "1 lượt vượt link = 1 lượt Verify UID (Tối đa 2 lượt/cổng)"}
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

      {/* THANH 2 NẤC TIẾN TRÌNH MINI */}
      <div className="ontop-mini-progress-bar">
        <div
          className={`mini-segment ${
            allGatewaysExhausted || currentGatewayStep >= 2 || (earnedCount % 2 === 1)
              ? "done"
              : "pending"
          }`}
        >
          <span>Lượt 1 {earnedCount % 2 >= 1 ? "✓" : ""}</span>
        </div>
        <div
          className={`mini-segment ${
            allGatewaysExhausted || (earnedCount > 0 && earnedCount % 2 === 0)
              ? "done"
              : "pending"
          }`}
        >
          <span>Lượt 2 {allGatewaysExhausted || (earnedCount > 0 && earnedCount % 2 === 0) ? "✓" : ""}</span>
        </div>
      </div>
    </div>
  );
}
