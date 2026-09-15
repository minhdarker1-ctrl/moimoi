import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { KeyRound, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import NovaBalanceCard from "@/components/nova/NovaBalanceCard";
import NovaQuickActions from "@/components/nova/NovaQuickActions";
import NovaSpinCard from "@/components/nova/NovaSpinCard";
import NovaReferralCard from "@/components/nova/NovaReferralCard";
import NovaSupportGrid from "@/components/nova/NovaSupportGrid";
import NovaInstallBanner from "@/components/nova/NovaInstallBanner";
import NovaCopyButton from "@/components/nova/NovaCopyButton";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return null;

  const [dbUser, savedKeysCount, recentKeys, latestNotice] = await Promise.all([
    db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        username: true,
        name: true,
        coins: true,
        spinTickets: true,
        tasksToday: true,
        referralCode: true,
        role: true,
      },
    }),
    db.userSavedKey.count({ where: { userId: sessionUser.id } }),
    db.userSavedKey.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.notice.findFirst({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const user = dbUser || sessionUser;
  const coins = dbUser?.coins ?? 100;
  const spinTickets = dbUser?.spinTickets ?? 1;
  const tasksToday = dbUser?.tasksToday ?? 0;

  return (
    <div className="nova-dashboard-feed">
      {/* 1. Announcement Banner từ Admin (nếu có) */}
      {latestNotice && (
        <div className="nova-ann-banner">
          <div className="nova-ann-tag">
            <Sparkles size={12} className="text-amber-400" />
            <span>THÔNG BÁO MỚI</span>
          </div>
          <div className="nova-ann-title">{latestNotice.title}</div>
          <div className="nova-ann-body">{latestNotice.body}</div>
        </div>
      )}

      {/* 2. Thẻ Số Dư & Thống Kê Thành Viên (Balance Hero Card) */}
      <NovaBalanceCard
        coins={coins}
        tasksToday={tasksToday}
        maxTasks={5}
        savedKeysCount={savedKeysCount}
        role={user.role}
      />

      {/* 3. Lưới Lối Tắt Nhanh (Quick Actions Grid) */}
      <NovaQuickActions />

      {/* 4. Mini Game Vòng Quay May Mắn */}
      <NovaSpinCard
        spinTickets={spinTickets}
        tasksSince={tasksToday}
        bonusTasks={3}
      />

      {/* 5. Kho Key Vừa Nhận (Recent Keys Vault) */}
      <div className="nova-recent-keys-card">
        <div className="nova-sec-header">
          <div className="nova-sec-title">
            <KeyRound size={13} className="text-emerald-400" />
            <span>KEY GẦN ĐÂY CỦA BẠN</span>
          </div>
          <Link href="/dashboard/keys" className="nova-sec-link">
            <span>Tất cả ({savedKeysCount})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentKeys.length === 0 ? (
          <div className="nova-empty-keys-box">
            <p>Bạn chưa lưu mã key nào.</p>
            <Link href="/freefire" className="nova-btn-small">
              ⚡ Lấy Key Free Fire ngay
            </Link>
          </div>
        ) : (
          <div className="nova-recent-keys-list">
            {recentKeys.map((item) => (
              <div key={item.id} className="nova-key-item-row">
                <div className="nova-key-item-info">
                  <div className="nova-key-app-name">{item.appName}</div>
                  <div className="nova-key-code-text">{item.key}</div>
                </div>
                <div className="nova-key-action">
                  <NovaCopyButton text={item.key} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Nhắc nhở cài đặt App (PWA) */}
      <NovaInstallBanner />

      {/* 7. Hộp Giới Thiệu Bạn Bè (Referral Card) */}
      <NovaReferralCard
        referralCode={user.referralCode}
        username={user.username}
      />

      {/* 8. Lưới Kênh Hỗ Trợ 2x2 */}
      <NovaSupportGrid />
    </div>
  );
}
