import { getWebGLInfo } from "./anti-bot-engine";

export interface DetectedDevice {
  deviceName: string;
  deviceType: "Mobile" | "Desktop" | "Tablet";
  brand: string;
  gpu: string;
  isEmulator: boolean;
  emulatorReason?: string;
}

/** Rút gọn và làm sạch tên chip GPU hiển thị thân thiện */
export function cleanGpuName(renderer: string): string {
  if (!renderer || renderer === "NO_WEBGL" || renderer === "ERROR") return "Chuẩn WebGL";
  if (/apple/i.test(renderer)) {
    const m = renderer.match(/Apple\s+([^,)]+)/i);
    return m ? `Apple ${m[1].trim()}` : "Apple GPU";
  }
  if (/adreno/i.test(renderer)) {
    const m = renderer.match(/Adreno\s*(?:\(TM\))?\s*([0-9]+)/i);
    return m ? `Qualcomm Adreno ${m[1]}` : "Qualcomm Adreno GPU";
  }
  if (/mali/i.test(renderer)) {
    const m = renderer.match(/Mali-?([A-Za-z0-9_-]+)/i);
    return m ? `ARM Mali-${m[1]}` : "ARM Mali GPU";
  }
  if (/geforce|nvidia/i.test(renderer)) {
    const m = renderer.match(/(?:GeForce\s+)?(RTX\s*[0-9]+[A-Za-z]*|GTX\s*[0-9]+[A-Za-z]*)/i);
    return m ? `NVIDIA ${m[1]}` : "NVIDIA GeForce GPU";
  }
  if (/radeon|amd/i.test(renderer)) {
    const m = renderer.match(/Radeon\s+([A-Za-z0-9\s]+)/i);
    return m ? `AMD Radeon ${m[1].trim()}` : "AMD Radeon GPU";
  }
  if (/intel/i.test(renderer)) {
    const m = renderer.match(/Intel\s*(?:\(R\))?\s*([^,()]+)/i);
    return m ? `Intel ${m[1].trim()}` : "Intel Graphics";
  }
  return renderer.slice(0, 40);
}

/** Nhận diện chính xác tên máy iPhone qua kích thước màn hình & pixel ratio */
function detectIPhoneModel(w: number, h: number, pr: number): string {
  const minDim = Math.min(w, h);
  const maxDim = Math.max(w, h);

  // iPhone 14/15/16 Pro Max, 14/15 Plus (430 x 932 @ 3x)
  if (minDim === 430 && maxDim === 932 && pr >= 3) {
    return "iPhone 15 Pro Max";
  }
  // iPhone 16 Pro (402 x 874 @ 3x)
  if (minDim === 402 && maxDim === 874 && pr >= 3) {
    return "iPhone 16 Pro";
  }
  // iPhone 14 Pro, 15, 15 Pro, 16 (393 x 852 @ 3x)
  if (minDim === 393 && maxDim === 852 && pr >= 3) {
    return "iPhone 15 Pro";
  }
  // iPhone 12/13 Pro Max, 14 Plus (428 x 926 @ 3x)
  if (minDim === 428 && maxDim === 926 && pr >= 3) {
    return "iPhone 13 Pro Max";
  }
  // iPhone 12, 12 Pro, 13, 13 Pro, 14 (390 x 844 @ 3x)
  if (minDim === 390 && maxDim === 844 && pr >= 3) {
    return "iPhone 13 Pro";
  }
  // iPhone 11 Pro Max, XS Max (414 x 896 @ 3x)
  if (minDim === 414 && maxDim === 896 && pr >= 3) {
    return "iPhone 11 Pro Max";
  }
  // iPhone 11, XR (414 x 896 @ 2x)
  if (minDim === 414 && maxDim === 896 && pr < 3) {
    return "iPhone 11";
  }
  // iPhone X, XS, 11 Pro, 12 mini, 13 mini (375 x 812 @ 3x)
  if (minDim === 375 && maxDim === 812 && pr >= 3) {
    return "iPhone 11 Pro";
  }
  // iPhone 6/7/8 Plus (414 x 736 @ 3x)
  if (minDim === 414 && maxDim === 736 && pr >= 3) {
    return "iPhone 8 Plus";
  }
  // iPhone SE 2/3, 6/7/8 (375 x 667 @ 2x)
  if (minDim === 375 && maxDim === 667 && pr >= 2) {
    return "iPhone SE (Gen 3)";
  }

  return "iPhone (iOS)";
}

