"use client";

import { Ticket, Package, Sparkles } from "lucide-react";

interface AovTaskbarProps {
  tickets: number;
  inventoryCount: number;
  availableStock?: number;
  claimedStock?: number;
  onOpenInventory: () => void;
  onGetTicketClick: () => void;
  isStartingHop?: boolean;
  isAdmin?: boolean;
}

export default function AovTaskbar({
  tickets,
  inventoryCount,
  availableStock,
  claimedStock,
  onOpenInventory,
  onGetTicketClick,
  isStartingHop,
  isAdmin = false,
}: AovTaskbarProps) {
  return (
    <div className="aov-control-bar">
      <div className="aov-control-stats">
        <div
          className={`aov-ticket-badge ${isAdmin ? "admin-badge" : ""}`}
          title={isAdmin ? "Đặc quyền Admin: Vô hạn vé trải nghiệm" : "Số vé của bạn (dùng để xé túi mù hoặc quay vòng quay)"}
        >
          <Ticket size={15} style={{ color: "#fbbf24" }} />
          <span className="aov-ticket-num">{isAdmin ? "∞" : tickets}</span>
          <span className="aov-ticket-lbl">{isAdmin ? "VIP ADMIN" : "VÉ"}</span>
        </div>

        {typeof availableStock === "number" && (
          <div className="aov-stock-pill" title="Số tài khoản còn trong kho">
            <Sparkles size={13} style={{ color: "#4ec9b0" }} />
            <span>Kho còn <b>{availableStock}</b> acc</span>
            {typeof claimedStock === "number" && (
              <span className="aov-stock-sep">• Đã phát {claimedStock}</span>
            )}
          </div>
        )}
      </div>

      <div className="aov-actions">
        <button
          type="button"
          className={`pro-btn-primary ${isAdmin ? "is-admin" : ""}`}
          onClick={onGetTicketClick}
          disabled={isStartingHop}
          title={isAdmin ? "Đặc quyền Admin: Vô hạn vé" : "Vượt link nhận thêm vé tham gia"}
        >
          <Ticket size={15} />
          <span>
            {isAdmin ? "Vô hạn vé (Admin)" : isStartingHop ? "Đang tạo link..." : "Nhận thêm vé"}
          </span>
        </button>

        <button
          type="button"
          className="pro-btn-secondary"
          onClick={onOpenInventory}
          title="Xem kho tài khoản đã trúng thưởng"
        >
          <Package size={15} />
          <span>Kho Acc</span>
          <span className="aov-inv-count">{inventoryCount}</span>
        </button>
      </div>
    </div>
  );
}
