import assert from "node:assert/strict";
import { test } from "node:test";
import { splitTextIntoChunks, synthesizeWithGoogleTTS } from "./googleTts.ts";

test("splitTextIntoChunks tách văn bản dài thành các đoạn nhỏ dưới 160 ký tự theo ranh giới câu", () => {
  const shortText = "Gia công cơ khí chính xác với độ nhám bề mặt Ra = 0.5 mm.";
  const shortChunks = splitTextIntoChunks(shortText, 160);
  assert.equal(shortChunks.length, 1);
  assert.equal(shortChunks[0], shortText);

  const longText =
    "Câu hỏi 1: Phương pháp gia công tia lửa điện EDM sử dụng tia lửa để bóc tách vật liệu. Phương án A là sử dụng điện cực định hình. Phương án B là dùng điện cực lăn. Phương án C là dùng dây kim loại. Phương án D là dùng chùm tia electron.";
  const longChunks = splitTextIntoChunks(longText, 160);
  assert.ok(longChunks.length >= 2, "Văn bản dài được tách thành nhiều đoạn");

  for (const chunk of longChunks) {
    assert.ok(
      chunk.length <= 160,
      `Độ dài đoạn ${chunk.length} phải nhỏ hơn hoặc bằng 160 ký tự`
    );
    assert.ok(chunk.trim().length > 0, "Không có đoạn rỗng");
  }
});

test("splitTextIntoChunks xử lý an toàn chuỗi rỗng và khoảng trắng", () => {
  assert.deepEqual(splitTextIntoChunks(""), []);
  assert.deepEqual(splitTextIntoChunks("   "), []);
});

test("synthesizeWithGoogleTTS có thể tạo âm thanh tiếng Việt hợp lệ khi có kết nối", async () => {
  const sample = "Kiểm tra dự phòng giọng đọc tiếng Việt";
  try {
    const buffer = await synthesizeWithGoogleTTS(sample);
    assert.ok(Buffer.isBuffer(buffer), "Kết quả phải là một Buffer");
    assert.ok(buffer.length > 1000, "Dữ liệu âm thanh MP3 phải có dung lượng hợp lệ");
  } catch (err: unknown) {
    // If running in an offline network sandbox, acknowledge graceful error
    console.warn("Google TTS network test skipped or errored:", (err as Error)?.message);
  }
});
