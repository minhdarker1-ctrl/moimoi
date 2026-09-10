/**
 * Anti-Bot & Emulator Detection Engine (CreepJS & TrafficVN Pattern)
 * 
 * Phát hiện chuyên sâu:
 * 1. Trình giả lập Android trên PC (LDPlayer, NoxPlayer, BlueStacks, MEmu, Genymotion, Android x86).
 * 2. Công cụ tự động hóa & Headless Browser (Puppeteer, Playwright, Selenium, ChromeDriver, WebDriver).
 * 3. Chế độ F12 DevTools Device Emulation / Responsive Mode giả lập điện thoại trên máy tính.
 * 4. Can thiệp & ghi đè thuộc tính trình duyệt (CreepJS Lies Detection).
 */

export interface SecurityViolation {
  type: "EMULATOR" | "AUTOMATION" | "LIE" | "DEVICE_MISMATCH";
  code: string;
  title: string;
  desc: string;
  severity: "CRITICAL" | "WARNING";
}

export interface SecurityScanResult {
  passed: boolean;
  isEmulator: boolean;
  isAutomation: boolean;
  botScore: number; // 0 (người thật) -> 100 (bot / giả lập 100%)
  violations: SecurityViolation[];
  details: {
    ua: string;
    platform: string;
    webglRenderer: string;
    webglVendor: string;
    maxTouchPoints: number;
    screenRes: string;
    hasWebdriver: boolean;
  };
  timestamp: number;
}

/**
 * Lấy thông tin WebGL Renderer & Vendor thực tế từ phần cứng GPU
 */
export function getWebGLInfo(): { renderer: string; vendor: string } {
  if (typeof window === "undefined") return { renderer: "", vendor: "" };
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return { renderer: "NO_WEBGL", vendor: "NO_WEBGL" };

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) {
      return {
        renderer: (gl.getParameter(gl.RENDERER) || "UNKNOWN_RENDERER").toString(),
        vendor: (gl.getParameter(gl.VENDOR) || "UNKNOWN_VENDOR").toString(),
      };
    }

    const renderer = (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "").toString();
    const vendor = (gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || "").toString();
    return { renderer, vendor };
  } catch {
    return { renderer: "ERROR", vendor: "ERROR" };
  }
}

/**
 * Kiểm tra xem User-Agent có phải là thiết bị di động (Mobile / Tablet)
 */
export function isMobileUserAgent(ua: string): boolean {
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua);
}

/**
 * Kiểm tra các dấu hiệu giả lập Android hoặc F12 giả mạo Mobile
 */
export function detectEmulator(
  ua: string,
  platform: string,
  webglRenderer: string,
  maxTouchPoints: number,
  screenW: number,
  screenH: number
): SecurityViolation[] {
  const violations: SecurityViolation[] = [];
  const isMobileUa = isMobileUserAgent(ua);

  // 1. Kiểm tra WebGL GPU Renderer
  // Nếu User-Agent nhận là Mobile (Android / iOS) nhưng GPU là dòng card máy tính hoặc card máy ảo:
  const desktopGpuPattern = /nvidia|geforce|amd|radeon|intel|angle|direct3d|vmware|virtualbox|vbox|llvmpipe|mesa|swiftshader|microsoft basic/i;
  if (isMobileUa && desktopGpuPattern.test(webglRenderer)) {
    violations.push({
      type: "EMULATOR",
      code: "EMU_DESKTOP_GPU",
      title: "Phát hiện máy giả lập Android trên PC",
      desc: `Thiết bị khai báo di động nhưng sử dụng GPU máy tính: ${webglRenderer.slice(0, 60)}...`,
      severity: "CRITICAL",
    });
  }

  // 2. Kiểm tra platform x86_64 / Win32 trên Android
  // Điện thoại Android thật luôn chạy kiến trúc ARM: 'Linux armv8l', 'Linux aarch64', 'Linux armv7l'.
  // Các máy giả lập Nox / LDPlayer / BlueStacks thường để lộ: 'Linux x86_64', 'Linux i686', 'Win32'.
  if (/android/i.test(ua)) {
    if (/x86_64|i686|win32|win64|macintel/i.test(platform)) {
      violations.push({
        type: "EMULATOR",
        code: "EMU_X86_PLATFORM",
        title: "Kiến trúc hệ điều hành giả lập",
        desc: `Android trên nền tảng x86/PC (${platform}). Các máy thật luôn dùng vi xử lý ARM.`,
        severity: "CRITICAL",
      });
    }
  }

  // 3. Kiểm tra iOS chạy trên Windows/Linux
  if (/iphone|ipad|ipod/i.test(ua)) {
    if (!/macintel|iphone|ipad|ipod/i.test(platform)) {
      violations.push({
        type: "EMULATOR",
        code: "EMU_IOS_ON_WIN",
        title: "Giả mạo thiết bị iOS trên máy tính",
        desc: `User-Agent iPhone/iPad nhưng nền tảng hệ thống là ${platform}.`,
        severity: "CRITICAL",
      });
    }
  }

  // 4. Kiểm tra số điểm cảm ứng (Touch Points)
  // Điện thoại cảm ứng hiện đại luôn có ít nhất 5 điểm cảm ứng đồng thời (multi-touch).
  // Chế độ F12 DevTools Responsive Mode hoặc giả lập cấu hình ẩu thường có 0 hoặc 1 điểm.
  if (isMobileUa) {
    if (maxTouchPoints === 0) {
      violations.push({
        type: "DEVICE_MISMATCH",
        code: "NO_TOUCH_SUPPORT",
        title: "Thiết bị di động không có cảm ứng",
        desc: "Trình duyệt khai báo smartphone nhưng không hỗ trợ thao tác cảm ứng màn hình.",
        severity: "CRITICAL",
      });
    }
  }

  // 5. Kiểm tra kích thước màn hình bất hợp lý
  // Nếu UA là Mobile phone mà độ phân giải màn hình lại là màn hình desktop (>= 1600px)
  const maxDim = Math.max(screenW, screenH);
  if (/mobile|iphone|android/i.test(ua) && !/ipad|tablet/i.test(ua)) {
    if (maxDim > 2560 && maxTouchPoints <= 1) {
      violations.push({
        type: "DEVICE_MISMATCH",
        code: "DESKTOP_SCREEN_ON_MOBILE",
        title: "Kích thước màn hình bất thường",
        desc: `Màn hình ${screenW}x${screenH} thuộc dòng máy tính bàn / laptop.`,
        severity: "WARNING",
      });
    }
  }

  return violations;
}

