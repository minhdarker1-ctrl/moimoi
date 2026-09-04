import assert from "node:assert/strict";
import { test } from "node:test";
import { canHop, type HopState } from "./hop.ts";

const NOW = 1_000_000;
const base: HopState = { step: 0, lastAt: NOW - 20_000, expiresAt: NOW + 60_000, doneAt: null };

test("đi đúng thứ tự và đủ thời gian thì qua", () => {
  assert.deepEqual(canHop(base, 1, 8, NOW), { ok: true });
});

test("nhảy bước bị chặn", () => {
  // Đang ở step 0 mà gọi /hop/3 = gian lận.
  assert.deepEqual(canHop(base, 3, 8, NOW), { ok: false, reason: "order" });
  assert.deepEqual(canHop(base, 2, 8, NOW), { ok: false, reason: "order" });
});

test("lặp lại bước đã qua bị chặn", () => {
  assert.deepEqual(canHop({ ...base, step: 2 }, 1, 8, NOW), { ok: false, reason: "order" });
});

test("vượt quá nhanh bị chặn", () => {
  assert.deepEqual(canHop({ ...base, lastAt: NOW - 2000 }, 1, 8, NOW), {
    ok: false,
    reason: "tooFast",
  });
});

test("minSeconds = 0 thì không giới hạn tốc độ", () => {
  assert.deepEqual(canHop({ ...base, lastAt: NOW }, 1, 0, NOW), { ok: true });
});

test("phiên hết hạn bị chặn", () => {
  assert.deepEqual(canHop({ ...base, expiresAt: NOW - 1 }, 1, 8, NOW), {
    ok: false,
    reason: "expired",
  });
});

test("phiên đã lấy key rồi thì không dùng lại", () => {
  assert.deepEqual(canHop({ ...base, doneAt: NOW - 100 }, 1, 8, NOW), { ok: false, reason: "done" });
});

test("đi tuần tự đủ N bước", () => {
  const steps = 3;
  let s: HopState = { ...base };
  let t = NOW;
  for (let i = 1; i <= steps; i++) {
    assert.deepEqual(canHop(s, i, 8, t), { ok: true }, `bước ${i} phải qua`);
    s = { ...s, step: i, lastAt: t };
    t += 10_000; // user mất 10s mỗi cổng
  }
  assert.equal(s.step, steps);
});
