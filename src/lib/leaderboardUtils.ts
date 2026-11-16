/**
 * Utility functions for Mechanical Quiz Leaderboard (Bảng Vàng)
 */

export interface LeaderboardSortable {
  scorePercentage: number;
  timeSpentSeconds: number;
  createdAt: string | Date;
}

/**
 * Clean and sanitize student display name
 * - Strips risky characters (<, >, ', ", \, ;, `)
 * - Trims whitespace
 * - Enforces length between 2 and 30 characters
 */
export function sanitizeUserName(raw: string): string {
  if (!raw || typeof raw !== "string") return "Thí sinh ẩn danh";
  let name = raw.replace(/[<>'"\\;`]/g, "").trim();
  if (name.length < 2) return "Thí sinh ẩn danh";
  if (name.length > 30) name = name.slice(0, 30);
  return name;
}

/**
 * Validates payload fields for quiz leaderboard submission
 */
export function validateLeaderboardPayload(payload: {
  userName?: unknown;
  scorePercentage?: unknown;
  correctCount?: unknown;
  totalQuestions?: unknown;
  timeSpentSeconds?: unknown;
}): { valid: boolean; error?: string } {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Dữ liệu gửi lên không hợp lệ" };
  }

  const { userName, scorePercentage, correctCount, totalQuestions, timeSpentSeconds } = payload;

  if (typeof userName !== "string" || userName.trim().length < 2) {
    return { valid: false, error: "Tên thí sinh phải có ít nhất 2 ký tự" };
  }

  if (
    typeof scorePercentage !== "number" ||
    scorePercentage < 0 ||
    scorePercentage > 100 ||
    isNaN(scorePercentage)
  ) {
    return { valid: false, error: "Điểm số không hợp lệ (0-100%)" };
  }

  if (
    typeof totalQuestions !== "number" ||
    totalQuestions <= 0 ||
    typeof correctCount !== "number" ||
    correctCount < 0 ||
    correctCount > totalQuestions
  ) {
    return { valid: false, error: "Số câu hỏi không hợp lệ" };
  }

  if (
    typeof timeSpentSeconds !== "number" ||
    timeSpentSeconds < 0 ||
    isNaN(timeSpentSeconds)
  ) {
    return { valid: false, error: "Thời gian làm bài không hợp lệ" };
  }

  return { valid: true };
}

/**
 * Client-side / local sorting algorithm matching database query:
 * 1. scorePercentage DESC
 * 2. timeSpentSeconds ASC
 * 3. createdAt DESC
 */
export function sortLeaderboardEntries<T extends LeaderboardSortable>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    if (b.scorePercentage !== a.scorePercentage) {
      return b.scorePercentage - a.scorePercentage;
    }
    if (a.timeSpentSeconds !== b.timeSpentSeconds) {
      return a.timeSpentSeconds - b.timeSpentSeconds;
    }
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}
