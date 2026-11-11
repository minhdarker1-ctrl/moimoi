"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface TeaserItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  iconUrl: string;
  href: string;
  accentColor: string;
  glowColor: string;
  stats: string;
}

const TEASERS: TeaserItem[] = [
  {
    id: "freefire",
    badge: "🔥 ĐANG THỊNH HÀNH",
    badgeColor: "#ea580c",
    title: "FREE FIRE ULTIMATE",
    tagline: "Bộ Độ Nhạy Thi Đấu & Mở Khóa ID Game",
    description: "Tối ưu hóa thông số cảm ứng, bảng độ nhạy siêu chuẩn cùng giải pháp Unlock ID an toàn, bảo mật 100%.",
    iconUrl: "/services/freefire.png",
    href: "/freefire",
    accentColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.45)",
    stats: "Tỉ lệ chuẩn 99.8% · Hệ thống tự động 24/7",
  },
  {
    id: "aov",
    badge: "⚡ TẶNG MIỄN PHÍ",
    badgeColor: "#0284c7",
    title: "LIÊN QUÂN AOV HUB",
    tagline: "Kho Tài Khoản Cao Thủ Tặng Free",
    description: "Nhận ngay hàng trăm tài khoản Liên Quân chất lượng cao, đa dạng tướng & trang phục, cập nhật liên tục mỗi ngày.",
    iconUrl: "/services/aov.png",
    href: "/aov",
    accentColor: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.45)",
    stats: "Cập nhật mỗi ngày · Miễn phí 100%",
  },
  {
    id: "locket",
    badge: "👑 ĐẶC QUYỀN VIP",
    badgeColor: "#d97706",
    title: "LOCKET GOLD & DNS IOS",
    tagline: "Mở Khóa Full Tính Năng Gold Vĩnh Viễn",
    description: "Trải nghiệm đầy đủ đặc quyền Locket Gold, vượt giới hạn video, không quảng cáo kèm cấu hình DNS iOS mượt mà.",
    iconUrl: "/services/locket.svg",
    href: "/locket",
    accentColor: "#fbbf24",
    glowColor: "rgba(251, 191, 36, 0.45)",
    stats: "Cài đặt 1 chạm · Hoạt động bền bỉ",
  },
];

interface ServiceTeaserTrailerProps {
  videoUrl?: string | null;
}

export default function ServiceTeaserTrailer({ videoUrl }: ServiceTeaserTrailerProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const active = TEASERS[activeIdx];

  // Auto-cycle through teasers every 4.5 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TEASERS.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIdx]);

  function handleNext() {
    setActiveIdx((prev) => (prev + 1) % TEASERS.length);
  }

  function handlePrev() {
    setActiveIdx((prev) => (prev - 1 + TEASERS.length) % TEASERS.length);
  }

  return (
    <div
      className="cyber-teaser-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Trailer giới thiệu dịch vụ nổi bật"
    >
      <div
        className="cyber-teaser-card"
        style={{
          boxShadow: `0 20px 50px -10px ${active.glowColor}, inset 0 0 20px rgba(255, 255, 255, 0.05)`,
          borderColor: active.accentColor,
        }}
      >
        {/* Dynamic ambient background glow */}
        <div
          className="cyber-teaser-ambient"
          style={{
            background: `radial-gradient(circle at 75% 30%, ${active.glowColor} 0%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Video Mode Support if videoUrl is supplied */}
        {videoUrl ? (
          <div className="cyber-teaser-video-wrap">
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="cyber-teaser-video"
            />
          </div>
        ) : (
          /* Cinematic Motion Reel View */
          <div className="cyber-teaser-content">
            {/* Visual Header Row */}
            <div className="cyber-teaser-top">
              <div
                className="cyber-teaser-badge"
                style={{ backgroundColor: active.badgeColor }}
              >
                <span className="cyber-teaser-pulse-dot" />
                {active.badge}
              </div>
              <div className="cyber-teaser-index">
                <span>0{activeIdx + 1}</span> / 0{TEASERS.length}
              </div>
            </div>

            {/* Main Stage Display */}
            <div className="cyber-teaser-body">
              <div className="cyber-teaser-icon-box">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.iconUrl}
                  alt={active.title}
                  className="cyber-teaser-icon"
                  width={64}
                  height={64}
                />
              </div>

              <div className="cyber-teaser-text">
                <h3 className="cyber-teaser-title">{active.title}</h3>
                <h4 className="cyber-teaser-tagline">{active.tagline}</h4>
                <p className="cyber-teaser-desc">{active.description}</p>
                <span className="cyber-teaser-stats">
                  <i className="fas fa-circle-check" style={{ color: active.accentColor }} />
                  {active.stats}
                </span>
              </div>
            </div>

            {/* Footer Navigation & CTA */}
            <div className="cyber-teaser-footer">
              {/* Progress dots */}
              <div className="cyber-teaser-dots">
                {TEASERS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`cyber-teaser-dot ${idx === activeIdx ? "active" : ""}`}
                    aria-label={`Xem ${t.title}`}
                    style={{
                      backgroundColor: idx === activeIdx ? active.accentColor : "rgba(255, 255, 255, 0.2)",
                    }}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="cyber-teaser-actions">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="cyber-teaser-arrow-btn"
                  aria-label="Dịch vụ trước"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="cyber-teaser-arrow-btn"
                  aria-label="Dịch vụ tiếp theo"
                >
                  <i className="fas fa-chevron-right" />
                </button>

                <Link
                  href={active.href}
                  className="cyber-teaser-cta"
                  style={{
                    backgroundColor: active.accentColor,
                    boxShadow: `0 0 20px ${active.glowColor}`,
                  }}
                >
                  <span>XEM CHI TIẾT</span>
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Animated timeline progress bar */}
        {!isPaused && !videoUrl && (
          <div
            key={activeIdx}
            className="cyber-teaser-timeline"
            style={{ backgroundColor: active.accentColor }}
          />
        )}
      </div>
    </div>
  );
}
