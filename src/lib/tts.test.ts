import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeMechanicalText } from "./ttsSanitizer.ts";

test("sanitizeMechanicalText chuyển đổi ký hiệu và thuật ngữ kỹ thuật sang âm đọc tự nhiên", () => {
  const input = "Gia công bằng tia lửa điện EDM đạt độ nhám $Ra$ = 0,5 mm và nhiệt độ 1000°C";
  const output = sanitizeMechanicalText(input);

  assert.ok(output.includes("E-D-M"), "Chuyển EDM thành E-D-M");
  assert.ok(output.includes("R a"), "Chuyển $Ra$ thành R a");
  assert.ok(output.includes("0,5 mi-li-mét") || output.includes("mi-li-mét"), "Chuyển mm thành mi-li-mét");
  assert.ok(output.includes("độ C"), "Chuyển °C thành độ C");
  assert.ok(!output.includes("$"), "Đã làm sạch ký hiệu đô-la");
});

test("sanitizeMechanicalText không phá vỡ từ tiếng Việt có chứa 'ra' hoặc 'es/ei/phi'", () => {
  const input = "Kiểm tra khả năng tạo ra bề mặt có độ nhám Ra = 0,8 mm theo phi tiêu chuẩn";
  const output = sanitizeMechanicalText(input);

  assert.ok(output.includes("Kiểm tra"), "Giữ nguyên từ Kiểm tra");
  assert.ok(output.includes("tạo ra"), "Giữ nguyên từ tạo ra");
  assert.ok(output.includes("R a = 0,8 mi-li-mét"), "Chỉ đổi Ra kỹ thuật thành R a");
});

test("sanitizeMechanicalText chuẩn hóa các thuật ngữ Lean Manufacturing", () => {
  const input = "Chỉ số Takt time và Lead time trong hệ thống JIT";
  const output = sanitizeMechanicalText(input);

  assert.ok(output.includes("Tác time"), "Chuẩn hóa Takt time");
  assert.ok(output.includes("Lít time"), "Chuẩn hóa Lead time");
  assert.ok(output.includes("J-I-T"), "Chuẩn hóa JIT");
});
