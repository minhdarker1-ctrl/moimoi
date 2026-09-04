"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
});

export default function LiveClock() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // suppressHydrationWarning: server và client khác giờ là bình thường.
  return (
    <div className="vt-clock" suppressHydrationWarning>
      {now}
    </div>
  );
}
