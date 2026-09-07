"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import FreeFireAdminNote, { FreeFireNoteData } from "./FreeFireAdminNote";

interface SettingItem {
  name: string;
  min: number;
  max: number;
  unit?: string;
  icon: string;
}

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

const MODEL_MAP: Record<string, string> = {
  "SM-S928": "Samsung Galaxy S25 Ultra",
  "SM-S918": "Samsung Galaxy S24 Ultra",
  "SM-S908": "Samsung Galaxy S23 Ultra",
  "SM-A556": "Samsung Galaxy A55",
  "SM-A546": "Samsung Galaxy A54",
  "SM-A155": "Samsung Galaxy A15",
  "23049PCD8G": "Poco F5",
  "24069PC21G": "Poco F6",
  "RMX3630": "Realme C55",
  "CPH2505": "Oppo Reno 11",
};

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
  const hash = seededHash(device, idx);
  return min + (hash % (max - min + 1));
}

function detectDeviceType(name: string): "ios" | "android" | "pc" {
  const n = name.toLowerCase();
  if (n.includes("iphone") || n.includes("ipad") || n.includes("ios") || n.includes("apple")) {
    return "ios";
  }
  if (n.includes("pc") || n.includes("giả lập") || n.includes("gia lap") || n.includes("ldplayer") || n.includes("bluestack") || n.includes("memu") || n.includes("nox")) {
    return "pc";
  }
  return "android";
}

const HUD_PRESETS = {
  hud2: {
    title: "HUD 2 Ngón",
    desc: "Phù hợp mọi người chơi, kéo tâm cực mượt & ổn định",
    codes: [
      { label: "Mã 1", code: "#FFHUDT6O3jnaeTI9Po7eO" },
      { label: "Mã 2", code: "#FFHUDT6O3jqljudJPo7eP" },
      { label: "Mã 3", code: "#FFHUDT6O3ji+xzsRPo7eM" },
    ],
  },
  hud3: {
    title: "HUD 3 Ngón",
    desc: "Thao tác đặt keo siêu tốc, nhảy bắn lả lướt",
    codes: [
      { label: "Mã 1", code: "#FFHUDT6O3jqljudJPo7eP" },
      { label: "Mã 2", code: "#FFHUDT6O3jh982BJPo7eO" },
      { label: "Mã 3", code: "#FFHUDT6O3jiiaNUpPo7eO" },
    ],
  },
  hud4: {
    title: "HUD 4 Ngón",
    desc: "Phong cách tuyển thủ chuyên nghiệp, phản xạ tối đa",
    codes: [
      { label: "Mã 1", code: "#FFHUDT6O3jFQs9ZNPo7eN" },
      { label: "Mã 2", code: "#FFHUDT6O3jwW3vlFPo7eP" },
      { label: "Mã 3", code: "#FFHUDT6O3jnaeTI9Po7eO" },
      { label: "Mã 4", code: "#FFHUDT6O3jiiaNUpPo7eO" },
    ],
  },
};

