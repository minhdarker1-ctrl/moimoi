"use client";

import { useState, useEffect } from "react";

export default function CyberClockWidget() {
  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    function updateTime() {
      const now = new Date();
      // Format 24-hour time HH:mm:ss
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      // Format Vietnamese weekday & date
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      setDateStr(`${dayName}, ${day}/${month}/${year}`);
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="cyber-clock-card" aria-label="Đồng hồ hệ thống">
        <div className="cyber-clock-inner">
          <div className="cyber-clock-time placeholder">--:--:--</div>
          <div className="cyber-clock-date placeholder">Đang tải thời gian...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cyber-clock-card" aria-label="Đồng hồ hệ thống và trạng thái server">
      {/* Ambient background glow */}
      <div className="cyber-clock-ambient" aria-hidden="true" />

      <div className="cyber-clock-inner">
        {/* Header Tag */}
        <div className="cyber-clock-header">
          <span className="cyber-clock-badge">
            <span className="cyber-clock-dot" />
            LIVE STATION
          </span>
          <span className="cyber-clock-timezone">VN (GMT+7)</span>
        </div>

        {/* Big Hologram Digital Clock */}
        <div className="cyber-clock-display" title="Giờ hiện tại">
          <span className="cyber-clock-time">{timeStr}</span>
        </div>

        <div className="cyber-clock-date">{dateStr}</div>

        {/* Server & Network Status Metrics */}
        <div className="cyber-clock-metrics">
          <div className="cyber-metric-item">
            <i className="fas fa-circle-check text-emerald-400" />
            <span>Hệ thống: <strong>Online 24/7</strong></span>
          </div>
          <div className="cyber-metric-item">
            <i className="fas fa-bolt text-amber-400" />
            <span>Tốc độ: <strong>Tự động tức thì</strong></span>
          </div>
          <div className="cyber-metric-item">
            <i className="fas fa-shield-halved text-cyan-400" />
            <span>Bảo mật: <strong>SSL An toàn</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
