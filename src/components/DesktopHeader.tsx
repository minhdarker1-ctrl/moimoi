"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoticeBell, { NoticeItem } from "./NoticeBell";
import ThemeToggle from "./ThemeToggle";

interface DesktopHeaderProps {
  siteName: string;
  avatarUrl: string;
  verified: boolean;
  notices: NoticeItem[];
  groups?: { id: number; title: string; slug?: string; icon?: string; badge?: string }[];
}

const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
});

export default function DesktopHeader({
  siteName,
  avatarUrl,
  verified,
  notices,
}: DesktopHeaderProps) {
  const [time, setTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleBrandClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="mdarker-desktop-header" aria-label="Thanh điều hướng chính">
      <div className="mdarker-header-container">
        {/* BÊN TRÁI: Avatar tròn + Tên thương hiệu MinSr + Tích xanh xác minh */}
        {pathname === "/" ? (
          <button
            type="button"
            className="mdarker-header-brand"
            onClick={handleBrandClick}
            title="Cuộn lên đầu trang"
          >
            {avatarUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={siteName}
                width={36}
                height={36}
                className="mdarker-header-avatar"
              />
            )}
            <span className="mdarker-header-name">{siteName}</span>
            {verified && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/verify.svg"
                alt="Đã xác minh"
                width={18}
                height={18}
                className="mdarker-header-verify"
              />
            )}
          </button>
        ) : (
          <Link
            href="/"
            className="mdarker-header-brand"
            title="Về trang chủ"
          >
            {avatarUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt={siteName}
                width={36}
                height={36}
                className="mdarker-header-avatar"
              />
            )}
            <span className="mdarker-header-name">{siteName}</span>
            {verified && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/verify.svg"
                alt="Đã xác minh"
                width={18}
                height={18}
                className="mdarker-header-verify"
              />
            )}
          </Link>
        )}

        {/* BÊN PHẢI: Đồng hồ GMT+7 thời gian thực + Chuông thông báo nổi + Nút chuyển Dark/Light mode */}
        <div className="mdarker-header-right-actions">
          {time && (
            <div className="mdarker-header-clock" title="Giờ Việt Nam (GMT+7)" suppressHydrationWarning>
              <i className="bi bi-clock" aria-hidden="true" />
              <span>{time}</span>
            </div>
          )}
          <NoticeBell notices={notices} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
