"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronLeft, Sparkles, Crosshair, Zap } from "lucide-react";
import FreeFireHub from "./FreeFireHub";
import FreeFireUnlockHub from "./FreeFireUnlockHub";
import type { FreeFireNoteData } from "./FreeFireAdminNote";

export default function FreeFireContainer({
  ffConfig,
}: {
  ffConfig?: (FreeFireNoteData & Record<string, unknown>) | null;
}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || searchParams.get("mode");
  const initialMode = tabParam === "unlock" ? "unlock" : tabParam === "sens" ? "sens" : "select";
  const [activeMode, setActiveMode] = useState<"select" | "sens" | "unlock">(initialMode);

  useEffect(() => {
    const p = searchParams.get("tab") || searchParams.get("mode");
    if (p === "unlock" || p === "sens") {
      setActiveMode(p);
    } else if (!p) {
      setActiveMode("select");
    }
  }, [searchParams]);

  function selectTool(mode: "select" | "sens" | "unlock") {
    setActiveMode(mode);
    try {
      const url = new URL(window.location.href);
      if (mode === "select") {
        url.searchParams.delete("tab");
        url.searchParams.delete("mode");
      } else {
        url.searchParams.set("tab", mode);
      }
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  return (
    <div className="mdarker-ff-wrapper">
      {/* 1. MÀN HÌNH CHỌN CÔNG CỤ (2 CARDS) */}
      {activeMode === "select" && (
        <div className="ff-select-hub">
          <div className="ff-select-header">
            <div className="ff-select-badge">
              <Sparkles size={14} className="text-amber-400" />
              <span>FREE FIRE PRO SUITE</span>
            </div>
            <h1 className="ff-select-title">
              CÔNG CỤ HỖ TRỢ <span className="ff-gradient-fire">FREE FIRE</span>
            </h1>
            <p className="ff-select-desc">
              Chọn dịch vụ bạn muốn sử dụng để tối ưu trải nghiệm và kỹ năng chiến đấu trong game.
            </p>
          </div>

          <div className="ff-cards-grid">
            {/* CARD 1: ĐỘ NHẠY KÉO TÂM */}
            <div
              className="ff-choice-card sens"
              onClick={() => selectTool("sens")}
              role="button"
              tabIndex={0}
            >
              <div className="ff-card-top">
                <div className="ff-card-icon-wrap sens">
                  <Crosshair size={28} />
                </div>
                <div className="ff-card-tag sens">CHUẨN HEADSHOT</div>
              </div>

              <h2 className="ff-card-title">Độ Nhạy Kéo Tâm Pro</h2>
              <p className="ff-card-desc">
                Cài đặt thông số độ nhạy, DPI và cỡ nút bắn chuẩn xác cho từng dòng máy iPhone, Android &amp; PC Giả lập.
              </p>

              <div className="ff-card-bullets">
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Tự động nhận diện thiết bị &amp; tính thông số vàng</span>
                </div>
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Cẩm nang vuốt tâm chữ J &amp; đặt vị trí nút bắn</span>
                </div>
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Chia sẻ mã HUD 2, 3, 4 ngón tay độc quyền</span>
                </div>
              </div>

              <div className="ff-card-footer">
                <button type="button" className="ff-card-btn sens">
                  <span>Mở Bảng Độ Nhạy</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* CARD 2: UNLOCK ID WHITELIST */}
            <div
              className="ff-choice-card unlock"
              onClick={() => selectTool("unlock")}
              role="button"
              tabIndex={0}
            >
              <div className="ff-card-top">
                <div className="ff-card-icon-wrap unlock">
                  <Zap size={28} />
                </div>
                <div className="ff-card-tag unlock">
                  <span>HOT • MÁY CHỦ</span>
                </div>
              </div>

              <h2 className="ff-card-title">Unlock ID Whitelist</h2>
              <p className="ff-card-desc">
                Kích hoạt whitelist UID trực tiếp lên máy chủ FF Kipas &amp; Astute, tự động đồng bộ kết nối 2 chiều.
              </p>

              <div className="ff-card-bullets">
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Máy chủ kép FF Kipas &amp; Astute ổn định 99.9%</span>
                </div>
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Đồng bộ Worker Extension xử lý tác vụ ngầm</span>
                </div>
                <div className="ff-bullet-item">
                  <span className="ff-bullet-check">✓</span>
                  <span>Kích hoạt an toàn, hỗ trợ bot Telegram phụ trợ</span>
                </div>
              </div>

              <div className="ff-card-footer">
                <button type="button" className="ff-card-btn unlock">
                  <span>Kích Hoạt Unlock ID</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. GIAO DIỆN CÔNG CỤ ĐÃ CHỌN (KÈM NÚT QUAY LẠI CHỌN) */}
      {activeMode !== "select" && (
        <div className="ff-active-tool-wrap">
          {/* THANH ĐIỀU HƯỚNG QUAY LẠI 2 CARD */}
          <div className="ff-top-nav-bar">
            <button
              type="button"
              onClick={() => selectTool("select")}
              className="ff-back-to-cards-btn"
            >
              <ChevronLeft size={16} />
              <span>← Chọn Công Cụ Khác</span>
            </button>

            <div className="ff-current-tool-pill">
              {activeMode === "sens" ? (
                <>
                  <Crosshair size={14} className="text-orange-400" />
                  <span>Độ Nhạy Kéo Tâm</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="text-amber-400" />
                  <span>Unlock ID Whitelist</span>
                </>
              )}
            </div>
          </div>

          {/* HIỂN THỊ NỘI DUNG TƯƠNG ỨNG */}
          {activeMode === "sens" ? (
            <FreeFireHub adminNote={ffConfig} />
          ) : (
            <FreeFireUnlockHub config={ffConfig} />
          )}
        </div>
      )}
    </div>
  );
}