/** Nhận diện máy tính bảng iPad */
function detectIPadModel(w: number, h: number): string {
  const maxDim = Math.max(w, h);
  if (maxDim >= 1366) return "iPad Pro 12.9\"";
  if (maxDim >= 1194) return "iPad Pro 11\"";
  if (maxDim >= 1180) return "iPad Air";
  if (maxDim >= 1133) return "iPad Mini";
  return "iPad";
}

/** Bảng tra cứu mã model Android sang tên thương mại */
const ANDROID_MODEL_MAP: Record<string, string> = {
  // Samsung Galaxy S
  "SM-S928": "Samsung Galaxy S24 Ultra",
  "SM-S926": "Samsung Galaxy S24+",
  "SM-S921": "Samsung Galaxy S24",
  "SM-S918": "Samsung Galaxy S23 Ultra",
  "SM-S916": "Samsung Galaxy S23+",
  "SM-S911": "Samsung Galaxy S23",
  "SM-S908": "Samsung Galaxy S22 Ultra",
  "SM-S906": "Samsung Galaxy S22+",
  "SM-S901": "Samsung Galaxy S22",
  "SM-G998": "Samsung Galaxy S21 Ultra",
  "SM-G996": "Samsung Galaxy S21+",
  "SM-G991": "Samsung Galaxy S21",
  "SM-G988": "Samsung Galaxy S20 Ultra",
  "SM-G985": "Samsung Galaxy S20+",
  "SM-G980": "Samsung Galaxy S20",
  "SM-G975": "Samsung Galaxy S10+",
  "SM-G973": "Samsung Galaxy S10",
  "SM-G970": "Samsung Galaxy S10e",
  "SM-N986": "Samsung Galaxy Note 20 Ultra",
  "SM-N981": "Samsung Galaxy Note 20",
  "SM-N975": "Samsung Galaxy Note 10+",
  "SM-N970": "Samsung Galaxy Note 10",
  "SM-F946": "Samsung Galaxy Z Fold 5",
  "SM-F731": "Samsung Galaxy Z Flip 5",
  "SM-F936": "Samsung Galaxy Z Fold 4",
  "SM-F721": "Samsung Galaxy Z Flip 4",
  "SM-A546": "Samsung Galaxy A54 5G",
  "SM-A536": "Samsung Galaxy A53 5G",
  "SM-A528": "Samsung Galaxy A52s 5G",
  "SM-A525": "Samsung Galaxy A52",
  "SM-A346": "Samsung Galaxy A34 5G",
  "SM-A336": "Samsung Galaxy A33 5G",
  "SM-A245": "Samsung Galaxy A24",
  "SM-A156": "Samsung Galaxy A15 5G",
  "SM-A155": "Samsung Galaxy A15",
  "SM-A145": "Samsung Galaxy A14",
  "SM-A057": "Samsung Galaxy A05s",
  "SM-A055": "Samsung Galaxy A05",

  // Xiaomi / Redmi / POCO
  "23127PN0CG": "Xiaomi 14",
  "2304FPN6DC": "Xiaomi 13 Ultra",
  "2210132G": "Xiaomi 13 Pro",
  "2211133G": "Xiaomi 13",
  "22081212UG": "Xiaomi 12T Pro",
  "23049PCD8G": "POCO F5",
  "23013PC75G": "POCO X5 Pro 5G",
  "M2102J20SG": "POCO X3 Pro",
  "2312DRA50G": "Redmi Note 13 Pro",
  "23117RA68G": "Redmi Note 13",
  "22101316G": "Redmi Note 12 Pro",
  "23021RAAEG": "Redmi Note 12",
  "2201117TY": "Redmi Note 11",

  // ASUS ROG Phone
  "ASUS_AI2401": "ROG Phone 8 Pro",
  "ASUS_AI2205": "ROG Phone 7 Ultimate",
  "ASUS_AI2201": "ROG Phone 6",
  "ASUS_I005D": "ROG Phone 5",
  "ASUS_I003D": "ROG Phone 3",

  // Nubia Red Magic
  "NX769J": "Red Magic 9 Pro",
  "NX729J": "Red Magic 8 Pro",
  "NX709J": "Red Magic 7 Pro",
  "NX669J": "Red Magic 6 Pro",
};

