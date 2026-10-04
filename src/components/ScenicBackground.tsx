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

interface Firefly {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

// Hàm sinh số ngẫu nhiên hạt giống cố định (Deterministic PRNG)
// Đảm bảo Server và Client render khớp nhau 100%, không bị Hydration Error
function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function ScenicBackground() {
  // Stars for Dark Mode (90 deterministic stars)
  const stars = useMemo(() => {
    const rng = createSeededRandom(42);
    const starColors = ["#ffffff", "#e0e7ff", "#fef08a", "#c7d2fe", "#93c5fd"];
    const list: Star[] = [];

    for (let i = 0; i < 90; i++) {
      const sizeType = rng();
      let size = 1.2;
      if (sizeType > 0.88) {
        size = 2.8;
      } else if (sizeType > 0.65) {
        size = 2.0;
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

  // Fireflies for Dark Mode (14 gentle blinking fireflies near valleys)
  const fireflies = useMemo(() => {
    const rng = createSeededRandom(2026);
    const colors = ["#fef08a", "#a3e635", "#38bdf8", "#fde047"];
    const list: Firefly[] = [];

    for (let i = 0; i < 14; i++) {
      list.push({
        id: i,
        top: Math.round((68 + rng() * 26) * 10) / 10, // 68% - 94% height
        left: Math.round(rng() * 1000) / 10,
        size: Math.round((2.5 + rng() * 3) * 10) / 10,
        delay: Math.round(rng() * 4 * 10) / 10,
        duration: Math.round((2.2 + rng() * 3.5) * 10) / 10,
        color: colors[Math.floor(rng() * colors.length)],
      });
    }
    return list;
  }, []);

  return (
    <div className="scenic-canvas-container" aria-hidden="true">
      {/* ========================================================
          1. LIGHT MODE SCENE: BẦU TRỜ XANH, MẶT TRỜI, MÂY, NÚI XANH
          ======================================================== */}
      <div className="scenic-scene scenic-day">
        {/* Soft Day Sky Gradient */}
        <div className="scenic-day-sky" />

        {/* Sun & Radiant Sunbeams */}
        <div className="scenic-sun-wrap">
          <div className="scenic-sunbeams" />
          <div className="scenic-sun-corona" />
          <div className="scenic-sun" />
        </div>

        {/* Drifting Clouds */}
        <div className="scenic-clouds-wrap">
          {/* Cloud 1 */}
          <div className="scenic-cloud cloud-1">
            <svg viewBox="0 0 140 55" className="scenic-cloud-svg">
              <path
                d="M20,45 Q0,45 5,30 Q10,12 28,18 Q38,2 58,10 Q74,-2 92,10 Q112,6 118,22 Q138,25 132,45 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* Cloud 2 */}
          <div className="scenic-cloud cloud-2">
            <svg viewBox="0 0 160 60" className="scenic-cloud-svg">
              <path
                d="M25,50 Q2,50 8,34 Q14,14 34,20 Q46,4 68,12 Q86,-2 106,12 Q128,8 135,26 Q156,30 150,50 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* Cloud 3 */}
          <div className="scenic-cloud cloud-3">
            <svg viewBox="0 0 120 48" className="scenic-cloud-svg">
              <path
                d="M18,40 Q0,40 5,26 Q10,10 26,16 Q36,2 52,8 Q66,-2 82,8 Q98,4 104,18 Q120,22 115,40 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          {/* Cloud 4 */}
          <div className="scenic-cloud cloud-4">
            <svg viewBox="0 0 150 56" className="scenic-cloud-svg">
              <path
                d="M22,48 Q2,48 7,32 Q12,14 30,19 Q42,3 62,11 Q78,-2 96,11 Q116,7 124,24 Q145,28 140,48 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Flock of Birds Gliding in Distance */}
        <div className="scenic-flock-wrap">
          <div className="scenic-bird bird-1">
            <svg viewBox="0 0 24 10" className="scenic-bird-svg">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,7 Q6,3 0,6 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="scenic-bird bird-2">
            <svg viewBox="0 0 24 10" className="scenic-bird-svg">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,7 Q6,3 0,6 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="scenic-bird bird-3">
            <svg viewBox="0 0 24 10" className="scenic-bird-svg">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,3 12,7 Q6,3 0,6 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Day Valley Mist */}
        <div className="scenic-mist scenic-mist-day" />

        {/* Layered Green Hills / Mountains at Bottom */}
        <div className="scenic-mountains-wrap">
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
            className="scenic-mountains-svg"
          >
            <defs>
              <linearGradient id="dayFarMountainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="dayMidHillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="dayForeHillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#14532d" />
              </linearGradient>
            </defs>

            {/* Layer 1: Distant Misty Mountain Peaks */}
            <path
              d="M0,140 Q180,60 360,110 T720,80 T1080,100 T1440,70 L1440,260 L0,260 Z"
              fill="url(#dayFarMountainGrad)"
            />

            {/* Layer 2: Mid-Range Rolling Green Hills */}
            <path
              d="M0,170 Q240,110 480,150 T960,120 T1440,160 L1440,260 L0,260 Z"
              fill="url(#dayMidHillGrad)"
            />

            {/* Layer 3: Foreground Rich Lush Hills */}
            <path
              d="M0,205 Q320,155 640,195 T1280,175 T1440,210 L1440,260 L0,260 Z"
              fill="url(#dayForeHillGrad)"
            />
          </svg>
        </div>
      </div>

      {/* ========================================================
          2. DARK MODE SCENE: SAO ĐÊM, SAO BĂNG, NÚI ĐÊM, ĐOM ĐÓM
          ======================================================== */}
      <div className="scenic-scene scenic-night">
        {/* Lớp tinh vân mờ phát sáng huyền bí */}
        <div className="mdarker-nebula-glow" />

        {/* 2 vệt sao băng bay ngang bầu trời đêm */}
        <div className="mdarker-shooting-star star-1" />
        <div className="mdarker-shooting-star star-2" />

        {/* Bầu trời 90 ngôi sao lấp lánh */}
        <div className="scenic-stars-layer">
          {stars.map((s) => (
            <span
              key={s.id}
              className={`mdarker-star ${s.size > 2.5 ? "star-bright" : ""}`}
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

        {/* Fireflies (Đom đóm bay lượn ở thung lũng đêm) */}
        <div className="scenic-fireflies-layer">
          {fireflies.map((f) => (
            <span
              key={f.id}
              className="scenic-firefly"
              style={{
                top: `${f.top}%`,
                left: `${f.left}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                backgroundColor: f.color,
                boxShadow: `0 0 8px ${f.color}, 0 0 16px ${f.color}`,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Night Valley Mist */}
        <div className="scenic-mist scenic-mist-night" />

        {/* Layered Night Mountain Silhouettes at Bottom */}
        <div className="scenic-mountains-wrap">
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
            className="scenic-mountains-svg"
          >
            <defs>
              <linearGradient id="nightFarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="nightMidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <linearGradient id="nightForeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Layer 1: Far Jagged Mountains with Starlight Rim */}
            <path
              d="M0,135 Q170,45 350,95 T710,55 T1070,85 T1440,45 L1440,260 L0,260 Z"
              fill="url(#nightFarGrad)"
            />

            {/* Layer 2: Mid-Range Rolling Ridges */}
            <path
              d="M0,165 Q230,100 470,140 T930,110 T1440,150 L1440,260 L0,260 Z"
              fill="url(#nightMidGrad)"
            />

            {/* Layer 3: Foreground Deep Obsidian Silhouettes */}
            <path
              d="M0,200 Q310,145 620,180 T1220,160 T1440,200 L1440,260 L0,260 Z"
              fill="url(#nightForeGrad)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
