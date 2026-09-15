"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { AuthUser } from "@/lib/auth";
import NovaReferralCard from "@/components/nova/NovaReferralCard";

export default function ReferralPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="nova-page-container">
      <div className="nova-page-header">
        <Link href="/dashboard" className="nova-back-btn">
          <ArrowLeft size={16} />
          <span>Về Dashboard</span>
        </Link>
        <h1 className="nova-page-title">
          <Share2 size={22} className="text-indigo-400" />
          <span>Giới Thiệu Bạn Bè</span>
        </h1>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <NovaReferralCard
          referralCode={user?.referralCode}
          username={user?.username}
        />

        <div className="nova-ref-rules-card">
          <h3 className="text-sm font-bold text-slate-200 mb-2">Quy định nhận thưởng:</h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>Bạn bè đăng ký tài khoản qua liên kết giới thiệu của bạn.</li>
            <li>Sau khi bạn bè vượt link lấy key đầu tiên, bạn sẽ tự động nhận được +500 coins và +1 lượt quay.</li>
            <li>Không giới hạn số lượng bạn bè có thể mời mỗi ngày.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
