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

// Deterministic PRNG để Server và Client render khớp nhau 100%.
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function ScenicBackground() {
  const stars = useMemo(() => {
    const rng = createSeededRandom(42);
    const starColors = ["#cccccc", "#9cdcfe", "#dcdcaa", "#569cd6"];
    const list: Star[] = [];

    for (let i = 0; i < 45; i++) {
      const size = rng() > 0.78 ? 2 : 1.2;
      list.push({
        id: i,
        top: Math.round(rng() * 1000) / 10,
        left: Math.round(rng() * 1000) / 10,
        size,
        opacity: Math.round((0.18 + rng() * 0.35) * 100) / 100,
        duration: Math.round((3.5 + rng() * 4.5) * 10) / 10,
        delay: Math.round(rng() * 5 * 10) / 10,
        color: starColors[Math.floor(rng() * starColors.length)],
      });
    }
    return list;
  }, []);

  return (
    <div className="scenic-canvas-container" aria-hidden="true">
      <div className="scenic-scene scenic-night">
        <div className="scenic-stars-layer">
          {stars.map((s) => (
            <span
              key={s.id}
              className="mdarker-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: s.color,
                opacity: s.opacity,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
