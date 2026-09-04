export type HopState = {
  step: number;
  /** Timestamp của bước gần nhất (ms). */
  lastAt: number;
  expiresAt: number;
  doneAt: number | null;
};

export type HopCheck = { ok: true } | { ok: false; reason: HopReason };
export type HopReason = "done" | "expired" | "order" | "tooFast";

export const HOP_MESSAGES: Record<HopReason, string> = {
  done: "Phiên đã dùng xong. Bấm Get Key lại.",
  expired: "Phiên đã hết hạn. Bấm Get Key lại.",
  order: "Bạn đã bỏ qua bước. Bấm Get Key lại.",
  tooFast: "Vượt quá nhanh. Vui lòng làm lại.",
};

/** 3 lớp chống bypass thuần logic, không phụ thuộc DB nên test được trực tiếp. */
export function canHop(s: HopState, step: number, minSeconds: number, now: number): HopCheck {
  if (s.doneAt !== null) return { ok: false, reason: "done" };
  if (s.expiresAt < now) return { ok: false, reason: "expired" };
  if (s.step !== step - 1) return { ok: false, reason: "order" };
  if (now - s.lastAt < Math.max(0, minSeconds) * 1000) return { ok: false, reason: "tooFast" };
  return { ok: true };
}
