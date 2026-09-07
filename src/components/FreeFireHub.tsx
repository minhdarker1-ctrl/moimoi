"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FreeFireAdminNote, { FreeFireNoteData } from "./FreeFireAdminNote";

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

  // Tự nhận diện hãng thiết bị của người dùng
  const handleAutoDetect = () => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    let brand = "";

    if (/iPhone/i.test(ua)) {
      brand = "iPhone";
    } else if (/iPad/i.test(ua)) {
      brand = "iPad";
    } else if (/samsung|SM-|GT-|SCH-/i.test(ua)) {
      brand = "Samsung";
    } else if (/xiaomi|redmi|poco/i.test(ua)) {
      brand = "Xiaomi";
    } else if (/oppo|cph/i.test(ua)) {
      brand = "Oppo";
    } else if (/vivo|iqoo|v20|v21|v22|v23/i.test(ua)) {
      brand = "Vivo";
    } else if (/realme|rmx/i.test(ua)) {
      brand = "Realme";
    } else if (/huawei|honor/i.test(ua)) {
      brand = "Huawei";
    } else if (/rog|asus/i.test(ua)) {
      brand = "ROG Phone";
    } else if (/tecno|infinix/i.test(ua)) {
      brand = "Tecno";
    } else if (/windows|macintosh/i.test(ua)) {
      brand = "PC Giả Lập";
    } else if (/android/i.test(ua)) {
      brand = "Android";
    }

    if (brand) {
      setDevice(brand);
      setWarning(`✨ Đã nhận diện hãng máy của bạn: ${brand}`);
    } else {
      setWarning("Không thể tự nhận diện, bạn hãy bấm chọn nhanh hãng ở phía trên nhé!");
    }
  };

  const hasKey = Boolean(
    (adminNote?.keyTypeId && adminNote.keyTypeId > 0) ||
    (adminNote?.getKeyUrl && adminNote.getKeyUrl.trim().length > 0) ||
    (adminNote?.requireKey && (adminNote?.staticKey || adminNote?.keyTypeId || adminNote?.getKeyUrl))
  );

  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false);

  useEffect(() => {
    try {
      setAlreadyUnlocked(Boolean(localStorage.getItem("ff_unlocked_key")));
    } catch {}
  }, []);

  // Điều hướng: nếu không có key thì vào thẳng trang kết quả, có key thì phải vượt link
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = device.trim();
    if (!clean) {
      setWarning("Vui lòng nhập tên thiết bị của bạn!");
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

    try {
      localStorage.setItem("ff_pending_device", clean);
      localStorage.setItem("ff_pending_type", type);
    } catch {}

    // 1. Không có key hoặc người dùng đã mở khóa trước đó: chuyển thẳng đến trang chứa độ nhạy
    if (!hasKey || alreadyUnlocked) {
      router.push(`/freefire/result?device=${encodeURIComponent(clean)}&type=${type}`);
      return;
    }

    // 2. Có key: người dùng sẽ phải vượt link giống phần lấy key ở app other
    if (adminNote?.getKeyUrl && adminNote.getKeyUrl.trim().length > 0) {
      window.location.href = adminNote.getKeyUrl;
    } else {
      router.push(`/getkey/freefire?device=${encodeURIComponent(clean)}&type=${type}`);
    }
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
              onClick={handleAutoDetect}
              className="mdarker-ff-autodetect-btn"
            >
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
              <span>Tự nhận diện máy</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="mdarker-ff-submit-btn"
            >
              <i
                className={hasKey && !alreadyUnlocked ? "fa-solid fa-key" : "fa-solid fa-fire-flame-curved"}
                aria-hidden="true"
              />
              <span>
                {loading
                  ? "Đang xử lý..."
                  : hasKey && !alreadyUnlocked
                  ? "Vượt Link Nhận Độ Nhạy"
                  : "Lấy Độ Nhạy Ngay"}
              </span>
            </button>
          </div>

          {/* Nếu có Key và chưa mở khóa, cho phép bấm vào nhập key trực tiếp */}
          {hasKey && !alreadyUnlocked && (
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
                  padding: "4px 8px",
                  textDecoration: "underline",
                }}
              >
                <i className="fa-solid fa-unlock-keyhole" />
                <span>Đã có Key sẵn? Nhập Key để xem ngay</span>
              </button>
            </div>
          )}

          {warning && <p className="mdarker-ff-warning">{warning}</p>}
        </form>
      </div>
    </section>
  );
}
