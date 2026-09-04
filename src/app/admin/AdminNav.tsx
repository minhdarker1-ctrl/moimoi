import Link from "next/link";
import { logout } from "./actions";

const LINKS = [
  ["/admin", "Tổng quan"],
  ["/admin/site", "Thông tin site"],
  ["/admin/socials", "Social"],
  ["/admin/linkboxes", "Link box"],
  ["/admin/groups", "Nhóm"],
  ["/admin/apps", "Ứng dụng"],
  ["/admin/notices", "Thông báo"],
  ["/admin/shorteners", "Cổng vượt link"],
  ["/admin/keytypes", "Loại key"],
  ["/admin/keys", "Key đã phát"],
] as const;

export default function AdminNav({ current }: { current: string }) {
  return (
    <nav className="vt-admin-nav" aria-label="Quản trị">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>
          {label}
        </Link>
      ))}
      <form action={logout} style={{ marginLeft: "auto" }}>
        <button className="vt-btn-sm" type="submit">
          Đăng xuất
        </button>
      </form>
    </nav>
  );
}
