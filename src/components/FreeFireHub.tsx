"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FreeFireAdminNote, { FreeFireNoteData } from "./FreeFireAdminNote";
import { detectAccurateDevice } from "@/lib/device-detector";
import { performSecurityAudit } from "@/lib/anti-bot-engine";

const BRAND_TAGS = [
  "iPhone",
  "iPad",
  "Samsung",
  "Xiaomi",
  "Poco",
  "Realme",
  "Oppo",
  "Vivo",
  "iQOO",
  "ROG Phone",
  "Huawei",
  "PC Giả Lập",
];

const VALID_DEVICES = [
  "iPhone 6", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus",
  "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13", "iPhone 13 Mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 16e",
  "iPad", "iPad Mini", "iPad Air", "iPad Pro",
  "Samsung S20", "Samsung S21", "Samsung S22", "Samsung S23 Ultra", "Samsung S24 Ultra", "Samsung S25 Ultra",
  "Samsung A05", "Samsung A15", "Samsung A25", "Samsung A35", "Samsung A55",
  "Samsung Note 20 Ultra", "Samsung Z Fold", "Samsung Z Flip",
  "Xiaomi Redmi Note 11", "Xiaomi Redmi Note 12", "Xiaomi Redmi Note 13", "Xiaomi 13", "Xiaomi 14",
  "Poco X5", "Poco X6", "Poco F5", "Poco F6", "Poco M5",
  "Realme C55", "Realme 11", "Realme 12", "Realme GT Neo 3",
  "Oppo Reno 10", "Oppo Reno 11", "Oppo A58", "Oppo A78", "Oppo Find X6",
  "Vivo Y36", "Vivo V27", "Vivo V29", "Vivo X100",
  "iQOO Neo 7", "iQOO Neo 8", "iQOO 11", "iQOO 12",
  "ROG Phone 6", "ROG Phone 7", "ROG Phone 8",
  "Tecno Spark 20", "Tecno Pova 6",
  "PC Giả Lập", "LDPlayer", "BlueStacks", "NoxPlayer",
];

const KEYPAD_BLACKLIST = [
  "1280", "1202", "1110", "105", "110", "215", "225", "3310", "6300",
  "bàn phím", "ban phim", "cục gạch", "cuc gach", "nokia 360", "360",
];

const VALID_BRANDS = [
  "iphone", "ipad", "samsung", "galaxy", "xiaomi", "redmi", "poco",
  "realme", "oppo", "vivo", "iqoo", "huawei", "honor", "lg", "rog",
  "asus", "sony", "google", "pixel", "tecno", "sharp", "oneplus",
  "pc", "giả lập", "gia lap", "ldplayer", "bluestack", "memu", "nox",
];

function detectDeviceType(name: string): "ios" | "android" | "pc" {
  const n = name.toLowerCase();
  if (n.includes("iphone") || n.includes("ipad") || n.includes("ios") || n.includes("apple")) {
    return "ios";
  }
  if (
    n.includes("pc") ||
    n.includes("giả lập") ||
    n.includes("gia lap") ||
    n.includes("ldplayer") ||
    n.includes("bluestack") ||
    n.includes("memu") ||
    n.includes("nox")
  ) {
    return "pc";
  }
  return "android";
}

