import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/guard";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

type LocketConfig = {
  fetchToken: string;
  appTransaction: string;
  authHeader: string;
  hashParams: string;
  hashHeaders: string;
};

function getLocketConfig(): LocketConfig | null {
  const fetchToken = process.env.LOCKET_FETCH_TOKEN?.trim() || "";
  const appTransaction = process.env.LOCKET_APP_TRANSACTION?.trim() || "";
  const authHeader = process.env.LOCKET_REVENUECAT_AUTH?.trim() || "";
  const hashParams = process.env.LOCKET_POST_PARAMS_HASH?.trim() || "";
  const hashHeaders = process.env.LOCKET_HEADERS_HASH?.trim() || "";
  if (!fetchToken || !appTransaction || !authHeader || !hashParams || !hashHeaders) {
    return null;
  }
  return { fetchToken, appTransaction, authHeader, hashParams, hashHeaders };
}

function buildRevenueCatHeaders(cfg: LocketConfig): Record<string, string> {
  return {
    Host: "api.revenuecat.com",
    Authorization: cfg.authHeader,
    "Content-Type": "application/json",
    Accept: "*/*",
    "X-Platform": "iOS",
    "X-Platform-Version": "Version 26.2 (Build 23C55)",
    "X-Platform-Device": "iPhone15,3",
    "X-Platform-Flavor": "native",
    "X-Version": "5.41.0",
    "X-Client-Version": "2.32.2",
    "X-Client-Bundle-ID": "com.locket.Locket",
    "X-Client-Build-Version": "3",
    "X-StoreKit2-Enabled": "true",
    "X-StoreKit-Version": "2",
    "X-Observer-Mode-Enabled": "false",
    "X-Is-Sandbox": "false",
    "X-Storefront": "VNM",
    "X-Apple-Device-Identifier": "39A73C25-1E05-4350-ADA7-5CD3FE1079E8",
    "X-Preferred-Locales": "vi_KR,ko_KR,en_KR",
    "X-Nonce": "w0Mlb6+AmV4WYuVv",
    "X-Is-Backgrounded": "false",
    "X-Retry-Count": "0",
    "X-Is-Debug-Build": "false",
    "User-Agent": "Locket/3 CFNetwork/3860.300.31 Darwin/25.2.0",
    "Accept-Language": "vi-VN,vi;q=0.9",
    "X-Post-Params-Hash": cfg.hashParams,
    "X-Headers-Hash": cfg.hashHeaders,
  };
}

/**
 * Phân giải username, link profile hoặc link invite thành UID 28 ký tự.
 */
