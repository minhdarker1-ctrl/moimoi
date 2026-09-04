"use client";

import { useEffect, useState } from "react";
import NoticeBell, { NoticeItem } from "./NoticeBell";
import ThemeToggle from "./ThemeToggle";

interface DesktopHeaderProps {
  siteName: string;
  avatarUrl: string;
  verified: boolean;
  notices: NoticeItem[];
  groups: { id: number; title: string }[];
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
  groups,
}: DesktopHeaderProps) {
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Nút điều hướng nổi chỉ dành cho màn hình di động (< 768px) */}
      <nav className="mdarker-mobile-nav" aria-label="Điều hướng di động">
        <NoticeBell notices={notices} />
        <ThemeToggle />
      </nav>

      {/* Thanh Header kính mờ cố định dành cho máy tính (>= 768px) */}
      <header
        className={`mdarker-desktop-header ${scrolled ? "mdarker-header-scrolled" : ""}`}
        aria-label="Thanh điều hướng chính"
      >
        <div className="mdarker-header-container">
          {/* Cụm Logo + Tên trang bên trái */}
          <button
            type="button"
            className="mdarker-header-brand"
            onClick={scrollToTop}
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

          {/* Menu liên kết nhanh danh mục ở giữa */}
          {groups.length > 0 && (
            <nav className="mdarker-header-nav" aria-label="Danh mục ứng dụng">
              {groups.slice(0, 5).map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="mdarker-header-nav-link"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          )}

          {/* Cụm công cụ bên phải */}
          <div className="mdarker-header-actions">
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
    </>
  );
}
