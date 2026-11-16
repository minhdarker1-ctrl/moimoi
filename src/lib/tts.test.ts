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

test("sanitizeMechanicalText chuẩn hóa các thuật ngữ Lean Manufacturing", () => {
  const input = "Chỉ số Takt time và Lead time trong hệ thống JIT";
  const output = sanitizeMechanicalText(input);

  assert.ok(output.includes("Tác time"), "Chuẩn hóa Takt time");
  assert.ok(output.includes("Lít time"), "Chuẩn hóa Lead time");
  assert.ok(output.includes("J-I-T"), "Chuẩn hóa JIT");
});

test("EdgeTTS module có thể khởi tạo mà không lỗi cú pháp", async () => {
  const { EdgeTTS } = await import("node-edge-tts");
  assert.equal(typeof EdgeTTS, "function");

  const instance = new EdgeTTS({
    voice: "vi-VN-HoaiMyNeural",
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3",
  });
  assert.ok(instance);
});
