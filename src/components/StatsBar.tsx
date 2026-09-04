"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number) {
  const [n, setN] = useState(target);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const dur = 900;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setN(Math.round(target * (1 - (1 - p) ** 3))); // ease-out
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return n;
}

function Spark({ id }: { id: string }) {
  return (
    <svg className="vthangios-stat-spark" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <path
        d="M1 13L6 8L10 11L15 4L19 7L23 2"
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="0">
          <stop offset="0" stopColor="var(--vi-accent)" />
          <stop offset="1" stopColor="var(--vi-accent2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function StatsBar({ total, today }: { total: number; today: number }) {
  const [t, setT] = useState(total);
  const [d, setD] = useState(today);

  // Đếm 1 lần / tab: reload không bơm số.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("vt-hit")) return;
      sessionStorage.setItem("vt-hit", "1");
    } catch {
      return;
    }
    fetch("/api/hit", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { total: number; today: number } | null) => {
        if (!j) return;
        setT(j.total);
        setD(j.today);
      })
      .catch(() => {});
  }, []);

  const at = useCountUp(t);
  const ad = useCountUp(d);
  const fmt = new Intl.NumberFormat("vi-VN");

  return (
    <div className="vthangios-stats">
      <div className="vthangios-stats-live">
        <span className="vthangios-live-dot" />
        LIVE
      </div>
      <div className="vthangios-stat-item">
        <Spark id="vtStatGrad1" />
        <span className="vthangios-stat-number">{fmt.format(at)}</span>
        <span className="vthangios-stat-label">Tổng Truy Cập</span>
      </div>
      <div className="vthangios-stat-divider" />
      <div className="vthangios-stat-item">
        <Spark id="vtStatGrad2" />
        <span className="vthangios-stat-number">+{fmt.format(ad)}</span>
        <span className="vthangios-stat-label">Hôm Nay</span>
      </div>
    </div>
  );
}
