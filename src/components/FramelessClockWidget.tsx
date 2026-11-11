"use client";

import { useState, useEffect } from "react";

export default function FramelessClockWidget() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeState, setTimeState] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    dayName: string;
    day: string;
    month: string;
    year: number;
    solarMonthName: string;
    daysInMonth: number;
    currentDateNum: number;
    firstDayOfWeek: number; // 0 for Sunday
  }>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    dayName: "Đang tải...",
    day: "01",
    month: "01",
    year: 2026,
    solarMonthName: "Tháng 01",
    daysInMonth: 31,
    currentDateNum: 1,
    firstDayOfWeek: 0,
  });

  useEffect(() => {
    setMounted(true);

    function updateVietnamTime() {
      // Vietnam timezone (GMT+7 / Asia/Ho_Chi_Minh)
      const now = new Date();
      const vnTimeString = now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
      const vnDate = new Date(vnTimeString);

      const hours = String(vnDate.getHours()).padStart(2, "0");
      const minutes = String(vnDate.getMinutes()).padStart(2, "0");
      const seconds = String(vnDate.getSeconds()).padStart(2, "0");

      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[vnDate.getDay()];
      const day = String(vnDate.getDate()).padStart(2, "0");
      const month = String(vnDate.getMonth() + 1).padStart(2, "0");
      const year = vnDate.getFullYear();
      const currentDateNum = vnDate.getDate();

      // Mini Calendar calculations for current month
      const daysInMonth = new Date(year, vnDate.getMonth() + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, vnDate.getMonth(), 1).getDay(); // 0 is Sunday

      setTimeState({
        hours,
        minutes,
        seconds,
        dayName,
        day,
        month,
        year,
        solarMonthName: `Tháng ${month}`,
        daysInMonth,
        currentDateNum,
        firstDayOfWeek,
      });
    }

    updateVietnamTime();
    const timer = setInterval(updateVietnamTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="cyber-frameless-clock-wrap" aria-label="Đồng hồ & Lịch Việt Nam">
        <div className="cyber-frameless-clock-tag">
          <span className="cyber-clock-dot" />
          <span>GIỜ VIỆT NAM (GMT+7)</span>
        </div>
        <div className="cyber-frameless-clock-time">--:--:--</div>
        <div className="cyber-frameless-clock-date">Đang đồng bộ vệ tinh...</div>
      </div>
    );
  }

  // Generate mini calendar days array
  // Shift Sunday (0) to end if standard Vietnamese week: T2 T3 T4 T5 T6 T7 CN
  // Let's use Mon (0) to Sun (6) index
  const weekDayHeaders = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const rawFirstDay = timeState.firstDayOfWeek; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const shiftedFirstDay = (rawFirstDay + 6) % 7; // 0 = Mon, ..., 6 = Sun

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < shiftedFirstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= timeState.daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div
      className="cyber-frameless-clock-wrap"
      aria-label="Đồng hồ và Lịch Việt Nam thời gian thực"
    >
      {/* Realtime Live Header Tag */}
      <div className="cyber-frameless-clock-tag">
        <span className="cyber-clock-dot" />
        <span className="cyber-clock-region">VIỆT NAM (GMT+7)</span>
        <span className="cyber-clock-status">LIVE TIME</span>
      </div>

      {/* Giant Clock Numbers */}
      <div className="cyber-frameless-clock-time" title="Giờ Việt Nam thời gian thực">
        <span className="cyber-clock-num">{timeState.hours}</span>
        <span className="cyber-clock-colon">:</span>
        <span className="cyber-clock-num">{timeState.minutes}</span>
        <span className="cyber-clock-colon">:</span>
        <span className="cyber-clock-num cyber-clock-sec">{timeState.seconds}</span>
      </div>

      {/* Date in Vietnamese (Số to rõ, ngày tháng ở dưới) */}
      <div className="cyber-frameless-clock-date">
        <span className="cyber-date-weekday">{timeState.dayName}</span>,{" "}
        <span className="cyber-date-full">
          ngày {timeState.day}/{timeState.month}/{timeState.year}
        </span>
      </div>

      {/* Minimalistic Frameless Mini Calendar (Kèm lịch chuẩn) */}
      <div className="cyber-frameless-mini-cal" aria-label="Lịch tháng này">
        <div className="cyber-cal-head">
          <span className="cyber-cal-month">
            {timeState.solarMonthName} / {timeState.year}
          </span>
          <span className="cyber-cal-today-badge">HÔM NAY: {timeState.day}</span>
        </div>

        {/* Days of week */}
        <div className="cyber-cal-weekdays">
          {weekDayHeaders.map((w, idx) => (
            <span key={idx} className={`cyber-cal-wd ${idx === 6 ? "sunday" : ""}`}>
              {w}
            </span>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="cyber-cal-grid">
          {calendarCells.map((val, idx) => {
            if (val === null) {
              return <span key={`empty-${idx}`} className="cyber-cal-cell empty" />;
            }
            const isToday = val === timeState.currentDateNum;
            const isPast = val < timeState.currentDateNum;
            return (
              <span
                key={`day-${val}`}
                className={`cyber-cal-cell ${isToday ? "today" : ""} ${isPast ? "past" : ""}`}
              >
                {val}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
