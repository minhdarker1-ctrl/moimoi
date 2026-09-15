"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Dices, Sparkles, Award, RotateCcw } from "lucide-react";
import { AuthUser } from "@/lib/auth";

const PRIZES = [
  { label: "+100 Coins", color: "#6366f1", reward: "100 coins" },
  { label: "Key VIP 24h", color: "#ec4899", reward: "Key VIP 24h" },
  { label: "+200 Coins", color: "#a855f7", reward: "200 coins" },
  { label: "+1 Lượt quay", color: "#3b82f6", reward: "+1 lượt quay" },
  { label: "May mắn lần sau", color: "#64748b", reward: "Không trúng" },
  { label: "+500 Coins", color: "#f59e0b", reward: "500 coins" },
  { label: "Key Free Fire", color: "#10b981", reward: "Key Free Fire" },
  { label: "JACKPOT 1,000", color: "#e11d48", reward: "1,000 coins" },
];

export default function LuckySpinPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tickets, setTickets] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setTickets(data.user.spinTickets ?? 2);
        }
      })
      .catch(() => {});
  }, []);

  const handleSpin = () => {
    if (spinning || tickets <= 0) return;

    setSpinning(true);
    setWonPrize(null);
    setTickets((prev) => prev - 1);

    // Random từ 0 đến 7
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    // Quay ít nhất 5 vòng (1800 độ) + góc của prize
    const targetAngle = 360 * 5 + (PRIZES.length - 1 - prizeIndex) * segmentAngle + segmentAngle / 2;
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize.label);
      setHistory((prev) => [
        `${new Date().toLocaleTimeString("vi-VN")}: Trúng ${prize.label}`,
        ...prev.slice(0, 4),
      ]);
    }, 4000);
  };

  return (
    <div className="nova-page-container">
      {/* Header điều hướng */}
      <div className="nova-page-header">
        <Link href="/dashboard" className="nova-back-btn">
          <ArrowLeft size={16} />
          <span>Về Dashboard</span>
        </Link>
        <h1 className="nova-page-title">
          <Dices size={22} className="text-pink-400" />
          <span>Vòng Quay May Mắn</span>
        </h1>
      </div>

      {/* Hero Stats */}
      <div className="nova-spin-page-hero">
        <div className="nova-spin-ticket-stat">
          <Sparkles size={16} className="text-amber-400" />
          <span>Lượt quay còn lại: <strong className="text-amber-300 font-black text-lg">{tickets}</strong></span>
        </div>
        <p className="nova-spin-hint">
          Mỗi ngày nhận 1 lượt miễn phí + Hoàn thành vượt link lấy Key để nhận thêm lượt quay!
        </p>
      </div>

      {/* Vòng quay tương tác */}
      <div className="nova-wheel-wrapper">
        <div className="nova-wheel-pointer" aria-hidden="true">▼</div>

        <div
          className="nova-wheel-disc"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)" : "none",
          }}
        >
          {PRIZES.map((p, i) => {
            const angle = (360 / PRIZES.length) * i;
            return (
              <div
                key={p.label}
                className="nova-wheel-segment"
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: p.color,
                }}
              >
                <span className="nova-wheel-segment-label">{p.label}</span>
              </div>
            );
          })}
        </div>

        {/* Nút Quay ở tâm vòng tròn */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning || tickets <= 0}
          className={`nova-wheel-center-btn ${spinning ? "spinning" : ""}`}
        >
          {spinning ? (
            <RotateCcw size={20} className="animate-spin" />
          ) : (
            <span>QUAY!</span>
          )}
        </button>
      </div>

      {/* Modal / Toast thông báo trúng thưởng */}
      {wonPrize && (
        <div className="nova-spin-won-card">
          <div className="nova-spin-won-icon">🎉</div>
          <div className="nova-spin-won-title">CHÚC MỪNG BẠN!</div>
          <div className="nova-spin-won-prize">{wonPrize}</div>
          <p className="nova-spin-won-desc">
            Phần thưởng đã được ghi nhận vào tài khoản của bạn.
          </p>
        </div>
      )}

      {/* Lịch sử quay gần đây */}
      {history.length > 0 && (
        <div className="nova-spin-history">
          <div className="nova-sec-title">
            <Award size={13} className="text-purple-400" />
            <span>LỊCH SỬ QUAY GẦN ĐÂY</span>
          </div>
          <div className="nova-spin-history-list">
            {history.map((h, i) => (
              <div key={i} className="nova-spin-history-item">
                {h}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
