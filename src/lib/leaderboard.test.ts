import assert from "node:assert/strict";
import { test } from "node:test";
import {
  sanitizeUserName,
  validateLeaderboardPayload,
  sortLeaderboardEntries,
} from "./leaderboardUtils.ts";

test("sanitizeUserName loại bỏ ký tự nguy hiểm và chuẩn hóa tên thí sinh", () => {
  assert.equal(sanitizeUserName("<script>alert('hack')</script>"), "scriptalert(hack)/script");
  assert.equal(sanitizeUserName("   Minh Cơ Khí (K20)   "), "Minh Cơ Khí (K20)");
  assert.equal(sanitizeUserName(""), "Thí sinh ẩn danh");
  assert.equal(sanitizeUserName("A"), "Thí sinh ẩn danh"); // Dưới 2 ký tự

  const longName = "A".repeat(50);
  assert.equal(sanitizeUserName(longName).length, 30);
});

test("validateLeaderboardPayload xác thực tính hợp lệ của dữ liệu điểm và thời gian", () => {
  // Valid payload
  const validResult = validateLeaderboardPayload({
    userName: "Nguyễn Văn A",
    scorePercentage: 95,
    correctCount: 19,
    totalQuestions: 20,
    timeSpentSeconds: 120,
  });
  assert.equal(validResult.valid, true);

  // Invalid user name
  const invalidName = validateLeaderboardPayload({
    userName: " ",
    scorePercentage: 80,
    correctCount: 16,
    totalQuestions: 20,
    timeSpentSeconds: 100,
  });
  assert.equal(invalidName.valid, false);

  // Negative or invalid score
  const invalidScore = validateLeaderboardPayload({
    userName: "Nguyễn Văn B",
    scorePercentage: 105,
    correctCount: 20,
    totalQuestions: 20,
    timeSpentSeconds: 100,
  });
  assert.equal(invalidScore.valid, false);

  // Invalid questions count
  const invalidCount = validateLeaderboardPayload({
    userName: "Nguyễn Văn C",
    scorePercentage: 80,
    correctCount: 25,
    totalQuestions: 20,
    timeSpentSeconds: 100,
  });
  assert.equal(invalidCount.valid, false);
});

test("sortLeaderboardEntries sắp xếp chính xác theo: Điểm cao -> Thời gian ít -> Ngày tạo gần nhất", () => {
  const entries = [
    {
      id: "1",
      userName: "Thí sinh A",
      scorePercentage: 80,
      timeSpentSeconds: 120,
      createdAt: "2026-11-16T10:00:00Z",
    },
    {
      id: "2",
      userName: "Thí sinh B (Điểm cao nhất)",
      scorePercentage: 100,
      timeSpentSeconds: 300,
      createdAt: "2026-11-16T10:05:00Z",
    },
    {
      id: "3",
      userName: "Thí sinh C (Cùng 80 điểm nhưng nhanh hơn)",
      scorePercentage: 80,
      timeSpentSeconds: 90,
      createdAt: "2026-11-16T10:10:00Z",
    },
    {
      id: "4",
      userName: "Thí sinh D (Cùng 80 điểm và 90s nhưng nộp sau)",
      scorePercentage: 80,
      timeSpentSeconds: 90,
      createdAt: "2026-11-16T10:15:00Z",
    },
  ];

  const sorted = sortLeaderboardEntries(entries);

  // 1st: Thí sinh B (100%)
  assert.equal(sorted[0].id, "2");
  // 2nd: Thí sinh D (80%, 90s, nộp lúc 10:15)
  assert.equal(sorted[1].id, "4");
  // 3rd: Thí sinh C (80%, 90s, nộp lúc 10:10)
  assert.equal(sorted[2].id, "3");
  // 4th: Thí sinh A (80%, 120s)
  assert.equal(sorted[3].id, "1");
});
