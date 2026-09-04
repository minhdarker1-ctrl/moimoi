import { db } from "@/lib/db";
import { vnDate } from "@/lib/crypto";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [counter, daily, apps, keys, active, shorteners] = await Promise.all([
    db.counter.findUnique({ where: { id: 1 } }),
    db.dailyHit.findUnique({ where: { date: vnDate() } }),
    db.app.count(),
    db.appKey.count(),
    db.appKey.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
    db.shortener.count({ where: { enabled: true } }),
  ]);

  const stats = [
    ["Tổng truy cập", counter?.total ?? 0],
    ["Hôm nay", daily?.count ?? 0],
    ["Ứng dụng", apps],
    ["Key còn hiệu lực", active],
    ["Tổng key đã phát", keys],
    ["Cổng đang bật", shorteners],
  ] as const;

  return (
    <div className="vt-admin">
      <AdminNav current="/admin" />
      <div className="vt-row">
        {stats.map(([label, value]) => (
          <div key={label} className="vt-card">
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {new Intl.NumberFormat("vi-VN").format(value)}
            </div>
            <div className="vt-hint">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
