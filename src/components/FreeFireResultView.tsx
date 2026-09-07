"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { verifyFreeFireKey } from "@/app/actions";

export interface FreeFireConfigProps {
  requireKey: boolean;
  getKeyUrl: string;
  keyTypeId: number | null;
  staticKey: string;
  hud2Codes: string;
  hud3Codes: string;
  hud4Codes: string;
  iosGeneralMin: number;
  iosGeneralMax: number;
  androidGeneralMin: number;
  androidGeneralMax: number;
  pcGeneralMin: number;
  pcGeneralMax: number;
  redDotMin: number;
  redDotMax: number;
  scope2xMin: number;
  scope2xMax: number;
  scope4xMin: number;
  scope4xMax: number;
  sniperMin: number;
  sniperMax: number;
  freeLookMin: number;
  freeLookMax: number;
  fireButtonMin: number;
  fireButtonMax: number;
  tipsText: string;
}

function seededHash(str: string, seedIndex: number): number {
  let hash = 0;
  const s = `${str.toLowerCase().trim()}_${seedIndex}`;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function calcInRange(min: number, max: number, device: string, idx: number): number {
  const actualMin = Math.min(min, max);
  const actualMax = Math.max(min, max);
  if (actualMin === actualMax) return actualMin;
  const hash = seededHash(device, idx);
  return actualMin + (hash % (actualMax - actualMin + 1));
}

function parseHudCodes(raw: string, fallback: string[]): string[] {
  if (!raw || !raw.trim()) return fallback;
  const items = raw
    .split(/[\r\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

export default function FreeFireResultView({
  device,
  type,
  config,
}: {
  device: string;
  type: "ios" | "android" | "pc";
  config: FreeFireConfigProps;
}) {
  const [isUnlocked, setIsUnlocked] = useState(!config.requireKey);
  const [checkingAuth, setCheckingAuth] = useState(config.requireKey);
  const [inputKey, setInputKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeHud, setActiveHud] = useState<"hud2" | "hud3" | "hud4">("hud3");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Kiểm tra trạng thái mở khóa từ localStorage khi trang load
  useEffect(() => {
    if (!config.requireKey) {
      setIsUnlocked(true);
      setCheckingAuth(false);
      return;
    }

    try {
      const savedKey = localStorage.getItem("ff_unlocked_key");
      if (savedKey) {
        // Tự động kiểm tra lại key đã lưu
        verifyFreeFireKey(savedKey).then((res) => {
          if (res.ok) {
            setIsUnlocked(true);
          } else {
            localStorage.removeItem("ff_unlocked_key");
            setIsUnlocked(false);
          }
          setCheckingAuth(false);
        });
      } else {
        setCheckingAuth(false);
      }
    } catch {
      setCheckingAuth(false);
    }
  }, [config.requireKey]);

  // Xử lý mở khóa
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (!cleanKey) {
      setKeyError("Vui lòng nhập mã Key của bạn!");
      return;
    }

    setIsVerifying(true);
    setKeyError("");

    try {
      const res = await verifyFreeFireKey(cleanKey);
      if (res.ok) {
        setIsUnlocked(true);
        try {
          localStorage.setItem("ff_unlocked_key", cleanKey);
        } catch {}
      } else {
        setKeyError(res.error || "Mã Key không chính xác hoặc đã hết hạn!");
      }
    } catch {
      setKeyError("Lỗi kết nối máy chủ, vui lòng thử lại!");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRelock = () => {
    try {
      localStorage.removeItem("ff_unlocked_key");
    } catch {}
    setIsUnlocked(false);
    setInputKey("");
    setKeyError("");
  };

  // Tính toán thông số độ nhạy
  const settings = useMemo(() => {
    const generalMin =
      type === "ios"
        ? config.iosGeneralMin
        : type === "pc"
        ? config.pcGeneralMin
        : config.androidGeneralMin;
    const generalMax =
      type === "ios"
        ? config.iosGeneralMax
        : type === "pc"
        ? config.pcGeneralMax
        : config.androidGeneralMax;

    const list = [
      {
        name: "Nhìn xung quanh",
        min: generalMin,
        max: generalMax,
        icon: "fa-solid fa-arrows-to-eye",
      },
      {
        name: "Ống ngắm hồng tâm (Red Dot)",
        min: config.redDotMin,
        max: config.redDotMax,
        icon: "fa-solid fa-bullseye",
      },
      {
        name: "Ống ngắm 2X",
        min: config.scope2xMin,
        max: config.scope2xMax,
        icon: "fa-solid fa-crosshairs",
      },
      {
        name: "Ống ngắm 4X",
        min: config.scope4xMin,
        max: config.scope4xMax,
        icon: "fa-solid fa-circle-notch",
      },
      {
        name: "Ống ngắm súng ngắm (Sniper)",
        min: config.sniperMin,
        max: config.sniperMax,
        icon: "fa-solid fa-bolt",
      },
      {
        name: "Nút camera tự do (Góc nhìn)",
        min: config.freeLookMin,
        max: config.freeLookMax,
        icon: "fa-solid fa-eye",
      },
      {
        name: "Kích thước nút bắn",
        min: config.fireButtonMin,
        max: config.fireButtonMax,
        unit: "%",
        icon: "fa-solid fa-hand-pointer",
      },
    ];

    return list.map((item, idx) => {
      const value = calcInRange(item.min, item.max, device, idx);
      const percent = item.unit === "%" ? value : Math.min(Math.round((value / 200) * 100), 100);
      return {
        name: item.name,
        value,
        unit: item.unit,
        percent,
        icon: item.icon,
      };
    });
  }, [device, type, config]);

  // Danh sách mã HUD
  const hudCodes = useMemo(() => {
    return {
      hud2: parseHudCodes(config.hud2Codes, [
        "#FFHUDT6O3jnaeTI9Po7eO",
        "#FFHUDT6O3jqljudJPo7eP",
        "#FFHUDT6O3ji+xzsRPo7eM",
      ]),
      hud3: parseHudCodes(config.hud3Codes, [
        "#FFHUDT6O3jqljudJPo7eP",
        "#FFHUDT6O3jh982BJPo7eO",
        "#FFHUDT6O3jiiaNUpPo7eO",
      ]),
      hud4: parseHudCodes(config.hud4Codes, [
        "#FFHUDT6O3jFQs9ZNPo7eN",
        "#FFHUDT6O3jwW3vlFPo7eP",
        "#FFHUDT6O3jnaeTI9Po7eO",
        "#FFHUDT6O3jiiaNUpPo7eO",
      ]),
    };
  }, [config.hud2Codes, config.hud3Codes, config.hud4Codes]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const getKeyHref = config.getKeyUrl
    ? config.getKeyUrl
    : config.keyTypeId
    ? "/getkey/freefire"
    : "#";

  if (checkingAuth) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: 36, color: "var(--vi-accent)" }} />
        <p style={{ marginTop: 14, color: "var(--vi-muted)", fontSize: 14 }}>Đang kiểm tra bảo mật...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
      {/* 1. GIAO DIỆN KHÓA KEY NẾU CHƯA MỞ KHÓA */}
      {!isUnlocked ? (
        <div className="mdarker-ff-result-card" style={{ textAlign: "center", padding: "32px 24px" }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "rgba(245, 158, 11, 0.14)",
              border: "2px solid rgba(245, 158, 11, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#f59e0b",
              fontSize: 28,
            }}
          >
            <i className="fa-solid fa-lock" />
          </div>

          <div className="mdarker-ff-result-badge" style={{ margin: "0 auto 10px" }}>
            <i className="fa-solid fa-shield-halved" />
            <span>YÊU CẦU MỞ KHÓA</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "var(--vi-text)" }}>
            Mở Khóa Độ Nhạy: <span style={{ color: "#ff6b00" }}>{device}</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--vi-muted)", margin: "0 auto 24px", maxWidth: 460, lineHeight: 1.6 }}>
            Bảng thông số độ nhạy kéo tâm và mã setting HUD cho dòng máy này đang được bảo vệ. Bạn vui lòng lấy Key miễn phí để mở khóa.
          </p>

          {/* Nút Lấy Key */}
          <div style={{ marginBottom: 24 }}>
            <a
              href={getKeyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mdarker-ff-submit-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 28px",
                fontSize: 15,
                textDecoration: "none",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(255, 107, 0, 0.35)",
              }}
            >
              <i className="fa-solid fa-key" />
              <span>LẤY KEY MIỄN PHÍ NGAY</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 12, marginLeft: 2 }} />
            </a>
          </div>

          {/* Form Nhập Key */}
          <form onSubmit={handleUnlock} style={{ maxWidth: 440, margin: "0 auto" }}>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setKeyError("");
                }}
                placeholder="Dán mã Key của bạn vào đây..."
                className="mdarker-ff-input"
                style={{
                  paddingRight: 40,
                  textAlign: "center",
                  fontSize: 15,
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--vi-muted)",
                }}
              >
                <i className="fa-solid fa-ticket" />
              </span>
            </div>

            {keyError && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: "0 0 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <i className="fa-solid fa-triangle-exclamation" />
                <span>{keyError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="mdarker-ff-autodetect-btn"
              style={{ width: "100%", padding: "12px 20px", fontSize: 15, fontWeight: 700 }}
            >
              {isVerifying ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span>Đang kiểm tra Key...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-unlock-keyhole" />
                  <span>Mở Khóa Bảng Độ Nhạy</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px dashed var(--vi-border)" }}>
            <Link
              href="/freefire"
              style={{
                color: "var(--vi-muted)",
                fontSize: 13,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i className="fa-solid fa-arrow-left" />
              <span>Quay lại tìm thiết bị khác</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 2. GIAO DIỆN KẾT QUẢ ĐỘ NHẠY KHI ĐÃ MỞ KHÓA */
        <div className="mdarker-ff-result-card">
          {/* Header kết quả */}
          <div className="mdarker-ff-result-header">
            <div className="mdarker-ff-result-badge">
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              <span>KẾT QUẢ ĐỘ NHẠY CHUẨN</span>
            </div>

            <h1 className="mdarker-ff-device-title" style={{ fontSize: 24, margin: "10px 0" }}>
              {device}
              <span className="mdarker-ff-type-pill">
                {type === "ios" ? "Hệ điều hành iOS" : type === "pc" ? "PC / Giả Lập" : "Hệ điều hành Android"}
              </span>
            </h1>

            <p className="mdarker-ff-note">
              🎯 Bảng cài đặt kéo tâm dành riêng cho máy này. Vào <b>Cài đặt Free Fire &gt; Độ nhạy</b> để chỉnh theo:
            </p>
          </div>

          {/* Bảng Sliders Độ Nhạy */}
          <div className="mdarker-ff-sliders-list">
            {settings.map((s) => (
              <div key={s.name} className="mdarker-ff-slider-item">
                <div className="mdarker-ff-slider-top">
                  <span className="mdarker-ff-slider-name">
                    <i className={`${s.icon} mdarker-ff-slider-icon`} aria-hidden="true" />
                    {s.name}
                  </span>
                  <span className="mdarker-ff-slider-val">
                    {s.value}
                    {s.unit || ""}
                  </span>
                </div>
                <div className="mdarker-ff-bar-track">
                  <div className="mdarker-ff-bar-fill" style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Thông số bổ trợ (DPI & Con trỏ) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", display: "block", marginBottom: 4 }}>
                <i className="fa-solid fa-microchip" style={{ marginRight: 6 }} />
                DPI ĐỀ XUẤT
              </span>
              <strong style={{ fontSize: 13, color: "var(--vi-text)" }}>
                {type === "ios" ? "Mặc định (120Hz)" : type === "pc" ? "800 - 1200 DPI" : "480 - 550 DPI"}
              </strong>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", display: "block", marginBottom: 4 }}>
                <i className="fa-solid fa-arrow-pointer" style={{ marginRight: 6 }} />
                TỐC ĐỘ CON TRỎ
              </span>
              <strong style={{ fontSize: 13, color: "var(--vi-text)" }}>
                {type === "ios" ? "Mức 7/10" : type === "pc" ? "Mức 6/11 Windows" : "Gần tối đa (90%)"}
              </strong>
            </div>
          </div>

          {/* Khung Mã HUD 2 - 3 - 4 Ngón */}
          <div className="mdarker-ff-hud-box">
            <div className="mdarker-ff-hud-header">
              <h4>
                <i className="fa-solid fa-gamepad" aria-hidden="true" />
                MÃ SETTING HUD NÚT BẮN
              </h4>
              <p>Chọn kiểu chơi của bạn để nhận mã nhập tự động trong game:</p>
            </div>

            <div className="mdarker-ff-hud-tabs">
              {(["hud2", "hud3", "hud4"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`mdarker-ff-hud-tab ${activeHud === k ? "active" : ""}`}
                  onClick={() => setActiveHud(k)}
                >
                  {k === "hud2" ? "HUD 2 Ngón" : k === "hud3" ? "HUD 3 Ngón" : "HUD 4 Ngón"}
                </button>
              ))}
            </div>

            <div className="mdarker-ff-hud-content">
              <p className="mdarker-ff-hud-desc">
                {activeHud === "hud2"
                  ? "Phù hợp mọi người chơi, kéo tâm cực mượt & ổn định"
                  : activeHud === "hud3"
                  ? "Thao tác đặt keo siêu tốc, nhảy bắn lả lướt"
                  : "Phong cách tuyển thủ chuyên nghiệp, phản xạ tối đa"}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {hudCodes[activeHud].map((code, idx) => (
                  <div key={code + idx} className="mdarker-ff-code-wrap">
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#ff8c00",
                        background: "rgba(255, 140, 0, 0.12)",
                        padding: "4px 8px",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mã {idx + 1}
                    </span>
                    <code className="mdarker-ff-code">{code}</code>
                    <button
                      type="button"
                      className="mdarker-ff-copy-btn"
                      onClick={() => handleCopyCode(code)}
                    >
                      <i
                        className={copiedCode === code ? "fa-solid fa-check" : "fa-solid fa-copy"}
                        aria-hidden="true"
                      />
                      <span>{copiedCode === code ? "ĐÃ COPY" : "Sao chép"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mẹo kéo tâm Full Đỏ */}
          <div className="mdarker-ff-tips">
            <h5>
              <i className="fa-solid fa-lightbulb" aria-hidden="true" />
              Mẹo Kéo Tâm Full Đỏ Cho Máy Này
            </h5>
            <ul>
              {config.tipsText ? (
                <li style={{ whiteSpace: "pre-line" }}>{config.tipsText}</li>
              ) : (
                <>
                  <li>
                    <b>Khoảng cách gần (Shotgun/MP40):</b> Vuốt nút bắn hình chữ <b>J</b> hoặc chữ <b>V</b> thật dứt khoát từ dưới lên trên.
                  </li>
                  <li>
                    <b>Khoảng cách xa (AR/Súng trường):</b> Đặt hồng tâm ngang ngực đối thủ rồi vuốt nhẹ thẳng lên đỉnh đầu để ghim tâm đỏ.
                  </li>
                  <li>
                    <b>Kích thước nút bắn:</b> Đặt đúng <b>{settings.find((s) => s.unit === "%")?.value || 45}%</b> và đặt sát mép dưới màn hình để có nhiều không gian vuốt ngón tay.
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Hàng nút bấm Hành Động */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link
              href="/freefire"
              className="mdarker-ff-reset-btn"
              style={{
                flex: "1 1 200px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <i className="fa-solid fa-rotate-left" aria-hidden="true" />
              <span>Tìm cho thiết bị khác</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="mdarker-ff-autodetect-btn"
              style={{ flex: "1 1 180px" }}
            >
              <i className={copiedLink ? "fa-solid fa-check" : "fa-solid fa-share-nodes"} aria-hidden="true" />
              <span>{copiedLink ? "Đã chép link!" : "Chia sẻ kết quả"}</span>
            </button>
          </div>

          {/* Nút khóa lại nếu admin yêu cầu Key */}
          {config.requireKey && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={handleRelock}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--vi-muted)",
                  fontSize: 12,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <i className="fa-solid fa-lock" />
                <span>Khóa lại trang kết quả</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
