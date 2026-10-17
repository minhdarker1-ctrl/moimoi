import assert from "node:assert/strict";
import { test } from "node:test";

process.env.SESSION_SECRET = "0".repeat(64);

const { signPassPayload, verifyPassPayload, getEndOfVnDay } = await import("./ontop.ts");
const { vnDate } = await import("./crypto.ts");

test("signPassPayload và verifyPassPayload: ký và xác thực toàn vẹn", () => {
  const today = vnDate();
  const payload = {
    passToken: "tok_test_123",
    date: today,
    earnedCount: 1,
    usedCount: 0,
    availableCredits: 1,
  };

  const signed = signPassPayload(payload);
  assert.ok(signed.includes("."));

  const verified = verifyPassPayload(signed);
  assert.equal(verified.valid, true);
  assert.equal(verified.passToken, "tok_test_123");
  assert.equal(verified.earnedCount, 1);
  assert.equal(verified.availableCredits, 1);
});

test("verifyPassPayload: phát hiện cookie giả mạo hoặc sửa đổi", () => {
  const today = vnDate();
  const signed = signPassPayload({
    passToken: "tok_test_123",
    date: today,
    earnedCount: 1,
    usedCount: 0,
    availableCredits: 1,
  });

  const parts = signed.split(".");
  // Thay đổi payload body
  const forged = `${parts[0]}xyz.${parts[1]}`;
  const verified = verifyPassPayload(forged);
  assert.equal(verified.valid, false);
});

test("verifyPassPayload: token khác ngày bị coi là hết hạn", () => {
  const yesterday = "2020-01-01";
  const signed = signPassPayload({
    passToken: "tok_test_old",
    date: yesterday,
    earnedCount: 2,
    usedCount: 1,
    availableCredits: 1,
  });

  const verified = verifyPassPayload(signed);
  assert.equal(verified.valid, false);
});

test("getEndOfVnDay trả về thời điểm cuối ngày theo giờ VN", () => {
  const endOfDay = getEndOfVnDay("2026-10-17");
  assert.ok(endOfDay instanceof Date);
  assert.equal(endOfDay.toISOString().includes("2026-10-17"), true);
});