export default function FreeFireHub({ adminNote }: { adminNote?: FreeFireNoteData | null } = {}) {
  const router = useRouter();
  const [device, setDevice] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [verifiedData, setVerifiedData] = useState<{
    deviceName: string;
    gpu: string;
    isEmulator: boolean;
    passed: boolean;
  } | null>(null);

  // Khôi phục trạng thái đã xác minh trước đó nếu còn trong phiên
  useEffect(() => {
    try {
      const savedToken = sessionStorage.getItem("ff_anti_bot_token");
      const savedDevice = sessionStorage.getItem("ff_verified_device");
      const savedGpu = sessionStorage.getItem("ff_verified_gpu");
      if (savedToken && savedDevice) {
        setVerifiedToken(savedToken);
        setVerifiedData({
          deviceName: savedDevice,
          gpu: savedGpu || "",
          isEmulator: false,
          passed: true,
        });
      }
    } catch {}
  }, []);

  // Autocomplete
  const handleInputChange = (val: string) => {
    setDevice(val);
    setWarning("");
    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const matches = VALID_DEVICES.filter((d) => d.toLowerCase().includes(q)).slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectDevice = (d: string) => {
    setDevice(d);
    setShowSuggestions(false);
    setWarning("");
  };

  // Nâng cấp: Tự nhận diện chính xác máy & Chạy kiểm tra xác minh thiết bị (Anti-Bot / Giả Lập)
  const handleVerifyAndAutoDetect = async (e?: React.MouseEvent): Promise<string | null> => {
    if (e && !e.isTrusted) {
      alert("Phát hiện thao tác tự động không hợp lệ!");
      return null;
    }

    setIsVerifying(true);
    setWarning("");

    try {
      // 1. Quét sâu phần cứng nhận diện chuẩn xác dòng máy & GPU
      const detected = await detectAccurateDevice();

      // 2. Chạy kiểm tra bảo mật & chống giả lập (CreepJS & WebGL Mismatch)
      const audit = performSecurityAudit();

      // Hiệu ứng quét mô phỏng ~750ms để người dùng thấy rõ tiến trình quét phần cứng
      await new Promise((r) => setTimeout(r, 750));

      let vid = "";
      try {
        vid = localStorage.getItem("moimoi_visitor_id") || "";
        if (!vid && typeof crypto !== "undefined" && crypto.randomUUID) {
          vid = crypto.randomUUID();
          localStorage.setItem("moimoi_visitor_id", vid);
        }
      } catch {}

      // 3. Gửi lên server xác minh và ký token
      const res = await fetch("/api/anti-bot/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanResult: audit,
          visitorId: vid,
          deviceInput: detected.deviceName,
          deviceType: detected.deviceType,
          scope: "freefire",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.blocked) {
        setVerifiedData({
          deviceName: detected.deviceName,
          gpu: detected.gpu,
          isEmulator: detected.isEmulator || Boolean(data.isEmulator),
          passed: false,
        });
        setDevice(detected.deviceName);
        setWarning(
          `⛔ BẢO VỆ HỆ THỐNG: ${
            data.message ||
            "Phát hiện giả lập Android trên máy tính! Hệ thống yêu cầu dùng điện thoại thật để lấy mã độ nhạy."
          }`
        );
        return null;
      }

      // Xác minh thành công
      const token = data.antiBotToken || "";
      setVerifiedToken(token);
      setVerifiedData({
        deviceName: detected.deviceName,
        gpu: detected.gpu,
        isEmulator: false,
        passed: true,
      });

      setDevice(detected.deviceName);
      try {
        sessionStorage.setItem("ff_anti_bot_token", token);
        sessionStorage.setItem("ff_verified_device", detected.deviceName);
        sessionStorage.setItem("ff_verified_gpu", detected.gpu);
      } catch {}

      return token;
    } catch (err: any) {
      console.error("Lỗi xác minh thiết bị:", err);
      setWarning("Không thể kết nối máy chủ xác minh. Vui lòng thử lại!");
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const hasKey = Boolean(
    (adminNote?.keyTypeId && adminNote.keyTypeId > 0) ||
    (adminNote?.getKeyUrl && adminNote.getKeyUrl.trim().length > 0) ||
    (adminNote?.requireKey && (adminNote?.staticKey || adminNote?.keyTypeId || adminNote?.getKeyUrl))
  );

  // Điều hướng: nếu không có key thì vào thẳng trang kết quả, có key thì chuyển đến vượt link lấy key
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = device.trim();
    if (!clean) {
      setWarning("Vui lòng nhập tên thiết bị hoặc bấm nút Nhận diện & Xác minh máy!");
      return;
    }

    const lower = clean.toLowerCase();
    if (KEYPAD_BLACKLIST.some((k) => lower.includes(k))) {
      setWarning("⚠️ Máy bàn phím/cục gạch không thể chơi Free Fire. Vui lòng nhập smartphone hoặc PC!");
      return;
    }

    const isBrandValid = VALID_BRANDS.some((b) => lower.includes(b));
    if (!isBrandValid && clean.length < 3) {
      setWarning("⚠️ Vui lòng nhập đúng tên hãng điện thoại (iPhone, Samsung, Xiaomi, Oppo...)");
      return;
    }

    setLoading(true);
    setWarning("");

    const type = detectDeviceType(clean);

    let vid = "";
    try {
      vid = localStorage.getItem("moimoi_visitor_id") || "";
      if (!vid && typeof crypto !== "undefined" && crypto.randomUUID) {
        vid = crypto.randomUUID();
        localStorage.setItem("moimoi_visitor_id", vid);
      }
      localStorage.setItem("ff_pending_device", clean);
      localStorage.setItem("ff_pending_type", type);
    } catch {}

    // 1. Không có key: chuyển thẳng đến trang chứa độ nhạy
    if (!hasKey) {
      router.push(`/freefire/result?device=${encodeURIComponent(clean)}&type=${type}`);
      return;
    }

    // 2. Có key: kiểm tra xem đã xác minh thiết bị chưa
    let token = verifiedToken;
    if (!token) {
      try {
        token = sessionStorage.getItem("ff_anti_bot_token");
      } catch {}
    }

    // Nếu chưa xác minh qua nút, chạy xác minh tự động ngay tại đây
    if (!token) {
      token = await handleVerifyAndAutoDetect();
      if (!token) {
        setLoading(false);
        return; // Bị chặn hoặc lỗi xác minh
      }
    }

    // Chuyển đến vượt link lấy key qua cổng getkey Free Fire kèm token đã xác minh
    router.push(
      `/getkey/freefire?device=${encodeURIComponent(clean)}&type=${type}&vid=${encodeURIComponent(
        vid
      )}&botToken=${encodeURIComponent(token)}`
    );
  };

  return (
    <section className="mdarker-ff-hub" aria-label="Bộ công cụ Free Fire Pro">
      {/* Banner ngọn lửa Free Fire */}
      <div className="mdarker-ff-header">
        <div className="mdarker-ff-badge-wrap">
          <span className="mdarker-ff-badge">
            <i className="fa-solid fa-fire mdarker-flame-icon" aria-hidden="true" />
            FREE FIRE PRO SETTINGS
          </span>
        </div>
        <h2 className="mdarker-ff-title">
          ĐỘ NHẠY KÉO TÂM <span>FULL ĐỎ</span>
        </h2>
        <p className="mdarker-ff-desc">
          Bộ phân tích thông số độ nhạy & mã HUD chuẩn xác theo từng dòng máy (iOS, Android & PC)
        </p>
      </div>

      {/* Phần chú thích / hướng dẫn từ Admin (nếu có) */}
      <FreeFireAdminNote note={adminNote} />

      {/* Form tra cứu thiết bị */}
      <div className="mdarker-ff-card">
        {/* Nhanh chóng chọn hãng */}
        <div className="mdarker-ff-tags">
          {BRAND_TAGS.map((brand) => (
            <button
              key={brand}
              type="button"
              className="mdarker-ff-tag-btn"
              onClick={() => handleSelectDevice(brand)}
            >
              {brand}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mdarker-ff-form">
          <div className="mdarker-ff-input-wrap">
            <span className="mdarker-ff-input-icon">
              <i className="fa-solid fa-mobile-screen-button" aria-hidden="true" />
            </span>
            <input
              type="text"
              className="mdarker-ff-input"
              value={device}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => device.length >= 2 && setShowSuggestions(true)}
              placeholder="Nhập dòng máy của bạn (Ví dụ: iPhone 13, Samsung S24...)"
              autoComplete="off"
            />
            {device && (
              <button
                type="button"
                className="mdarker-ff-clear-btn"
                onClick={() => {
                  setDevice("");
                  setShowSuggestions(false);
                }}
                aria-label="Xoá tên máy"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            )}

            {/* Suggestions Box */}
            {showSuggestions && (
              <ul className="mdarker-ff-suggestions">
                {suggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="mdarker-ff-sug-item"
                      onClick={() => handleSelectDevice(item)}
                    >
                      <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mdarker-ff-actions">
            <button
              type="button"
              onClick={(e) => handleVerifyAndAutoDetect(e)}
              disabled={isVerifying}
              className={`mdarker-ff-autodetect-btn ${isVerifying ? "scanning" : ""}`}
              style={{
                border: verifiedData?.passed
                  ? "1px solid rgba(16, 185, 129, 0.6)"
                  : verifiedData && !verifiedData.passed
                  ? "1px solid rgba(239, 68, 68, 0.6)"
                  : undefined,
                background: verifiedData?.passed
                  ? "rgba(16, 185, 129, 0.12)"
                  : verifiedData && !verifiedData.passed
                  ? "rgba(239, 68, 68, 0.12)"
                  : undefined,
                color: verifiedData?.passed
                  ? "#10b981"
                  : verifiedData && !verifiedData.passed
                  ? "#ef4444"
                  : undefined,
              }}
              title="Quét chữ ký WebGL, kiểm tra chống giả lập và tự động nhận diện chính xác cấu hình máy"
            >
              {isVerifying ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span>Đang quét phần cứng & xác minh...</span>
                </>
              ) : verifiedData?.passed ? (
                <>
                  <i className="fa-solid fa-circle-check" />
                  <span>Đã xác minh: {verifiedData.deviceName}</span>
                </>
              ) : verifiedData && !verifiedData.passed ? (
                <>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span>Phát hiện Giả lập / Bị Chặn</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-microchip" />
                  <span>Tự nhận diện & Xác minh máy</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={loading || isVerifying || Boolean(verifiedData && !verifiedData.passed)}
              className="mdarker-ff-submit-btn"
            >
              <i
                className={hasKey ? "fa-solid fa-key" : "fa-solid fa-fire-flame-curved"}
                aria-hidden="true"
              />
              <span>
                {loading
                  ? "Đang xử lý..."
                  : hasKey
                  ? "Vượt Link Nhận Key"
                  : "Lấy Độ Nhạy Ngay"}
              </span>
            </button>
          </div>

          {/* Hộp thông tin thiết bị đã quét & xác minh */}
          {verifiedData && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 12.5,
                lineHeight: 1.5,
                background: verifiedData.passed
                  ? "rgba(16, 185, 129, 0.08)"
                  : "rgba(239, 68, 68, 0.08)",
                border: verifiedData.passed
                  ? "1px solid rgba(16, 185, 129, 0.25)"
                  : "1px solid rgba(239, 68, 68, 0.25)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, color: verifiedData.passed ? "#10b981" : "#ef4444" }}>
                  <i
                    className={verifiedData.passed ? "fa-solid fa-shield-check" : "fa-solid fa-ban"}
                    style={{ marginRight: 5 }}
                  />
                  {verifiedData.passed ? "Thiết bị hợp lệ" : "Không đủ điều kiện"}:
                </span>
                <span style={{ color: "var(--vi-text)", fontWeight: 600 }}>{verifiedData.deviceName}</span>
                {verifiedData.gpu && (
                  <span style={{ color: "var(--vi-muted)", fontSize: 11.5 }}>
                    (GPU: {verifiedData.gpu})
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontWeight: 700,
                  background: verifiedData.passed ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                  color: verifiedData.passed ? "#10b981" : "#ef4444",
                }}
              >
                {verifiedData.passed ? "ĐÃ XÁC MINH" : "BỊ CHẶN GIẢ LẬP"}
              </span>
            </div>
          )}

          {/* Nếu có Key, cho phép bấm vào nhập key trực tiếp nếu đã có key sẵn */}
          {hasKey && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  const targetDevice = device.trim() || "Điện thoại";
                  const targetType = detectDeviceType(targetDevice);
                  router.push(`/freefire/result?device=${encodeURIComponent(targetDevice)}&type=${targetType}`);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--vi-muted)",
                  fontSize: 13,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <i className="fa-solid fa-unlock-keyhole" />
                <span>Đã có mã Key sẵn? Nhập Key để xem ngay</span>
              </button>
            </div>
          )}

          {warning && <p className="mdarker-ff-warning">{warning}</p>}
        </form>
      </div>
    </section>
  );
}
