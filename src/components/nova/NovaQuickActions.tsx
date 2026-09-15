"use client";

import Link from "next/link";
import { Zap, Layers, Dices, Trophy, KeyRound, Share2 } from "lucide-react";

export default function NovaQuickActions() {
  const actions = [
    {
      href: "/freefire",
      label: "Lấy Key Free Fire",
      icon: <Zap size={22} className="text-amber-400" />,
      highlight: true,
    },
    {
      href: "/all",
      label: "Kho Game / App",
      icon: <Layers size={22} className="text-sky-400" />,
    },
    {
      href: "/dashboard/spin",
      label: "Vòng Quay Thưởng",
      icon: <Dices size={22} className="text-pink-400" />,
    },
    {
      href: "/dashboard/leaderboard",
      label: "Bảng Xếp Hạng",
      icon: <Trophy size={22} className="text-yellow-400" />,
    },
    {
      href: "/dashboard/keys",
      label: "Key Đã Lưu",
      icon: <KeyRound size={22} className="text-emerald-400" />,
    },
    {
      href: "/dashboard/referral",
      label: "Mời Bạn Bè",
      icon: <Share2 size={22} className="text-indigo-400" />,
    },
  ];

  return (
    <div className="nova-acts-grid">
      {actions.map((act) => (
        <Link
          key={act.href}
          href={act.href}
          className={`nova-act-card ${act.highlight ? "highlight" : ""}`}
        >
          <span className="nova-act-icon">{act.icon}</span>
          <span className="nova-act-name">{act.label}</span>
        </Link>
      ))}
    </div>
  );
}