/** Nhận diện máy Android qua chuỗi User-Agent */
function detectAndroidModel(ua: string): { modelName: string; brand: string } {
  // 1. Kiểm tra bảng mã model
  for (const [code, name] of Object.entries(ANDROID_MODEL_MAP)) {
    if (ua.includes(code)) {
      let brand = "Android";
      if (name.startsWith("Samsung")) brand = "Samsung";
      else if (name.startsWith("Xiaomi") || name.startsWith("Redmi") || name.startsWith("POCO")) brand = "Xiaomi";
      else if (name.startsWith("ROG")) brand = "ROG Phone";
      else if (name.startsWith("Red Magic")) brand = "Red Magic";
      return { modelName: name, brand };
    }
  }

  // 2. Tìm model từ chuỗi Android trong User Agent: ví dụ '; Android 13; 2210132G Build/...'
  const match = ua.match(/;\s+Android[^;)]*;\s+([^;)]+?)\s+(?:Build\/|AppleWebKit|\)|;)/i);
  if (match && match[1]) {
    let raw = match[1].trim();
    // Bỏ qua các chuỗi generic
    if (!/^(wv|mobile|k|arm|linux)$/i.test(raw) && raw.length > 2 && raw.length < 35) {
      if (/redmi/i.test(raw)) return { modelName: raw, brand: "Xiaomi" };
      if (/poco/i.test(raw)) return { modelName: raw, brand: "Xiaomi" };
      if (/xiaomi/i.test(raw)) return { modelName: raw, brand: "Xiaomi" };
      if (/galaxy|sm-/i.test(raw)) return { modelName: raw.startsWith("Samsung") ? raw : `Samsung ${raw}`, brand: "Samsung" };
      if (/cph/i.test(raw) || /oppo/i.test(raw)) return { modelName: raw.startsWith("OPPO") ? raw : `OPPO ${raw}`, brand: "Oppo" };
      if (/rmx/i.test(raw) || /realme/i.test(raw)) return { modelName: raw.startsWith("Realme") ? raw : `Realme ${raw}`, brand: "Realme" };
      if (/v2[0-9]{3}/i.test(raw) || /vivo/i.test(raw)) return { modelName: raw.startsWith("Vivo") ? raw : `Vivo ${raw}`, brand: "Vivo" };
      if (/pixel/i.test(raw)) return { modelName: raw.startsWith("Google") ? raw : `Google ${raw}`, brand: "Google Pixel" };
      if (/rog/i.test(raw) || /asus/i.test(raw)) return { modelName: raw, brand: "ROG Phone" };
      if (/infinix/i.test(raw)) return { modelName: raw, brand: "Infinix" };
      if (/tecno/i.test(raw)) return { modelName: raw, brand: "Tecno" };
      return { modelName: raw, brand: "Android" };
    }
  }

  // 3. Fallback theo các hãng phổ biến
  if (/samsung/i.test(ua)) return { modelName: "Samsung Galaxy", brand: "Samsung" };
  if (/xiaomi|redmi|poco/i.test(ua)) return { modelName: "Xiaomi Redmi", brand: "Xiaomi" };
  if (/oppo/i.test(ua)) return { modelName: "OPPO Reno", brand: "Oppo" };
  if (/vivo/i.test(ua)) return { modelName: "Vivo Smartphone", brand: "Vivo" };
  if (/realme/i.test(ua)) return { modelName: "Realme GT", brand: "Realme" };
  if (/huawei/i.test(ua)) return { modelName: "Huawei Smartphone", brand: "Huawei" };
  if (/rog|asus/i.test(ua)) return { modelName: "ROG Phone", brand: "ROG Phone" };

  return { modelName: "Điện thoại Android", brand: "Android" };
}

