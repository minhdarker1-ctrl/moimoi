export type ParsedUA = {
  device: "Desktop" | "Mobile" | "Tablet";
  os: string;
  browser: string;
  browserOs: string;
};

export function parseUserAgent(uaRaw?: string | null): ParsedUA {
  const ua = uaRaw || "";

  // 1. Phân loại thiết bị (Device)
  let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua,
    )
  ) {
    device = "Mobile";
  }

  // 2. Hệ điều hành (OS)
  let os = "Unknown OS";
  if (/windows nt 10\.0/i.test(ua)) os = "Windows 10/11";
  else if (/windows nt 6\.3/i.test(ua)) os = "Windows 8.1";
  else if (/windows nt 6\.2/i.test(ua)) os = "Windows 8";
  else if (/windows nt 6\.1/i.test(ua)) os = "Windows 7";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) {
    const match = ua.match(/android\s([0-9\.]+)/i);
    os = match ? `Android ${match[1]}` : "Android";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    const match = ua.match(/os\s([0-9_]+)/i);
    os = match ? `iOS ${match[1].replace(/_/g, ".")}` : "iOS";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // 3. Trình duyệt (Browser)
  let browser = "Other";
  if (/edg\/([0-9\.]+)/i.test(ua)) {
    const m = ua.match(/edg\/([0-9]+)/i);
    browser = m ? `Edge ${m[1]}` : "Edge";
  } else if (/zalo/i.test(ua)) {
    browser = "Zalo App";
  } else if (/fban|fbav/i.test(ua)) {
    browser = "Facebook App";
  } else if (/tiktok/i.test(ua)) {
    browser = "TikTok App";
  } else if (/opr\/([0-9\.]+)/i.test(ua) || /opera/i.test(ua)) {
    const m = ua.match(/opr\/([0-9]+)/i);
    browser = m ? `Opera ${m[1]}` : "Opera";
  } else if (/chrome\/([0-9\.]+)/i.test(ua)) {
    const m = ua.match(/chrome\/([0-9]+)/i);
    browser = m ? `Chrome ${m[1]}` : "Chrome";
  } else if (/version\/([0-9\.]+).*safari/i.test(ua) || /safari/i.test(ua)) {
    const m = ua.match(/version\/([0-9]+)/i);
    browser = m ? `Safari ${m[1]}` : "Safari";
  } else if (/firefox\/([0-9\.]+)/i.test(ua)) {
    const m = ua.match(/firefox\/([0-9]+)/i);
    browser = m ? `Firefox ${m[1]}` : "Firefox";
  }

  const browserOs = `${browser} / ${os.toLowerCase()}`;

  return { device, os, browser, browserOs };
}

/** Trích xuất vị trí từ headers CDN (Vercel, Cloudflare) */
export function extractLocation(headers: Headers): string {
  try {
    const rawCity =
      headers.get("x-vercel-ip-city") ||
      headers.get("cf-ipcity") ||
      headers.get("x-city") ||
      "";
    const country =
      headers.get("x-vercel-ip-country") ||
      headers.get("cf-ipcountry") ||
      headers.get("x-country") ||
      "";

    const city = rawCity ? decodeURIComponent(rawCity) : "";

    if (city && country) return `${city}, ${country}`;
    if (country) return country;
    if (city) return city;
  } catch {}
  return "—";
}
