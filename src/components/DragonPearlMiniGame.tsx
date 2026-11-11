"use client";

import { useState, useEffect } from "react";

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function DragonPearlMiniGame() {
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [comboTimer, setComboTimer] = useState<NodeJS.Timeout | null>(null);
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const [chillMode, setChillMode] = useState<boolean>(false);
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  // Load saved score from localStorage
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("minsr-dragon-score") || 0);
      setScore(saved);
    } catch {}
  }, []);

  // Handle Pearl Tap / Click Mini-Game
  function handlePearlClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Reset or increment combo
    setCombo((prev) => Math.min(prev + 1, 10));
    if (comboTimer) clearTimeout(comboTimer);
    const newTimer = setTimeout(() => {
      setCombo(1);
    }, 2500);
    setComboTimer(newTimer);

    // Calculate gained points with combo
    const pointsGained = 100 * combo;
    const nextScore = score + pointsGained;
    setScore(nextScore);
    try {
      localStorage.setItem("minsr-dragon-score", String(nextScore));
    } catch {}

    // Trigger visual burst
    setIsBursting(true);
    setTimeout(() => setIsBursting(false), 400);

    // Create 12 cosmic crimson fire particles
    const colors = ["#ff1744", "#dc2626", "#fbbf24", "#f97316", "#ffffff"];
    const newParticles: BurstParticle[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const speed = Math.random() * 45 + 25;
      newParticles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  }

  // Chill Mode keyboard escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && chillMode) {
        setChillMode(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chillMode]);

  return (
    <>
      <div className="cyber-pearl-station" aria-label="Trạm Long Khí & Mini-game">
        <div className="cyber-pearl-inner">
          {/* Station Title */}
          <div className="cyber-pearl-header">
            <span className="cyber-pearl-tag">
              <i className="fas fa-dragon text-amber-400" />
              LONG KHÍ THẦN
            </span>
            {combo > 1 && (
              <span className="cyber-pearl-combo">
                x{combo} COMBO!
              </span>
            )}
          </div>

          {/* Interactive Dragon Pearl (Viên Ngọc Rồng 3D) */}
          <div className="cyber-pearl-sphere-wrap">
            <button
              type="button"
              onClick={handlePearlClick}
              className={`cyber-pearl-sphere ${isBursting ? "bursting" : ""}`}
              aria-label="Chạm vào ngọc rồng để tích lũy Long Khí"
              title="Chạm vào Ngọc Rồng để tích lũy Long Khí!"
            >
              <div className="cyber-pearl-core" />
              <div className="cyber-pearl-ring ring-1" />
              <div className="cyber-pearl-ring ring-2" />
              <div className="cyber-pearl-star">✦</div>

              {/* Burst particles */}
              {particles.map((p) => (
                <span
                  key={p.id}
                  className="cyber-burst-spark"
                  style={{
                    transform: `translate(${p.vx}px, ${p.vy}px)`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}`,
                  }}
                />
              ))}
            </button>
          </div>

          {/* Score Counter */}
          <div className="cyber-pearl-stats">
            <span className="cyber-pearl-score-label">Long Khí Tích Lũy</span>
            <div className="cyber-pearl-score-val">
              {score.toLocaleString("vi-VN")} <span>✦</span>
            </div>
            <p className="cyber-pearl-hint">Chạm vào ngọc để triệu hồi Long Khí</p>
          </div>

          {/* Chill Mode Screensaver Trigger */}
          <button
            type="button"
            onClick={() => setChillMode(true)}
            className="cyber-chill-mode-btn"
            title="Bật chế độ ngắm rồng toàn màn hình và nghe nhạc"
          >
            <i className="fas fa-moon text-indigo-400" />
            <span>TREO MÁY CHILL MODE</span>
          </button>
        </div>
      </div>

      {/* FULLSCREEN CHILL SCREENSAVER MODE */}
      {chillMode && (
        <div
          className="cyber-screensaver-overlay"
          onClick={() => setChillMode(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Chế độ treo máy thư giãn"
        >
          <div className="cyber-screensaver-content" onClick={(e) => e.stopPropagation()}>
            <div className="cyber-screensaver-badge">
              <span className="cyber-screensaver-pulse" />
              CHILL LOUNGE MODE
            </div>

            <div className="cyber-screensaver-center">
              <h2 className="cyber-screensaver-title">MinSr Cyber Space</h2>
              <p className="cyber-screensaver-sub">
                Đang phát nhạc nền · Rồng thần đang hộ mệnh
              </p>
            </div>

            <div className="cyber-screensaver-footer">
              <button
                type="button"
                onClick={() => setChillMode(false)}
                className="cyber-screensaver-exit-btn"
              >
                <span>THOÁT CHẾ ĐỘ TREO MÁY (ESC)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
