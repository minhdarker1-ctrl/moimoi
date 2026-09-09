"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoticeBell, { NoticeItem } from "./NoticeBell";
import ThemeToggle from "./ThemeToggle";
import { getGroupRoute } from "./CategoryMenu";

interface DesktopHeaderProps {
  siteName: string;
  avatarUrl: string;
  verified: boolean;
  notices: NoticeItem[];
  groups: { id: number; title: string; slug?: string; icon?: string; badge?: string }[];
  hideAllNav?: boolean;
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
  hideAllNav = false,
}: DesktopHeaderProps) {
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Khi cuộn xuống quá 50px thì kích hoạt hiện thanh taskbar
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBrandClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 
        1. CỤM THÔNG BÁO VÀ CHỈNH CHẾ ĐỘ: LUÔN GIỮ CỐ ĐỊNH TẠI CHỖ (FIXED TOP-RIGHT)
        Đáp ứng yêu cầu: "phần thông báo và chỉnh chế độ được giữ tại chỗ"
      */}
      <aside className="mdarker-fixed-actions" aria-label="Cài đặt và thông báo">
        {time && (
          <div className="mdarker-header-clock" title="Giờ Việt Nam (GMT+7)" suppressHydrationWarning>
            <i className="bi bi-clock" aria-hidden="true" />
            <span>{time}</span>
          </div>
        )}
        <NoticeBell notices={notices} />
        <ThemeToggle />
      </aside>

      {/* 
        2. THANH TASKBAR Ở TRÊN CÙNG (SLIDE-DOWN TASKBAR)
        Đáp ứng yêu cầu: "chỉ khi cuộn xuống thì nó mới hiện xuống từ từ"
      */}
      <header
        className={`mdarker-desktop-header ${
          scrolled ? "mdarker-header-scrolled mdarker-header-visible" : "mdarker-header-hidden"
        }`}
        aria-label="Thanh điều hướng chính"
      >
        <div className="mdarker-header-container">
          {/* Cụm Logo + Tên trang bên trái */}
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

          {/* Menu liên kết nhanh mảng ở giữa */}
          <nav className="mdarker-header-nav" aria-label="Danh mục mảng">
            {groups.slice(0, 6).map((g) => {
              const href = getGroupRoute(g);
              const isActive = pathname === href;
              return (
                <Link
                  key={g.id}
                  href={href}
                  className={`mdarker-header-nav-link ${isActive ? "active" : ""}`}
                >
                  {g.icon && (
                    <span className="mdarker-header-nav-icon" aria-hidden="true">
                      {g.icon.startsWith("http") ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={g.icon} alt="" width={15} height={15} />
                      ) : g.icon.startsWith("bi-") ? (
                        <i className={`bi ${g.icon}`} />
                      ) : (
                        <i className={g.icon} />
                      )}
                    </span>
                  )}
                  <span>{g.title}</span>
                </Link>
              );
            })}

            {/* Nút ALL để ở cuối cùng - Chỉ hiển thị khi không bật hideAllNav */}
            {!hideAllNav && (
              <Link
                href="/all"
                className={`mdarker-header-nav-link mdarker-nav-all ${pathname === "/all" ? "active" : ""}`}
              >
                <span className="mdarker-header-nav-icon" aria-hidden="true">
                  <i className="fa-solid fa-shapes" />
                </span>
                <span>ALL</span>
              </Link>
            )}
          </nav>

          {/* Khoảng đệm bên phải để cân xứng với cụm fixed actions */}
          <div className="mdarker-header-actions-spacer" aria-hidden="true" />
        </div>
      </header>
    </>
  );
}