export default function FreeFireHub({ adminNote }: { adminNote?: FreeFireNoteData | null } = {}) {
  const [device, setDevice] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    deviceName: string;
    deviceType: "ios" | "android" | "pc";
    settings: { name: string; value: number; unit?: string; percent: number; icon: string }[];
  } | null>(null);

  const [activeHud, setActiveHud] = useState<"hud2" | "hud3" | "hud4">("hud3");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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

  // Tính toán kết quả độ nhạy
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

    setTimeout(() => {
      const type = detectDeviceType(clean);

      const baseSettings: SettingItem[] = [
        {
          name: "Nhìn xung quanh",
          min: type === "ios" ? 85 : type === "pc" ? 80 : 110,
          max: type === "ios" ? 155 : type === "pc" ? 135 : 200,
          icon: "fa-solid fa-arrows-to-eye",
        },
        {
          name: "Ống ngắm hồng tâm (Red Dot)",
          min: 65,
          max: 95,
          icon: "fa-solid fa-bullseye",
        },
        {
          name: "Ống ngắm 2X",
          min: 65,
          max: 92,
          icon: "fa-solid fa-crosshairs",
        },
        {
          name: "Ống ngắm 4X",
          min: 60,
          max: 90,
          icon: "fa-solid fa-circle-notch",
        },
        {
          name: "Ống ngắm súng ngắm (AWM/Sniper)",
          min: 30,
          max: 48,
          icon: "fa-solid fa-bolt",
        },
        {
          name: "Nút camera tự do (Góc nhìn)",
          min: 40,
          max: 65,
          icon: "fa-solid fa-eye",
        },
        {
          name: "Kích thước nút bắn",
          min: type === "ios" ? 32 : 40,
          max: type === "ios" ? 52 : 60,
          unit: "%",
          icon: "fa-solid fa-hand-pointer",
        },
      ];

      const computed = baseSettings.map((item, idx) => {
        const value = calcInRange(item.min, item.max, clean, idx);
        const percent = item.unit === "%" ? value : Math.min(Math.round((value / 200) * 100), 100);
        return {
          name: item.name,
          value,
          unit: item.unit,
          percent,
          icon: item.icon,
        };
      });

      setResult({
        deviceName: clean,
        deviceType: type,
        settings: computed,
      });
      setLoading(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 450);
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2200);
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
              <i className="fa-solid fa-fire-flame-curved" aria-hidden="true" />
              <span>{loading ? "Đang phân tích..." : "Lấy Độ Nhạy Ngay"}</span>
            </button>
          </div>

          {warning && <p className="mdarker-ff-warning">{warning}</p>}
        </form>
      </div>

      {/* Bảng kết quả Độ Nhạy */}
      {result && (
        <div ref={resultRef} className="mdarker-ff-result-card">
          <div className="mdarker-ff-result-header">
            <div className="mdarker-ff-result-badge">
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              <span>ĐÃ TỐI ƯU CHO</span>
            </div>
            <h3 className="mdarker-ff-device-title">
              {result.deviceName}
              <span className="mdarker-ff-type-pill">
                {result.deviceType === "ios" ? "Hệ điều hành iOS" : result.deviceType === "pc" ? "PC / Giả Lập" : "Hệ điều hành Android"}
              </span>
            </h3>
            <p className="mdarker-ff-note">
              🎯 Bảng cài đặt kéo tâm dành riêng cho máy này. Vào <b>Cài đặt Free Fire &gt; Độ nhạy</b> để chỉnh theo:
            </p>
          </div>

          {/* Danh sách thông số */}
          <div className="mdarker-ff-sliders-list">
            {result.settings.map((s) => (
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
                  <div
                    className="mdarker-ff-bar-fill"
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mã HUD 2 - 3 - 4 Ngón */}
          <div className="mdarker-ff-hud-box">
            <div className="mdarker-ff-hud-header">
              <h4>
                <i className="fa-solid fa-gamepad" aria-hidden="true" />
                MÃ SETTING HUD NÚT BẮN
              </h4>
              <p>Chọn kiểu chơi của bạn để nhận mã nhập tự động trong game:</p>
            </div>

            <div className="mdarker-ff-hud-tabs">
              {(["hud2", "hud3", "hud4"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`mdarker-ff-hud-tab ${activeHud === key ? "active" : ""}`}
                  onClick={() => setActiveHud(key)}
                >
                  {HUD_PRESETS[key].title}
                </button>
              ))}
            </div>

            <div className="mdarker-ff-hud-content">
              <p className="mdarker-ff-hud-desc">{HUD_PRESETS[activeHud].desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {HUD_PRESETS[activeHud].codes.map((item, idx) => (
                  <div key={item.code + idx} className="mdarker-ff-code-wrap">
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
                      {item.label}
                    </span>
                    <code className="mdarker-ff-code">{item.code}</code>
                    <button
                      type="button"
                      className="mdarker-ff-copy-btn"
                      onClick={() => handleCopyCode(item.code)}
                    >
                      <i
                        className={copiedCode === item.code ? "fa-solid fa-check" : "fa-solid fa-copy"}
                        aria-hidden="true"
                      />
                      <span>{copiedCode === item.code ? "ĐÃ COPY" : "Sao chép"}</span>
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
              <li>
                <b>Khoảng cách gần (Shotgun/MP40):</b> Vuốt nút bắn hình chữ <b>J</b> hoặc chữ <b>V</b> thật dứt khoát từ dưới lên trên.
              </li>
              <li>
                <b>Khoảng cách xa (AR/Súng trường):</b> Đặt hồng tâm ngang ngực đối thủ rồi vuốt nhẹ thẳng lên đỉnh đầu để ghim tâm đỏ.
              </li>
              <li>
                <b>Kích thước nút bắn:</b> Đặt đúng <b>{result.settings.find((s) => s.unit === "%")?.value || 45}%</b> và đặt sát mép dưới màn hình để có nhiều không gian vuốt ngón tay.
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setResult(null);
              setDevice("");
            }}
            className="mdarker-ff-reset-btn"
          >
            <i className="fa-solid fa-rotate-left" aria-hidden="true" />
            <span>Tìm độ nhạy cho thiết bị khác</span>
          </button>
        </div>
      )}
    </section>
  );
}
