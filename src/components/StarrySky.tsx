"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

// Hàm sinh số ngẫu nhiên có hạt giống cố định (Deterministic PRNG)
// Đảm bảo Server và Client render ra tọa độ giống hệt nhau 100%, không bị lỗi Hydration
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function StarrySky() {
  const stars = useMemo(() => {
    const rng = createSeededRandom(42);
    const starColors = ["#ffffff", "#e0e7ff", "#fef08a", "#c7d2fe", "#93c5fd"];
    const list: Star[] = [];

    for (let i = 0; i < 90; i++) {
      const sizeType = rng();
      let size = 1.2;
      if (sizeType > 0.88) {
        size = 2.8; // Ngôi sao sáng to
      } else if (sizeType > 0.65) {
        size = 2.0; // Ngôi sao vừa
      }

      list.push({
        id: i,
        top: Math.round(rng() * 1000) / 10,
        left: Math.round(rng() * 1000) / 10,
        size,
        opacity: Math.round((0.35 + rng() * 0.6) * 100) / 100,
        duration: Math.round((2.5 + rng() * 4.5) * 10) / 10,
        delay: Math.round(rng() * 5 * 10) / 10,
        color: starColors[Math.floor(rng() * starColors.length)],
      });
    }
    return list;
  }, []);

  return (
    <div className="vthangios-starry-sky" aria-hidden="true">
      {/* Lớp tinh vân mờ phát sáng nhẹ */}
      <div className="vthangios-nebula-glow" />

      {/* 2 vệt sao băng bay ngang bầu trời */}
      <div className="vthangios-shooting-star star-1" />
      <div className="vthangios-shooting-star star-2" />

      {/* Bầu trời sao lấp lánh */}
      {stars.map((s) => (
        <span
          key={s.id}
          className={`vthangios-star ${s.size > 2.5 ? "star-bright" : ""}`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow:
              s.size > 2.2
                ? `0 0 6px ${s.color}, 0 0 12px rgba(124, 92, 255, 0.4)`
                : `0 0 2px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}
