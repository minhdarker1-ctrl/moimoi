"use client";

import { Ticket, Package, Sparkles } from "lucide-react";

interface AovTaskbarProps {
  tickets: number;
  inventoryCount: number;
  onOpenInventory: () => void;
  onGetTicketClick: () => void;
  isStartingHop?: boolean;
  isAdmin?: boolean;
}

export default function AovTaskbar({
  tickets,
  inventoryCount,
  onOpenInventory,
  onGetTicketClick,
  isStartingHop,
  isAdmin = false,
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
            className={`aov-ticket-badge ${isAdmin ? "admin-badge" : ""}`}
            style={isAdmin ? { border: "1px solid rgba(245, 158, 11, 0.5)", background: "rgba(245, 158, 11, 0.15)" } : undefined}
            title={isAdmin ? "Đặc quyền Admin: Vô hạn vé trải nghiệm" : "Số vé của bạn (dùng để xé túi mù hoặc quay vòng quay)"}
          >
            <Ticket size={16} className="text-amber-400" />
            <span className="aov-ticket-num" style={isAdmin ? { color: "#fbbf24", fontWeight: 800 } : undefined}>
              {isAdmin ? "9999" : tickets}
            </span>
            <span className="aov-ticket-lbl" style={isAdmin ? { color: "#fbbf24" } : undefined}>
              {isAdmin ? "VÉ (VIP ADMIN)" : "VÉ"}
            </span>
          </div>

          {/* Nút Lấy Vé Nhanh */}
          <button
            type="button"
            className={`aov-btn-get-ticket ${isAdmin ? "admin-mode" : ""}`}
            style={isAdmin ? { background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "1px solid #fbbf24", color: "#ffffff", boxShadow: "0 2px 10px rgba(245, 158, 11, 0.3)" } : undefined}
            onClick={onGetTicketClick}
            disabled={isStartingHop}
            title={isAdmin ? "Đặc quyền Admin: Bạn có vô hạn vé, không cần vượt link" : "Vượt link nhận thêm vé tham gia"}
          >
            <span className="aov-btn-text">
              {isAdmin ? "👑 ADMIN VÔ HẠN VÉ" : isStartingHop ? "Đang tạo link..." : "⚡ LẤY THÊM VÉ"}
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
