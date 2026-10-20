"use client";

import { useState } from "react";

export interface LinePoint {
  date: string;
  fullDate: string;
  hits: number;
}

export interface BarDay {
  date: string;
  fullDate: string;
  freefire: number;
  locket: number;
  aov: number;
  total: number;
}

export interface DonutSegment {
  name: string;
  count: number;
  color: string;
}

interface AdminChartsProps {
  lineData: LinePoint[];
  barData: BarDay[];
  donutData: DonutSegment[];
}

export default function AdminCharts({ lineData, barData, donutData }: AdminChartsProps) {
  const [activeLinePoint, setActiveLinePoint] = useState<LinePoint | null>(null);
  const [activeBarDay, setActiveBarDay] = useState<BarDay | null>(null);
  const [activeDonutSegment, setActiveDonutSegment] = useState<DonutSegment | null>(null);

  // 1. Line Chart Calculations (SVG 600 x 220)
  const maxHit = Math.max(...lineData.map((d) => d.hits), 10);
  const minHit = Math.min(...lineData.map((d) => d.hits), 0);
  const avgHit = Math.round(lineData.reduce((acc, curr) => acc + curr.hits, 0) / (lineData.length || 1));

  const chartW = 600;
  const chartH = 200;
  const padX = 40;
  const padY = 25;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const getX = (idx: number) => {
    if (lineData.length <= 1) return padX;
    return padX + (idx / (lineData.length - 1)) * plotW;
  };

  const getY = (val: number) => {
    const ratio = (val - minHit) / (maxHit - minHit || 1);
    return padY + plotH - ratio * plotH;
  };

  const pointsStr = lineData.map((d, i) => `${getX(i)},${getY(d.hits)}`).join(" ");
  const areaPath = lineData.length > 0
    ? `M ${getX(0)},${getY(lineData[0].hits)} ` +
      lineData.slice(1).map((d, i) => `L ${getX(i + 1)},${getY(d.hits)}`).join(" ") +
      ` L ${getX(lineData.length - 1)},${chartH - padY} L ${getX(0)},${chartH - padY} Z`
    : "";

  // 2. Bar Chart Calculations (SVG 500 x 200)
  const maxBarTotal = Math.max(...barData.map((d) => d.total), 5);
  const barChartW = 500;
  const barChartH = 190;
  const barPadX = 35;
  const barPadY = 25;
  const barPlotW = barChartW - barPadX * 2;
  const barPlotH = barChartH - barPadY * 2;
  const barSlotW = barPlotW / (barData.length || 1);
  const barWidth = Math.min(32, barSlotW * 0.65);

  // 3. Donut Chart Calculations
  const donutTotal = donutData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const donutR = 56;
  const donutCircumference = 2 * Math.PI * donutR;
  let accumulatedOffset = 0;

  return (
    <div className="admin-charts-wrapper">
      {/* HEADER SECTION */}
      <div className="admin-section-header">
        <div className="flex items-center gap-2">
          <span className="admin-section-dot bg-indigo-500" />
          <h2 className="admin-section-title">📊 Trung Tâm Phân Tích &amp; Biểu Đồ Hiệu Suất</h2>
        </div>
        <span className="admin-section-badge">Dữ liệu thời gian thực</span>
      </div>

      {/* TOP CHART: 14-DAY VISITOR TRAFFIC LINE CHART */}
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <div>
            <h3 className="admin-chart-title">Xu Hướng Truy Cập 14 Ngày Qua (Daily Visits)</h3>
            <p className="admin-chart-subtitle">Theo dõi lưu lượng truy cập toàn website theo ngày</p>
          </div>
          <div className="admin-stat-pills">
            <span className="admin-pill-tag max">Cao nhất: <strong>{maxHit.toLocaleString()}</strong></span>
            <span className="admin-pill-tag avg">Trung bình: <strong>{avgHit.toLocaleString()}</strong>/ngày</span>
          </div>
        </div>

        <div className="admin-svg-container">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="admin-svg-chart">
            <defs>
              <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const yVal = padY + plotH * (1 - ratio);
              const hitVal = Math.round(minHit + ratio * (maxHit - minHit));
              return (
                <g key={ratio}>
                  <line
                    x1={padX}
                    y1={yVal}
                    x2={chartW - padX}
                    y2={yVal}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padX - 8}
                    y={yVal + 3.5}
                    textAnchor="end"
                    fill="var(--vi-muted, #94a3b8)"
                    fontSize="10"
                    fontFamily="inherit"
                  >
                    {hitVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#lineAreaGrad)" />}

            {/* Main Polyline */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.8"
              points={pointsStr}
              filter="url(#glow)"
            />

            {/* Points and Hover Areas */}
            {lineData.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.hits);
              const isHovered = activeLinePoint?.fullDate === d.fullDate;
              return (
                <g
                  key={d.fullDate}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLinePoint(d)}
                  onMouseLeave={() => setActiveLinePoint(null)}
                >
                  {/* Invisible hit target for smooth mobile touch & mouse hover */}
                  <rect
                    x={cx - barSlotW / 2}
                    y={padY}
                    width={barSlotW}
                    height={plotH}
                    fill="transparent"
                  />
                  {isHovered && (
                    <line
                      x1={cx}
                      y1={padY}
                      x2={cx}
                      y2={chartH - padY}
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? "#ffffff" : "#6366f1"}
                    stroke="#4338ca"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                  <text
                    x={cx}
                    y={chartH - 8}
                    textAnchor="middle"
                    fill={isHovered ? "#ffffff" : "var(--vi-muted, #94a3b8)"}
                    fontWeight={isHovered ? "bold" : "normal"}
                    fontSize="9.5"
                  >
                    {d.date}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip for Line Chart */}
          {activeLinePoint && (
            <div className="admin-chart-tooltip" style={{ left: "50%", transform: "translateX(-50%)" }}>
              <span className="tooltip-date">📅 Ngày {activeLinePoint.fullDate}</span>
              <span className="tooltip-value font-bold text-indigo-400">
                {activeLinePoint.hits.toLocaleString()} lượt truy cập
              </span>
            </div>
          )}
        </div>
      </div>

      {/* TWO COLUMNS: BAR CHART (7 DAYS) + DONUT CHART (SERVICE SHARE) */}
      <div className="admin-charts-grid-2">
        {/* LEFT: 7-DAY BAR CHART */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3 className="admin-chart-title">Sử Dụng Dịch Vụ 7 Ngày Qua</h3>
              <p className="admin-chart-subtitle">Số yêu cầu Free Fire, Locket &amp; Liên Quân theo ngày</p>
            </div>
            <div className="admin-chart-legend">
              <span className="legend-item"><span className="legend-dot bg-amber-500" /> FF</span>
              <span className="legend-item"><span className="legend-dot bg-purple-500" /> Locket</span>
              <span className="legend-item"><span className="legend-dot bg-cyan-500" /> AOV</span>
            </div>
          </div>

          <div className="admin-svg-container">
            <svg viewBox={`0 0 ${barChartW} ${barChartH}`} className="admin-svg-chart">
              {/* Horizontal guide lines */}
              {[0, 0.5, 1].map((ratio) => {
                const y = barPadY + barPlotH * (1 - ratio);
                return (
                  <line
                    key={ratio}
                    x1={barPadX}
                    y1={y}
                    x2={barChartW - barPadX}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {/* Bars */}
              {barData.map((d, i) => {
                const xCenter = barPadX + (i + 0.5) * barSlotW;
                const xBar = xCenter - barWidth / 2;
                const totalH = (d.total / maxBarTotal) * barPlotH;
                const yBase = barPadY + barPlotH;
                const isHovered = activeBarDay?.fullDate === d.fullDate;

                // Sub-bars calculation
                const ffH = d.total > 0 ? (d.freefire / maxBarTotal) * barPlotH : 0;
                const locketH = d.total > 0 ? (d.locket / maxBarTotal) * barPlotH : 0;
                const aovH = d.total > 0 ? (d.aov / maxBarTotal) * barPlotH : 0;

                return (
                  <g
                    key={d.fullDate}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveBarDay(d)}
                    onMouseLeave={() => setActiveBarDay(null)}
                  >
                    {/* Background hover column */}
                    {isHovered && (
                      <rect
                        x={xCenter - barSlotW * 0.45}
                        y={barPadY}
                        width={barSlotW * 0.9}
                        height={barPlotH}
                        fill="rgba(255, 255, 255, 0.05)"
                        rx="6"
                      />
                    )}

                    {/* Stacked bar segments */}
                    {d.total === 0 ? (
                      <rect
                        x={xBar}
                        y={yBase - 3}
                        width={barWidth}
                        height={3}
                        fill="rgba(255, 255, 255, 0.15)"
                        rx="1.5"
                      />
                    ) : (
                      <>
                        {/* FF Bar (bottom) */}
                        {ffH > 0 && (
                          <rect
                            x={xBar}
                            y={yBase - ffH}
                            width={barWidth}
                            height={ffH}
                            fill="#f59e0b"
                            rx={locketH === 0 && aovH === 0 ? "4" : "0"}
                          />
                        )}
                        {/* Locket Bar (middle) */}
                        {locketH > 0 && (
                          <rect
                            x={xBar}
                            y={yBase - ffH - locketH}
                            width={barWidth}
                            height={locketH}
                            fill="#8b5cf6"
                            rx={aovH === 0 ? "4" : "0"}
                          />
                        )}
                        {/* AOV Bar (top) */}
                        {aovH > 0 && (
                          <rect
                            x={xBar}
                            y={yBase - ffH - locketH - aovH}
                            width={barWidth}
                            height={aovH}
                            fill="#06b6d4"
                            rx="4"
                          />
                        )}
                      </>
                    )}

                    {/* Total label above bar */}
                    {d.total > 0 && (
                      <text
                        x={xCenter}
                        y={yBase - totalH - 5}
                        textAnchor="middle"
                        fill="var(--vi-text, #ffffff)"
                        fontSize="9.5"
                        fontWeight="bold"
                      >
                        {d.total}
                      </text>
                    )}

                    {/* Date label at bottom */}
                    <text
                      x={xCenter}
                      y={barChartH - 8}
                      textAnchor="middle"
                      fill={isHovered ? "#ffffff" : "var(--vi-muted, #94a3b8)"}
                      fontSize="9.5"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Bar Tooltip */}
            {activeBarDay && (
              <div className="admin-chart-tooltip" style={{ left: "50%", transform: "translateX(-50%)" }}>
                <span className="tooltip-date">📅 {activeBarDay.fullDate}</span>
                <div className="flex gap-3 text-xs mt-1">
                  <span className="text-amber-400">FF: {activeBarDay.freefire}</span>
                  <span className="text-purple-400">Locket: {activeBarDay.locket}</span>
                  <span className="text-cyan-400">AOV: {activeBarDay.aov}</span>
                  <span className="font-bold text-white">Tổng: {activeBarDay.total}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: DONUT CHART (SERVICE SHARE) */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h3 className="admin-chart-title">Thị Phần Dịch Vụ (14 Ngày)</h3>
              <p className="admin-chart-subtitle">Tỷ lệ tương tác giữa các tính năng chính</p>
            </div>
            <span className="admin-pill-tag avg">Tổng: {donutTotal.toLocaleString()} lượt</span>
          </div>

          <div className="admin-donut-container">
            <div className="admin-donut-visual">
              <svg viewBox="0 0 160 160" className="admin-donut-svg">
                <circle
                  cx="80"
                  cy="80"
                  r={donutR}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="20"
                />

                {donutData.map((seg) => {
                  const segRatio = seg.count / donutTotal;
                  const dashArray = `${segRatio * donutCircumference} ${donutCircumference}`;
                  const dashOffset = -accumulatedOffset;
                  accumulatedOffset += segRatio * donutCircumference;

                  const isHovered = activeDonutSegment?.name === seg.name;

                  return (
                    <circle
                      key={seg.name}
                      cx="80"
                      cy="80"
                      r={donutR}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? 24 : 20}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-200"
                      style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                      onMouseEnter={() => setActiveDonutSegment(seg)}
                      onMouseLeave={() => setActiveDonutSegment(null)}
                    />
                  );
                })}

                {/* Center text */}
                <text
                  x="80"
                  y="76"
                  textAnchor="middle"
                  fill="var(--vi-text, #ffffff)"
                  fontSize="17"
                  fontWeight="bold"
                >
                  {donutTotal.toLocaleString()}
                </text>
                <text
                  x="80"
                  y="92"
                  textAnchor="middle"
                  fill="var(--vi-muted, #94a3b8)"
                  fontSize="9.5"
                >
                  YÊU CẦU
                </text>
              </svg>
            </div>

            {/* Donut Legend */}
            <div className="admin-donut-legend">
              {donutData.map((seg) => {
                const pct = Math.round((seg.count / donutTotal) * 100);
                const isHovered = activeDonutSegment?.name === seg.name;
                return (
                  <div
                    key={seg.name}
                    className={`admin-legend-row ${isHovered ? "active" : ""}`}
                    onMouseEnter={() => setActiveDonutSegment(seg)}
                    onMouseLeave={() => setActiveDonutSegment(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="legend-color-box" style={{ background: seg.color }} />
                      <span className="legend-name">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="legend-count">{seg.count.toLocaleString()}</span>
                      <span className="legend-pct">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
