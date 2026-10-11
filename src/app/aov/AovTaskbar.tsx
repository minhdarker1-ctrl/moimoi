"use client";

import { Ticket, Package, Sparkles } from "lucide-react";

interface AovTaskbarProps {
  tickets: number;
  inventoryCount: number;
  onOpenInventory: () => void;
  onGetTicketClick: () => void;
  isStartingHop?: boolean;
}

export default function AovTaskbar({
  tickets,
  inventoryCount,
  onOpenInventory,
  onGetTicketClick,
  isStartingHop,
}: AovTaskbarProps) {
  return (
    <header className="aov-taskbar">
      <div className="aov-taskbar-inner">
        {/* Brand / Logo */}
        <div className="aov-brand">
          <div className="aov-brand-icon">
            <Sparkles size={18} className="text-amber-400" />
          </div>
          <div className="aov-brand-info">
            <span className="aov-brand-title">AOV ARENA</span>
            <span className="aov-brand-sub">ĐẤU TRƯỜNG LIÊN QUÂN</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="aov-actions">
          {/* Huy hiệu số vé */}
          <div
            className="aov-ticket-badge"
            title="Số vé của bạn (dùng để xé túi mù hoặc quay vòng quay)"
          >
            <Ticket size={16} className="text-amber-400" />
            <span className="aov-ticket-num">{tickets}</span>
            <span className="aov-ticket-lbl">VÉ</span>
          </div>

          {/* Nút Lấy Vé Nhanh */}
          <button
            type="button"
            className="aov-btn-get-ticket"
            onClick={onGetTicketClick}
            disabled={isStartingHop}
            title="Vượt link nhận thêm vé tham gia"
          >
            <span className="aov-btn-text">
              {isStartingHop ? "Đang tạo link..." : "⚡ LẤY THÊM VÉ"}
            </span>
          </button>

          {/* Túi Đồ */}
          <button
            type="button"
            className="aov-btn-inventory"
            onClick={onOpenInventory}
            title="Xem kho tài khoản đã trúng thưởng"
          >
            <Package size={16} />
            <span className="hidden-xs">Kho Acc</span>
            <span className="aov-inv-count">{inventoryCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