/**
 * Kiểm tra các dấu hiệu tự động hóa & Headless Bot (Selenium, Puppeteer, CDP)
 */
export function detectAutomation(): SecurityViolation[] {
  if (typeof window === "undefined") return [];
  const violations: SecurityViolation[] = [];
  const win = window as any;
  const nav = navigator as any;

  // 1. Cờ W3C WebDriver chính thống
  if (nav.webdriver === true) {
    violations.push({
      type: "AUTOMATION",
      code: "BOT_NAVIGATOR_WEBDRIVER",
      title: "Phát hiện cờ tự động hóa (WebDriver)",
      desc: "Trình duyệt đang được điều khiển tự động bởi webdriver.",
      severity: "CRITICAL",
    });
  }

  // 2. Dấu vết ChromeDriver / Chrome DevTools Protocol
  const hasCdc = Object.keys(win).some((k) => k.startsWith("cdc_") || k.startsWith("$cdc_"));
  const hasDocumentCdc = Object.keys(document).some(
    (k) => k.startsWith("cdc_") || k.startsWith("$cdc_")
  );
  if (hasCdc || hasDocumentCdc) {
    violations.push({
      type: "AUTOMATION",
      code: "BOT_CHROMEDRIVER_CDP",
      title: "Phát hiện ChromeDriver / CDP",
      desc: "Phát hiện dấu vết can thiệp của công cụ tự động hóa Selenium/ChromeDriver.",
      severity: "CRITICAL",
    });
  }

  // 3. Dấu vết Puppeteer / Playwright
  if (win.__puppeteer_evaluation_script__ || win.__playwright || win._playwright) {
    violations.push({
      type: "AUTOMATION",
      code: "BOT_PUPPETEER_PLAYWRIGHT",
      title: "Phát hiện Puppeteer / Playwright",
      desc: "Trình duyệt không đầu (Headless Browser) đang được điều khiển bằng script.",
      severity: "CRITICAL",
    });
  }

  // 4. Dấu vết PhantomJS / Nightmare
  if (win.callPhantom || win._phantom || win.__nightmare) {
    violations.push({
      type: "AUTOMATION",
      code: "BOT_PHANTOM_NIGHTMARE",
      title: "Phát hiện công cụ cào dữ liệu tự động",
      desc: "Phát hiện dấu hiệu của công cụ PhantomJS/Nightmare.",
      severity: "CRITICAL",
    });
  }

  // 5. Headless Chrome (Outer width/height = 0)
  if (win.outerWidth === 0 && win.outerHeight === 0) {
    violations.push({
      type: "AUTOMATION",
      code: "BOT_HEADLESS_DIMENSIONS",
      title: "Trình duyệt không giao diện (Headless Chrome)",
      desc: "Cửa sổ trình duyệt không có kích thước vật lý hiển thị.",
      severity: "CRITICAL",
    });
  }

  return violations;
}