async function resolveUid(input: string): Promise<string | null> {
  const raw = (input || "").trim();
  if (!raw) return null;

  // 1. Nhập trực tiếp UID 28 ký tự
  if (/^[A-Za-z0-9]{28}$/.test(raw)) {
    return raw;
  }

  // 2. Nhập URL invite (/invites/<UID>)
  const inviteMatch = raw.match(/\/invites\/([A-Za-z0-9]{28})/);
  if (inviteMatch?.[1]) {
    return inviteMatch[1];
  }

  // 3. Nhập URL profile locket.cam/<username> hoặc username thuần
  const profileMatch = raw.match(/locket\.cam\/([A-Za-z0-9_.-]+)/);
  const cleanUser = profileMatch ? profileMatch[1] : raw.replace(/^[@/]+/, "").split(/[?#]/)[0];

  if (!cleanUser) return null;

  const url = `https://locket.cam/${cleanUser}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        Accept: "text/html",
      },
      redirect: "follow",
    });

    const finalUrl = res.url || "";
    const html = await res.text();

    const extractFromText = (text: string): string | null => {
      if (!text) return null;
      const m1 = text.match(/\/invites\/([A-Za-z0-9]{28})/);
      if (m1?.[1]) return m1[1];

      const lp = text.match(/link=([^\s"'>]+)/);
      if (lp?.[1]) {
        try {
          const decoded = decodeURIComponent(lp[1]);
          const m2 = decoded.match(/\/invites\/([A-Za-z0-9]{28})/);
          if (m2?.[1]) return m2[1];
        } catch {}
      }
      return null;
    };

    return extractFromText(finalUrl) || extractFromText(html);
  } catch {
    return null;
  }
}

/**
 * Kiểm tra trạng thái Gold của UID từ RevenueCat
 */
async function checkStatus(
  uid: string,
  headers: Record<string, string>
): Promise<{ active: boolean; expires?: string }> {
  try {
    const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      const entitlements = data?.subscriber?.entitlements?.Gold;
      if (entitlements) {
        return { active: true, expires: entitlements.expires_date };
      }
    }
  } catch {}
  return { active: false };
}

export async function POST(req: Request) {
  try {
    const cfg = getLocketConfig();
    if (!cfg) {
      return NextResponse.json(
        {
          success: false,
          error: "Dịch vụ Locket chưa được cấu hình thông số xác thực.",
        },
        { status: 503 }
      );
    }
    const headers = buildRevenueCatHeaders(cfg);
    const ip = clientIp(req);
    // Rate limit chống spam (Tối đa 10 lượt / 10 phút / IP)
    if (await rateLimit("locket-activate", ip, 10, 10 * 60_000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút!",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const target = (body.target || "").trim();

    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập Username Locket, Link mời hoặc UID 28 ký tự!",
        },
        { status: 400 }
      );
    }

    // Bước 1: Phân giải UID
    const uid = await resolveUid(target);
    if (!uid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy UID tài khoản Locket từ thông tin bạn cung cấp. Vui lòng kiểm tra lại link mời (có dạng locket.cam/... hoặc /invites/...) hoặc username chính xác!",
        },
        { status: 400 }
      );
    }

    // Bước 2: Gửi biên lai Apple StoreKit 2
    const payload = {
      product_id: "locket_1600_1y",
      fetch_token: cfg.fetchToken,
      app_transaction: cfg.appTransaction,
      app_user_id: uid,
      is_restore: true,
      store_country: "VNM",
      currency: "VND",
      price: "399000",
      normal_duration: "P1Y",
      subscription_group_id: "21419447",
      observer_mode: false,
      initiation_source: "restore",
      offers: [],
      attributes: {
        $attConsentStatus: {
          updated_at_ms: Date.now(),
          value: "notDetermined",
        },
      },
    };

    let expiresDate: string | null = null;
    let activated = false;
    let errorMessage = "Kích hoạt chưa thành công. Vui lòng thử lại!";

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch("https://api.revenuecat.com/v1/receipts", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (res.status === 200) {
          const respData = await res.json().catch(() => ({}));
          const subscriber = respData?.subscriber || {};
          const entitlements = subscriber.entitlements || {};
          const subscriptions = subscriber.subscriptions || {};

          for (const key of Object.keys(entitlements)) {
            if (entitlements[key]?.expires_date) {
              expiresDate = entitlements[key].expires_date;
              break;
            }
          }

          if (!expiresDate) {
            for (const key of Object.keys(subscriptions)) {
              if (subscriptions[key]?.expires_date) {
                expiresDate = subscriptions[key].expires_date;
                break;
              }
            }
          }

          if (!expiresDate) {
            // Kiểm tra subscriber status fallback
            const status = await checkStatus(uid, headers);
            if (status.active && status.expires) {
              expiresDate = status.expires;
            }
          }

          activated = true;
          break;
        } else if (res.status === 529) {
          // Server RevenueCat quá tải, chờ 1.5s và thử lại
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        } else {
          const errData = await res.json().catch(() => ({}));
          errorMessage = errData?.message || `Máy chủ xử lý phản hồi mã (${res.status}). Vui lòng thử lại sau!`;
          break;
        }
      } catch (err: any) {
        if (attempt === 2) {
          errorMessage = err?.message || "Lỗi kết nối tới máy chủ dịch vụ. Vui lòng thử lại sau!";
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    const sessionUser = await getCurrentUser().catch(() => null);
    const userAgent = req.headers.get("user-agent")?.slice(0, 150) || "Mobile / iOS";

    if (activated) {
      await db.serviceUsageLog.create({
        data: {
          serviceType: "LOCKET_GOLD",
          serviceName: "Locket Gold",
          targetUser: target,
          ip,
          device: userAgent,
          status: "SUCCESS",
          metadata: JSON.stringify({ uid, expiresDate: expiresDate || "1 Năm (Tự động đồng bộ)" }),
          userId: sessionUser?.id ?? null,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        uid,
        expiresDate: expiresDate || "1 Năm (Tự động đồng bộ)",
        message: "Kích hoạt Locket Gold thành công!",
      });
    }

    await db.serviceUsageLog.create({
      data: {
        serviceType: "LOCKET_GOLD",
        serviceName: "Locket Gold",
        targetUser: target,
        ip,
        device: userAgent,
        status: "FAILED",
        metadata: JSON.stringify({ error: errorMessage }),
        userId: sessionUser?.id ?? null,
      },
    }).catch(() => {});

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 502 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Đã xảy ra lỗi không xác định trong quá trình xử lý.",
      },
      { status: 500 }
    );
  }
}
