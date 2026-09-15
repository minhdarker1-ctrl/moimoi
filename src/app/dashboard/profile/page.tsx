import { getCurrentUser } from "@/lib/auth";
import ProfileClient from "@/components/dashboard/ProfileClient";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="dash-page-container">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Cài Đặt Tài Khoản</h1>
          <p className="dash-page-subtitle">
            Cập nhật thông tin cá nhân, ảnh đại diện và bảo mật tài khoản.
          </p>
        </div>
      </div>

      <ProfileClient user={user} />
    </div>
  );
}
