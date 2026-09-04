/**
 * THÊM CỔNG MỚI: copy 1 block trong PROVIDERS, sửa 5 dòng. Không sửa file nào khác.
 *   id     — mã lưu DB, CHỮ IN, không đổi về sau (đổi là các cổng đã lưu thành vô hiệu)
 *   label  — tên hiện trong dropdown admin
 *   build  — ghép URL gọi API. Bọc url bằng enc() nếu không thì mất query param
 *   parse  — đọc link rút gọn từ response, throw nếu cổng trả lỗi
 * Sau đó thêm 1 test trong shorteners.test.ts và chạy `npm test`.
 */
export type ProviderDef = {
  id: string;
  label: string;
  /** Cổng nhận fallback_url (link dự phòng khi user không vượt được). */
  supportsFallback: boolean;
  /** Quota mặc định gợi ý cho admin. 0 = không giới hạn. */
  dailyLimit: number;
  build: (a: { token: string; url: string; fallback?: string }) => string;
  parse: (body: string) => string;
};

const enc = encodeURIComponent;

/** Cổng trả JSON {status, shortenedUrl, message} — Traffic4K, TrafficVN. */
function parseStatusJson(body: string): string {
  const d = JSON.parse(body) as { status?: string; shortenedUrl?: string; message?: string };
  if (d.status === "success" && d.shortenedUrl) return d.shortenedUrl;
  throw new Error(d.message || "Cổng rút gọn trả lỗi");
}

/** Cổng chỉ trả mã, phải tự ghép domain — Ontops, GTraffic. */
function parseIdJson(domain: string) {
  return (body: string): string => {
    const d = JSON.parse(body) as { id?: string; message?: string };
    if (!d.id) throw new Error(d.message || "Cổng rút gọn không trả mã");
    return `${domain}/${d.id}`;
  };
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: "TRAFFIC4K",
    label: "Traffic4K",
    supportsFallback: true,
    dailyLimit: 0,
    build: ({ token, url, fallback }) =>
      `https://traffic4k.com/apidevelop?api=${token}&url=${enc(url)}` +
      (fallback ? `&fallback_url=${enc(fallback)}` : ""),
    parse: parseStatusJson,
  },
  {
    id: "TRAFFICVN",
    label: "TrafficVN",
    supportsFallback: true,
    dailyLimit: 0,
    build: ({ token, url, fallback }) =>
      `https://www.trafficvn.com/apidevelop?api=${token}&url=${enc(url)}` +
      (fallback ? `&fallback_url=${enc(fallback)}` : ""),
    parse: parseStatusJson,
  },
  {
    id: "ONTOPS",
    label: "Ontops Link",
    supportsFallback: false,
    dailyLimit: 1000,
    build: ({ token, url }) =>
      `https://api-management.ontops.link/api/public/create-short-link?apikey=${token}&url=${enc(url)}`,
    parse: parseIdJson("https://ontops.link"),
  },
  {
    id: "GTRAFFIC",
    label: "GTraffic IO",
    supportsFallback: false,
    dailyLimit: 1000,
    build: ({ token, url }) =>
      `https://manager.gtraffic.io/api/cong-khai/tao-lien-ket?apikey=${token}&url=${enc(url)}`,
    parse: parseIdJson("https://gtraffic.io"),
  },
  {
    id: "DR_GTRAFFIC",
    label: "Direct GTraffic",
    supportsFallback: false,
    dailyLimit: 1000,
    build: ({ token, url }) =>
      `https://dr-manager.gtraffic.io/api/cong-khai/tao-lien-ket?apikey=${token}&url=${enc(url)}`,
    parse: parseIdJson("https://direct.gtraffic.io"),
  },
  {
    id: "VUOTNHANH",
    label: "Vượt Nhanh",
    supportsFallback: false,
    dailyLimit: 0,
    build: ({ token, url }) => `https://vuotnhanh.com/api?api=${token}&url=${enc(url)}&format=text`,
    parse: (body) => {
      const url = body.trim();
      // Cổng này có thể trả JSON dù đã xin text.
      if (url.startsWith("{")) return parseStatusJson(url);
      if (!/^https?:\/\//.test(url)) throw new Error("Vượt Nhanh trả nội dung không phải URL");
      return url;
    },
  },
];

export type Provider = string;

const BY_ID = new Map(PROVIDERS.map((p) => [p.id, p]));

export function isProvider(v: string): boolean {
  return BY_ID.has(v);
}

export function getProvider(id: string): ProviderDef {
  const p = BY_ID.get(id);
  if (!p) throw new Error(`Cổng không tồn tại: ${id}`);
  return p;
}

/** Build URL gọi API. Tách riêng để test được mà không cần gọi mạng. */
export function buildApiUrl(
  provider: string,
  token: string,
  targetUrl: string,
  fallbackUrl?: string,
): string {
  const p = getProvider(provider);
  return p.build({
    token,
    url: targetUrl,
    fallback: p.supportsFallback ? fallbackUrl : undefined,
  });
}

/** Đọc link rút gọn từ response. */
export function parseResponse(provider: string, body: string): string {
  return getProvider(provider).parse(body);
}

/** Gọi 1 cổng, trả link rút gọn. Throw nếu lỗi để caller nhảy cổng khác. */
export async function shorten(
  provider: string,
  token: string,
  targetUrl: string,
  fallbackUrl?: string,
): Promise<string> {
  // buildApiUrl đã tự bỏ fallback với cổng không hỗ trợ.
  const url = buildApiUrl(provider, token, targetUrl, fallbackUrl);

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { accept: "application/json, text/plain" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${provider} HTTP ${res.status}`);

  return parseResponse(provider, await res.text());
}
