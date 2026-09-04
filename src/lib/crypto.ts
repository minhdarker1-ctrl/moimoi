import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

function secret(): Buffer {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("SESSION_SECRET chưa đặt hoặc ngắn hơn 32 ký tự");
  }
  // scrypt để chuỗi hex/text bất kỳ thành đúng 32 byte key.
  return scryptSync(s, "moimoi-token-enc", 32);
}

/** Mã hoá token cổng rút gọn trước khi lưu DB. */
export function encryptToken(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", secret(), iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv.toString("base64"), c.getAuthTag().toString("base64"), enc.toString("base64")].join(":");
}

export function decryptToken(stored: string): string {
  const [iv, tag, data] = stored.split(":");
  if (!iv || !tag || !data) throw new Error("Token đã lưu bị sai định dạng");
  const d = createDecipheriv("aes-256-gcm", secret(), Buffer.from(iv, "base64"));
  d.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(data, "base64")), d.final()]).toString("utf8");
}

/** Token phiên vượt link: URL-safe, không đoán được. */
export function sessionToken(): string {
  return randomBytes(24).toString("base64url");
}

const KEY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ I,O,0,1 cho dễ đọc

/** Key người dùng: 16 ký tự, chia nhóm 4 cho dễ nhập. VD: A3F9-K2MN-7PQR-XT4W */
export function generateKey(): string {
  const bytes = randomBytes(16);
  const chars = Array.from(bytes, (b) => KEY_ALPHABET[b % KEY_ALPHABET.length]);
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join("")).join("-");
}

/** Key lưu DB dạng hash. Không cần bcrypt: key đã random 80 bit, không brute-force được. */
export function hashKey(key: string): string {
  return createHash("sha256").update(normalizeKey(key)).digest("hex");
}

/** Chấp nhận user nhập thiếu gạch hoặc viết thường. */
export function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Hash IP/UA để nhận diện phiên mà không lưu dữ liệu cá nhân. */
export function fingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Ngày YYYY-MM-DD theo giờ VN, dùng cho DailyHit và quota cổng. */
export function vnDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}
