import { safeEqual } from "./crypto.ts";

/**
 * Resolve canonical base URL for redirects and shortener callbacks.
 * Prioritizes configured NEXT_PUBLIC_SITE_URL in production to prevent Host header spoofing.
 */
export function getBaseUrl(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.origin.replace(/\/$/, "");
      }
    } catch {
      // Ignore malformed env URL and fall back safely
    }
  }

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host && /^[a-zA-Z0-9.-]+(:\d+)?$/.test(host)) {
    return `${proto === "http" ? "http" : "https"}://${host}`.replace(/\/$/, "");
  }

  const reqUrl = new URL(req.url);
  return `${reqUrl.protocol}//${reqUrl.host}`.replace(/\/$/, "");
}

/**
 * Verify worker / automation secret with constant-time comparison.
 * Localhost bypass is strictly restricted to NODE_ENV === "development".
 */
export function verifyWorkerSecret(req: Request): boolean {
  const expectedSecret = process.env.WORKER_SECRET?.trim();

  if (expectedSecret) {
    const headerSecret = req.headers.get("x-worker-secret");
    if (headerSecret && safeEqual(headerSecret.trim(), expectedSecret)) {
      return true;
    }

    const authHeader = req.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7).trim();
      if (safeEqual(bearerToken, expectedSecret)) {
        return true;
      }
    }
  }

  if (process.env.NODE_ENV === "development") {
    const host = req.headers.get("host") || "";
    if (host.startsWith("localhost:") || host === "localhost" || host.startsWith("127.0.0.1")) {
      return true;
    }
  }

  return false;
}
