import { db } from "./db";

export interface TelegramUnlockPayload {
  uid: string;
  server: string;
  serverLabel: string;
  device?: string;
  ip?: string;
  status?: string;
}

/**
 * Gửi tin nhắn qua Telegram Bot API
 */
export async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<{ success: boolean; error?: string }> {
  const cleanToken = token.trim();
  const cleanChatId = chatId.trim();

  if (!cleanToken || !cleanChatId) {
    return { success: false, error: "Thiếu Bot Token hoặc Chat ID Telegram." };
  }

  try {
    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      const err = data.description || `HTTP ${res.status}`;
      console.error("[Telegram Bot Error]:", err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error) {
    const errStr = error instanceof Error ? error.message : String(error);
    console.error("[Telegram Fetch Error]:", errStr);
    return { success: false, error: errStr };
  }
}

/**
 * Gửi thông báo tự động khi có người chơi Unlock ID Free Fire
 */
export async function sendFreeFireUnlockTelegramAlert(
  payload: TelegramUnlockPayload
): Promise<void> {
  try {
    const config = await db.freeFireConfig.findUnique({
      where: { id: 1 },
      select: {
        telegramNotifyEnabled: true,
        telegramBotToken: true,
        telegramChatId: true,
      },
    });

    const token =
      config?.telegramBotToken?.trim() ||
      process.env.TELEGRAM_BOT_TOKEN?.trim() ||
      "";
    const chatId =
      config?.telegramChatId?.trim() ||
      process.env.TELEGRAM_CHAT_ID?.trim() ||
      "";
    const isEnabled = config?.telegramNotifyEnabled ?? false;

    // Nếu không bật thông báo hoặc thiếu token/chatId thì dừng
    if (!isEnabled || !token || !chatId) {
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });

    const iconPort = payload.server === "astute" ? "⚡" : "🎯";
    const message = [
      `🎯 <b>[YÊU CẦU UNLOCK ID FREE FIRE]</b>`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `👤 <b>UID Free Fire:</b> <code>${payload.uid}</code>`,
      `${iconPort} <b>Cổng Kích Hoạt:</b> <b>${payload.serverLabel}</b>`,
      `📱 <b>Thiết Bị:</b> ${payload.device || "Không xác định"}`,
      `🌐 <b>Địa Chỉ IP:</b> <code>${payload.ip || "—"}</code>`,
      `🕒 <b>Thời Gian:</b> ${timeStr}`,
      `✅ <b>Trạng Thái:</b> <b>ĐÃ CẤP QUYỀN WHITELIST</b>`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `<i>Thông báo tự động từ hệ thống mDarker Free Fire Hub</i>`,
    ].join("\n");

    await sendTelegramMessage(token, chatId, message, "HTML");
  } catch (err) {
    console.error("[Send FF Unlock Telegram Alert Failed]:", err);
  }
}
