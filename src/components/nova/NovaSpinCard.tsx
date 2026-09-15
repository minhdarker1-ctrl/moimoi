"use client";

import Link from "next/link";
import { Dices, ArrowRight } from "lucide-react";

interface NovaSpinCardProps {
  spinTickets?: number;
  tasksSince?: number;
  bonusTasks?: number;
}

export default function NovaSpinCard({
  spinTickets = 1,
  tasksSince = 1,
  bonusTasks = 3,
}: NovaSpinCardProps) {
  const pct = Math.min(100, Math.round((tasksSince / bonusTasks) * 100));

  return (
    <div className="nova-spin-card">
      <div className="nova-spin-icon-wrap">
        <Dices size={32} className="text-amber-400" />
      </div>

      <div className="nova-spin-info">
        <div className="nova-spin-badges">
          <span className="nova-spin-badge free">🎁 1 Lượt miễn phí hôm nay</span>
          {spinTickets > 0 && (
            <span className="nova-spin-badge tickets">🎟 {spinTickets} Lượt thưởng</span>
          )}
        </div>

        <div className="nova-spin-title">Vòng Quay May Mắn</div>
        <div className="nova-spin-desc">
          Tiến độ nhận thêm lượt: <b>{tasksSince}/{bonusTasks}</b> nhiệm vụ
          <div className="nova-spin-progress-wrap">
            <div
              className="nova-spin-progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <Link href="/dashboard/spin" className="nova-spin-btn">
        <span>Quay ngay!</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
