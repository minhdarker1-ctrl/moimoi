"use client";

import { useMemo } from "react";

interface Snowflake {
  id: number;
  left: number; // 0 - 100%
  size: number; // px
  fallDuration: number; // s
  fallDelay: number; // s (âm để tuyết đã rơi sẵn khi load trang)
  swayDuration: number; // s
  swayDistance: number; // px
  opacity: number;
  type: "dot" | "crystal" | "flake";
  rotateSpeed?: number;
}

// PRNG có hạt giống cố định giúp Server và Client khớp 100%, không bị Hydration Error
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function SnowEffect() {
  const flakes = useMemo(() => {
    const rng = createSeededRandom(2026);
    const list: Snowflake[] = [];

    for (let i = 0; i < 46; i++) {
      const typeRoll = rng();
      let type: Snowflake["type"] = "dot";
      let size = 3 + rng() * 3.5; // 3px - 6.5px

      if (typeRoll > 0.78) {
        type = "flake"; // Bông tuyết 6 cánh tinh xảo
        size = 11 + rng() * 5; // 11px - 16px
      } else if (typeRoll > 0.52) {
        type = "crystal"; // Hạt tuyết phát sáng
        size = 5 + rng() * 4; // 5px - 9px
      }

      list.push({
        id: i,
        type,
        left: Math.round(rng() * 1000) / 10,
        size: Math.round(size * 10) / 10,
        fallDuration: Math.round((7 + rng() * 9) * 10) / 10, // 7s - 16s
        fallDelay: -Math.round(rng() * 16 * 10) / 10,
        swayDuration: Math.round((3 + rng() * 3.5) * 10) / 10, // 3s - 6.5s
        swayDistance: Math.round(16 + rng() * 30), // 16px - 46px
        opacity: Math.round((0.5 + rng() * 0.45) * 100) / 100,
        rotateSpeed: type === "flake" ? Math.round((6 + rng() * 8) * 10) / 10 : undefined,
      });
    }

    return list;
  }, []);

  return (
    <div className="mdarker-snow-container" aria-hidden="true">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className={`mdarker-snow-flake flake-type-${flake.type}`}
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDuration: `${flake.fallDuration}s`,
            animationDelay: `${flake.fallDelay}s`,
            opacity: flake.opacity,
          }}
        >
          <div
            className="mdarker-snow-sway"
            style={{
              animationDuration: `${flake.swayDuration}s`,
              ["--snow-sway" as string]: `${flake.swayDistance}px`,
            }}
          >
            {flake.type === "flake" ? (
              <svg
                viewBox="0 0 24 24"
                className="mdarker-snow-svg"
                style={{
                  animationDuration: flake.rotateSpeed ? `${flake.rotateSpeed}s` : "8s",
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="3.34" y1="7" x2="20.66" y2="17" />
                <line x1="3.34" y1="17" x2="20.66" y2="7" />
                <polyline points="9 4 12 7 15 4" />
                <polyline points="9 20 12 17 15 20" />
                <polyline points="5 9 8 10 7 13" />
                <polyline points="19 15 16 14 17 11" />
                <polyline points="5 15 8 14 7 11" />
                <polyline points="19 9 16 10 17 13" />
              </svg>
            ) : (
              <span className={`mdarker-snow-particle particle-${flake.type}`} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