/**
 * Thuật toán nhận diện phần cứng & thiết bị toàn diện (Deep Device & Hardware Detection)
 */
export async function detectAccurateDevice(): Promise<DetectedDevice> {
  if (typeof window === "undefined") {
    return {
      deviceName: "Thiết bị không xác định",
      deviceType: "Mobile",
      brand: "Khác",
      gpu: "Unknown GPU",
      isEmulator: false,
    };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const w = window.screen.width || 0;
  const h = window.screen.height || 0;
  const pr = window.devicePixelRatio || 1;

  // Lấy thông tin WebGL GPU
  const { renderer } = getWebGLInfo();
  const gpuClean = cleanGpuName(renderer);

  const desktopGpuPattern = /nvidia|geforce|amd|radeon|intel|angle|direct3d|vmware|virtualbox|vbox|llvmpipe|mesa|swiftshader/i;
  const isMobileUa = /android|iphone|ipad|ipod|mobile/i.test(ua);

  // 1. Kiểm tra GIẢ LẬP ANDROID TRÊN PC
  if (isMobileUa && desktopGpuPattern.test(renderer)) {
    return {
      deviceName: `PC Giả Lập Android (${gpuClean})`,
      deviceType: "Desktop",
      brand: "PC",
      gpu: gpuClean,
      isEmulator: true,
      emulatorReason: `Thiết bị di động nhưng phát hiện GPU máy tính PC (${renderer.slice(0, 40)})`,
    };
  }

  // 2. Kiểm tra MÁY TÍNH PC THẬT (Windows, macOS, Linux)
  if (!isMobileUa && (/win32|win64|windows/i.test(platform) || /windows/i.test(ua))) {
    return {
      deviceName: `Máy tính PC Windows (${gpuClean})`,
      deviceType: "Desktop",
      brand: "PC",
      gpu: gpuClean,
      isEmulator: false,
    };
  }
  if (!isMobileUa && (/macintel|macintosh/i.test(platform) || /mac os x/i.test(ua))) {
    return {
      deviceName: `MacBook / iMac (${gpuClean})`,
      deviceType: "Desktop",
      brand: "PC",
      gpu: gpuClean,
      isEmulator: false,
    };
  }

  // 3. Thiết bị iOS (iPhone / iPad)
  if (/ipad/i.test(ua) || (/macintosh/i.test(platform) && navigator.maxTouchPoints > 1)) {
    const iPadModel = detectIPadModel(w, h);
    return {
      deviceName: iPadModel,
      deviceType: "Tablet",
      brand: "iPad",
      gpu: gpuClean || "Apple GPU",
      isEmulator: false,
    };
  }

  if (/iphone|ipod/i.test(ua)) {
    const iphoneModel = detectIPhoneModel(w, h, pr);
    return {
      deviceName: iphoneModel,
      deviceType: "Mobile",
      brand: "iPhone",
      gpu: gpuClean || "Apple GPU",
      isEmulator: false,
    };
  }

  // 4. Thiết bị Android (thử Client Hints nếu có)
  try {
    const uaData = (navigator as any).userAgentData;
    if (uaData && typeof uaData.getHighEntropyValues === "function") {
      const hints = await uaData.getHighEntropyValues(["model", "platformVersion"]);
      if (hints.model && hints.model.length > 1 && hints.model !== "K") {
        const androidRes = detectAndroidModel(hints.model);
        return {
          deviceName: androidRes.modelName,
          deviceType: "Mobile",
          brand: androidRes.brand,
          gpu: gpuClean,
          isEmulator: false,
        };
      }
    }
  } catch {}

  // Phân tích Android từ User-Agent
  const androidRes = detectAndroidModel(ua);
  return {
    deviceName: androidRes.modelName,
    deviceType: "Mobile",
    brand: androidRes.brand,
    gpu: gpuClean,
    isEmulator: false,
  };
}
