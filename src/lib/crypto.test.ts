import assert from "node:assert/strict";
import { test } from "node:test";

process.env.SESSION_SECRET = "0".repeat(64);

const { encryptToken, decryptToken, generateKey, hashKey, normalizeKey, vnDate } = await import(
  "./crypto.ts"
);

test("mã hoá rồi giải mã ra đúng token gốc", () => {
  const t = "abc123-def456-token";
  const enc = encryptToken(t);
  assert.notEqual(enc, t);
  assert.equal(decryptToken(enc), t);
});

test("mã hoá 2 lần cho ra ciphertext khác nhau (IV random)", () => {
  assert.notEqual(encryptToken("same"), encryptToken("same"));
});

test("ciphertext bị sửa thì giải mã fail (GCM auth tag)", () => {
  const enc = encryptToken("secret");
  const [iv, tag, data] = enc.split(":");
  const flipped = Buffer.from(data, "base64");
  flipped[0] ^= 0xff;
  assert.throws(() => decryptToken(`${iv}:${tag}:${flipped.toString("base64")}`));
});

test("key sinh ra đúng định dạng 4 nhóm 4 ký tự, không có ký tự dễ nhầm", () => {
  for (let i = 0; i < 50; i++) {
    const k = generateKey();
    assert.match(k, /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    assert.ok(!/[IO01]/.test(k), `key chứa ký tự dễ nhầm: ${k}`);
  }
});

test("key không lặp lại", () => {
  const set = new Set(Array.from({ length: 500 }, generateKey));
  assert.equal(set.size, 500);
});

test("hash chấp nhận user nhập thiếu gạch hoặc viết thường", () => {
  const k = generateKey();
  assert.equal(hashKey(k), hashKey(k.toLowerCase()));
  assert.equal(hashKey(k), hashKey(k.replace(/-/g, "")));
  assert.equal(hashKey(k), hashKey(`  ${k}  `));
});

test("hash khác nhau cho key khác nhau", () => {
  assert.notEqual(hashKey(generateKey()), hashKey(generateKey()));
});

test("normalizeKey bỏ ký tự lạ", () => {
  assert.equal(normalizeKey("ab3f-k2mn"), "AB3FK2MN");
  assert.equal(normalizeKey("A B/3*F"), "AB3F");
});

test("vnDate trả YYYY-MM-DD theo giờ VN", () => {
  // 2026-01-01T00:30Z = 07:30 cùng ngày ở VN (UTC+7)
  assert.equal(vnDate(new Date("2026-01-01T00:30:00Z")), "2026-01-01");
  // 2025-12-31T18:00Z = 01:00 ngày 2026-01-01 ở VN
  assert.equal(vnDate(new Date("2025-12-31T18:00:00Z")), "2026-01-01");
});
