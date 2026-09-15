"use client";

import { Sparkles, KeyRound, CheckCircle2, Award } from "lucide-react";

interface NovaBalanceCardProps {
  coins?: number;
  tasksToday?: number;
  maxTasks?: number;
  savedKeysCount?: number;
  rank?: string | number;
  role?: string;
}

export default function NovaBalanceCard({
  coins = 100,
  tasksToday = 0,
  maxTasks = 5,
  savedKeysCount = 0,
  rank = "#1",
  role = "USER",
}: NovaBalanceCardProps) {
  const formattedCoins = new Intl.NumberFormat("vi-VN").format(coins);

  return (
    <div className="nova-bal-card">
      <div className="nova-bal-label">
        <Sparkles size={12} className="text-amber-400" />
        <span>SỐ DƯ &amp; TÍCH LŨY</span>
      </div>

      <div className="nova-bal-amount">
        {formattedCoins}
      </div>
      <div className="nova-bal-unit">coins tích lũy</div>

      <div className="nova-bal-substats">
        <div className="nova-bal-stat-item">
          <div className="nova-bal-stat-val">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>{tasksToday}/{maxTasks}</span>
          </div>
          <div className="nova-bal-stat-lbl">Lấy key hôm nay</div>
        </div>

        <div className="nova-bal-stat-item">
          <div className="nova-bal-stat-val">
            <KeyRound size={13} className="text-indigo-400" />
            <span>{savedKeysCount}</span>
          </div>
          <div className="nova-bal-stat-lbl">Key trong kho</div>
        </div>

        <div className="nova-bal-stat-item">
          <div className="nova-bal-stat-val">
            <Award size={13} className="text-pink-400" />
            <span>{role === "ADMIN" ? "Quản Trị" : "VIP Tier"}</span>
          </div>
          <div className="nova-bal-stat-lbl">Cấp bậc tuần</div>
        </div>
      </div>
    </div>
  );
}
