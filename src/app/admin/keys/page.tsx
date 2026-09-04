import { db } from "@/lib/db";
import AdminNav from "../AdminNav";
import ManualKeyForm from "./ManualKeyForm";
import { revokeKey, deleteKey, purgeExpiredKeys } from "../actions";

export const dynamic = "force-dynamic";

export default async function KeysPage() {
  const [keyTypes, apps, keys] = await Promise.all([
    db.keyType.findMany({ orderBy: { id: "asc" } }),
    db.app.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.appKey.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { keyType: { select: { name: true } }, app: { select: { name: true } } },
    }),
  ]);

  const now = new Date();
  const fmt = (d: Date) => d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <div className="vt-admin">
      <AdminNav current="/admin/keys" />

      <div className="vt-card">
        <h2 style={{ fontSize: 15, marginTop: 0 }}>Tạo key thủ công</h2>
        <ManualKeyForm keyTypes={keyTypes} apps={apps} />
      </div>

      <div className="vt-card">
        <div className="vt-actions" style={{ justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 15, margin: 0 }}>Key đã phát ({keys.length} mới nhất)</h2>
          <form action={purgeExpiredKeys}>
            <button className="vt-btn-sm" type="submit">
              Dọn key hết hạn
            </button>
          </form>
        </div>

        {keys.length === 0 ? (
          <p className="vt-hint">Chưa có key nào.</p>
        ) : (
          <table className="vt-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Loại</th>
                <th>Ứng dụng</th>
                <th>Hết hạn</th>
                <th>Dùng</th>
                <th>Nguồn</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                const expired = k.expiresAt < now;
                const usedUp = k.maxUses > 0 && k.usedCount >= k.maxUses;
                const status = k.revoked
                  ? "Đã thu hồi"
                  : expired
                    ? "Hết hạn"
                    : usedUp
                      ? "Hết lượt"
                      : "Còn dùng";
                return (
                  <tr key={k.id}>
                    <td className="vt-mono">{k.prefix}••••</td>
                    <td>{k.keyType.name}</td>
                    <td>{k.app?.name ?? "Mọi ứng dụng"}</td>
                    <td>{fmt(k.expiresAt)}</td>
                    <td>
                      {k.usedCount}
                      {k.maxUses > 0 ? `/${k.maxUses}` : ""}
                    </td>
                    <td>{k.manual ? `Thủ công${k.note ? ` — ${k.note}` : ""}` : "Vượt link"}</td>
                    <td>{status}</td>
                    <td>
                      <div className="vt-actions">
                        {!k.revoked && (
                          <form action={revokeKey}>
                            <input type="hidden" name="id" value={k.id} />
                            <button className="vt-btn-sm" type="submit">
                              Thu hồi
                            </button>
                          </form>
                        )}
                        <form action={deleteKey}>
                          <input type="hidden" name="id" value={k.id} />
                          <button className="vt-btn-sm vt-btn-danger" type="submit">
                            Xoá
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
