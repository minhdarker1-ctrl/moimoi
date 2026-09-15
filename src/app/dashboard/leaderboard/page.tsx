"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Crown, Medal, Sparkles } from "lucide-react";
import { AuthUser } from "@/lib/auth";

interface LeaderboardItem {
  rank: number;
  name: string;
  avatar?: string;
  coins: number;
  keysCount: number;
  isMe?: boolean;
}

export default function LeaderboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  const leaderboard: LeaderboardItem[] = [
    { rank: 1, name: "ThangDarker VIP", coins: 14500, keysCount: 42 },
    { rank: 2, name: "MinhHacker01", coins: 11200, keysCount: 35 },
    { rank: 3, name: "DarkerGamerX", coins: 8900, keysCount: 28 },
    { rank: 4, name: "FreeFireMaster", coins: 6400, keysCount: 21 },
    {
      rank: 5,
      name: user?.name || user?.username || "Tài Khoản Của Bạn",
      coins: user?.coins || 2500,
      keysCount: 14,
      isMe: true,
    },
    { rank: 6, name: "ShadowHunter", coins: 2100, keysCount: 12 },
    { rank: 7, name: "DragonSlayer", coins: 1800, keysCount: 9 },
    { rank: 8, name: "CyberNinja", coins: 1500, keysCount: 8 },
    { rank: 9, name: "NeonRider", coins: 1200, keysCount: 6 },
    { rank: 10, name: "PhoenixPro", coins: 950, keysCount: 4 },
  ];

  const getRankMedal = (r: number) => {
    switch (r) {
      case 1:
        return <Crown size={18} className="text-yellow-400" />;
      case 2:
        return <Medal size={18} className="text-slate-300" />;
      case 3:
        return <Medal size={18} className="text-amber-600" />;
      default:
        return <span className="nova-rank-num">#{r}</span>;
    }
  };

  return (
    <div className="nova-page-container">
      {/* Top Header */}
      <div className="nova-page-header">
        <Link href="/dashboard" className="nova-back-btn">
          <ArrowLeft size={16} />
          <span>Về Dashboard</span>
        </Link>
        <h1 className="nova-page-title">
          <Trophy size={22} className="text-yellow-400" />
          <span>Bảng Xếp Hạng Tuần</span>
        </h1>
      </div>

      {/* Hero Champion Card */}
      <div className="nova-champ-card">
        <div className="nova-champ-crown">👑</div>
        <div className="nova-champ-title">QUÁN QUÂN TUẦN NÀY</div>
        <div className="nova-champ-name">{leaderboard[0].name}</div>
        <div className="nova-champ-coins">
          <Sparkles size={13} className="text-amber-400" />
          <span>{leaderboard[0].coins.toLocaleString("vi-VN")} coins tích lũy</span>
        </div>
        <p className="nova-champ-hint">
          BXH tự động chốt và trao thưởng Giftcode / VIP Key vào 00:00 mỗi Chủ Nhật!
        </p>
      </div>

      {/* Danh sách bảng xếp hạng */}
      <div className="nova-lb-list">
        {leaderboard.map((item) => (
          <div
            key={item.rank}
            className={`nova-lb-row rank-${item.rank} ${item.isMe ? "is-me" : ""}`}
          >
            <div className="nova-lb-rank-col">{getRankMedal(item.rank)}</div>
            <div className="nova-lb-info-col">
              <div className="nova-lb-name">
                <span>{item.name}</span>
                {item.isMe && <span className="nova-lb-me-tag">Bạn</span>}
              </div>
              <div className="nova-lb-keys">{item.keysCount} mã key đã lấy</div>
            </div>
            <div className="nova-lb-coins-col">
              <span className="nova-lb-coins-val">{item.coins.toLocaleString("vi-VN")}</span>
              <span className="nova-lb-coins-lbl">coins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
