import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import KeysListClient from "@/components/dashboard/KeysListClient";
import { KeyRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardKeysPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const keys = await db.userSavedKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedKeys = keys.map((k) => ({
    id: k.id,
    appName: k.appName,
    key: k.key,
    expiresAt: k.expiresAt ? k.expiresAt.toISOString() : null,
    createdAt: k.createdAt.toISOString(),
  }));

  return (
    <div className="dash-page-container">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Mã Key Đã Lưu</h1>
          <p className="dash-page-subtitle">
            Danh sách tất cả các mã key bạn đã lưu để sử dụng lại bất cứ lúc nào.
          </p>
        </div>
      </div>

      <KeysListClient initialKeys={serializedKeys} />
    </div>
  );
}