/**
 * Kiểm tra các lời nói dối (CreepJS "Lies") & can thiệp prototype
 */
export function detectLies(ua: string): SecurityViolation[] {
  if (typeof window === "undefined") return [];
  const violations: SecurityViolation[] = [];
  const nav = navigator as any;

  // 1. Kiểm tra xem userAgent có bị gán trực tiếp lên instance navigator bằng Object.defineProperty không
  // Ở trình duyệt chuẩn, userAgent nằm trên prototype Navigator.prototype dưới dạng getter.
  // Các extension đổi User-Agent hoặc bot thường can thiệp: Object.defineProperty(navigator, 'userAgent', { value: ... })
  try {
    const ownDesc = Object.getOwnPropertyDescriptor(nav, "userAgent");
    if (ownDesc && "value" in ownDesc) {
      violations.push({
        type: "LIE",
        code: "LIE_USERAGENT_OVERRIDDEN",
        title: "User-Agent bị can thiệp / làm giả",
        desc: "Thuộc tính User-Agent đã bị ghi đè nhân tạo qua Object.defineProperty.",
        severity: "CRITICAL",
      });
    }
  } catch {}

  // 2. Kiểm tra Function.prototype.toString tampering
  try {
    const fnStr = Function.prototype.toString.call(Array.prototype.push);
    if (!fnStr.includes("[native code]")) {
      violations.push({
        type: "LIE",
        code: "LIE_NATIVE_TAMPERED",
        title: "Hàm native JavaScript bị sửa đổi",
        desc: "Các hàm cốt lõi của JavaScript engine đã bị hook hoặc can thiệp.",
        severity: "CRITICAL",
      });
    }
  } catch {}

  // 3. Kiểm tra Chrome không có window.chrome
  if (/chrome|crios/i.test(ua) && !/edg|opr/i.test(ua)) {
    const win = window as any;
    if (!win.chrome || typeof win.chrome !== "object") {
      violations.push({
        type: "LIE",
        code: "LIE_MISSING_CHROME_OBJECT",
        title: "Trình duyệt Chrome thiếu đối tượng nội tại",
        desc: "Khai báo trình duyệt Chrome nhưng thiếu đối tượng window.chrome tiêu chuẩn.",
        severity: "WARNING",
      });
    }
  }

  return violations;
}

/**
 * Chạy quét toàn diện môi trường bảo mật của máy khách
 */
export function performSecurityAudit(): SecurityScanResult {
  if (typeof window === "undefined") {
    return {
      passed: true,
      isEmulator: false,
      isAutomation: false,
      botScore: 0,
      violations: [],
      details: {
        ua: "",
        platform: "",
        webglRenderer: "",
        webglVendor: "",
        maxTouchPoints: 0,
        screenRes: "",
        hasWebdriver: false,
      },
      timestamp: Date.now(),
    };
  }

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const screenW = window.screen?.width || 0;
  const screenH = window.screen?.height || 0;
  const webgl = getWebGLInfo();
  const hasWebdriver = (navigator as any).webdriver === true;

  const violations: SecurityViolation[] = [];

  // Chạy lần lượt các bộ kiểm tra
  violations.push(
    ...detectAutomation(),
    ...detectEmulator(ua, platform, webgl.renderer, maxTouchPoints, screenW, screenH),
    ...detectLies(ua)
  );

  const hasCritical = violations.some((v) => v.severity === "CRITICAL");
  const isEmulator = violations.some((v) => v.type === "EMULATOR");
  const isAutomation = violations.some((v) => v.type === "AUTOMATION");

  // Tính điểm nghi vấn bot (0 = người thật, 100 = bot/giả lập tuyệt đối)
  let botScore = 0;
  if (isAutomation) botScore += 60;
  if (isEmulator) botScore += 50;
  violations.forEach((v) => {
    botScore += v.severity === "CRITICAL" ? 30 : 15;
  });
  botScore = Math.min(100, botScore);

  const passed = !hasCritical && botScore < 50;

  return {
    passed,
    isEmulator,
    isAutomation,
    botScore,
    violations,
    details: {
      ua,
      platform,
      webglRenderer: webgl.renderer,
      webglVendor: webgl.vendor,
      maxTouchPoints,
      screenRes: `${screenW}x${screenH}`,
      hasWebdriver,
    },
    timestamp: Date.now(),
  };
}
