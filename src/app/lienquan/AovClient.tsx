"use client";

import { useState } from "react";
import Link from "next/link";

interface RecentLog {
  targetUser: string;
  createdAt: string;
  status: string;
}

interface AovClientProps {
  availableStock: number;
  claimedStock: number;
  blindBoxEnabled: boolean;
  notice: string;
  recentLogs: RecentLog[];
}

export default function AovClient({
  availableStock,
  claimedStock,
  blindBoxEnabled,
  notice,
  recentLogs,
}: AovClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartClaim = async () => {
    if (availableStock <= 0) {
      setError("Kho tài khoản Liên Quân hiện đang tạm hết. Admin đang nạp thêm, vui lòng quay lại sau ít phút!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/getkey/start?scope=aov&format=json", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Lỗi kết nối máy chủ (${res.status}). Vui lòng thử lại!`);
      }

      const redirectUrl = data?.firstHopUrl || data?.url;
      if (!res.ok || !data?.ok || !redirectUrl) {
        throw new Error(data?.error || "Không thể tạo phiên nhận acc. Vui lòng thử lại sau ít phút!");
      }

      // Chuyển hướng người dùng đến cổng vượt link
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại!";
      setError(msg);
      setLoading(false);
    }
  };

  const maskUsername = (u: string) => {
    if (!u) return "garena_***";
    if (u.length <= 4) return u.slice(0, 1) + "***";
    return u.slice(0, 3) + "***" + u.slice(-2);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Hero Banner */}
      <div className="mdarker-lq-hero" style={{ padding: "36px 20px 28px", marginBottom: 28 }}>
        <div className="mdarker-lq-badge" style={{ background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#0284c7" }}>
          <i className="fa-solid fa-gift" aria-hidden="true" />
          <span>KHO ACC LIÊN QUÂN GARENA TRẮNG THÔNG TIN</span>
        </div>
        <h1 className="mdarker-lq-title" style={{ fontSize: 32, marginTop: 12 }}>
          TẶNG NICK LIÊN QUÂN <span>MIỄN PHÍ</span>
        </h1>
        <p className="mdarker-lq-desc" style={{ fontSize: 14.5, maxWidth: 620 }}>
          Hệ thống phát tài khoản Liên Quân Mobile hoàn toàn miễn phí. Hỗ trợ game thủ trải nghiệm skin xịn, test bản đồ và leo rank cùng bạn bè.
        </p>

        {/* Chỉ hiển thị Card Cơ chế sự kiện */}
        <div
          style={{
            marginTop: 22,
            maxWidth: 320,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              background: "var(--vi-card)",
              border: "1px solid var(--vi-border)",
              borderRadius: 18,
              padding: "14px 24px",
              boxShadow: "var(--vi-shadow-sm)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--vi-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ✨ CƠ CHẾ SỰ KIỆN
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span>{blindBoxEnabled ? "📦 Túi mù x5 Acc" : "🎯 Nhận 1 Acc"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Claim Card */}
      <div
        style={{
          background: "var(--vi-card)",
          border: "1px solid var(--vi-border)",
          borderRadius: 24,
          padding: "32px 24px",
          boxShadow: "var(--vi-shadow)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          marginBottom: 36,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 140,
            height: 140,
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ fontSize: 56, marginBottom: 16, filter: "drop-shadow(0 4px 12px rgba(99, 102, 241, 0.3))" }}>
          🎁
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "var(--vi-text)" }}>
          Nhận Tài Khoản Garena Liên Quân Ngay
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "var(--vi-muted)",
            maxWidth: 520,
            margin: "0 auto 20px",
            lineHeight: 1.6,
          }}
        >
          {notice || "Mỗi bạn nhận tối đa 1 acc / lượt vượt link. Vui lòng kiểm tra và đổi mật khẩu sau khi nhận tại account.garena.com."}
        </p>

        {blindBoxEnabled && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px dashed rgba(245, 158, 11, 0.4)",
              borderRadius: 12,
              padding: "8px 16px",
              color: "#d97706",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            <i className="fa-solid fa-sparkles" aria-hidden="true" />
            <span>Đặc biệt: Tỷ lệ 10% trúng <b>Túi Mù May Mắn</b> (Nhận ngay 5 Acc cùng lúc)!</span>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              borderRadius: 12,
              padding: "10px 16px",
              fontSize: 13.5,
              marginBottom: 20,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: 6 }} />
            {error}
          </div>
        )}

        <div>
          <button
            onClick={handleStartClaim}
            disabled={loading || availableStock <= 0}
            style={{
              background:
                availableStock <= 0
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #6366f1 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: 16,
              padding: "14px 36px",
              fontSize: 16,
              fontWeight: 800,
              cursor: availableStock <= 0 || loading ? "not-allowed" : "pointer",
              boxShadow:
                availableStock <= 0
                  ? "none"
                  : "0 8px 24px rgba(56, 189, 248, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Đang khởi tạo cổng nhận...</span>
              </>
            ) : availableStock <= 0 ? (
              <>
                <i className="fa-solid fa-box-open" />
                <span>Kho acc đang tạm hết</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt" />
                <span>VƯỢT LINK NHẬN ACC NGAY</span>
              </>
            )}
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--vi-muted)" }}>
          <i className="fa-solid fa-shield-check" style={{ color: "#10b981", marginRight: 4 }} />
          Bảo mật tuyệt đối • Tự động hoàn toàn • Hoàn thành nhiệm vụ nhận ngay mã đăng nhập
        </div>
      </div>

      {/* 4 Feature Highlights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "20px 18px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <div style={{ fontSize: 24, color: "#0284c7", marginBottom: 10 }}>
            <i className="fa-solid fa-id-card-clip" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--vi-text)" }}>
            100% Trắng Thông Tin
          </h3>
          <p style={{ fontSize: 13, color: "var(--vi-muted)", margin: 0, lineHeight: 1.5 }}>
            Tài khoản Garena chưa gắn SĐT hoặc Email xác thực, an tâm test game không sợ tranh chấp.
          </p>
        </div>

        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "20px 18px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <div style={{ fontSize: 24, color: "#f59e0b", marginBottom: 10 }}>
            <i className="fa-solid fa-box-archive" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--vi-text)" }}>
            Hộp Quà Túi Mù
          </h3>
          <p style={{ fontSize: 13, color: "var(--vi-muted)", margin: 0, lineHeight: 1.5 }}>
            Hệ thống ngẫu nhiên tặng tới 5 tài khoản VIP cho những bạn may mắn vượt link.
          </p>
        </div>

        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "20px 18px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <div style={{ fontSize: 24, color: "#10b981", marginBottom: 10 }}>
            <i className="fa-solid fa-copy" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--vi-text)" }}>
            1-Click Copy Mật Khẩu
          </h3>
          <p style={{ fontSize: 13, color: "var(--vi-muted)", margin: 0, lineHeight: 1.5 }}>
            Giao diện trực quan cho phép sao chép nhanh ID và Pass, nút chuyển thẳng đến trang chủ Garena.
          </p>
        </div>

        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 18,
            padding: "20px 18px",
            boxShadow: "var(--vi-shadow-sm)",
          }}
        >
          <div style={{ fontSize: 24, color: "#a855f7", marginBottom: 10 }}>
            <i className="fa-solid fa-arrows-rotate" />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--vi-text)" }}>
            Cập Nhật Hàng Ngày
          </h3>
          <p style={{ fontSize: 13, color: "var(--vi-muted)", margin: 0, lineHeight: 1.5 }}>
            Admin liên tục lọc và nạp thêm tài khoản mới từ kho hàng trăm nghìn nick Garena.
          </p>
        </div>
      </div>

      {/* Guide Steps */}
      <div
        style={{
          background: "var(--vi-card)",
          border: "1px solid var(--vi-border)",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "var(--vi-shadow-sm)",
          marginBottom: 36,
        }}
      >
        <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 8 }}>
          <i className="fa-solid fa-circle-question" style={{ color: "#0284c7" }} />
          Hướng Dẫn Nhận Tài Khoản Qua 3 Bước
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: 13 }}>
              1
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--vi-text)" }}>Nhấn Bắt Đầu</div>
              <div style={{ fontSize: 13, color: "var(--vi-muted)", marginTop: 2 }}>
                Bấm vào nút &quot;Vượt link nhận acc ngay&quot; để tạo phiên nhận quà.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: 13 }}>
              2
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--vi-text)" }}>Vượt Link An Toàn</div>
              <div style={{ fontSize: 13, color: "var(--vi-muted)", marginTop: 2 }}>
                Làm theo hướng dẫn (tìm mã Google / chờ đếm giây) để xác minh người thật.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0, fontSize: 13 }}>
              3
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--vi-text)" }}>Nhận Acc & Chơi Ngay</div>
              <div style={{ fontSize: 13, color: "var(--vi-muted)", marginTop: 2 }}>
                Màn hình sẽ hiển thị tài khoản + mật khẩu Garena để bạn đăng nhập liền tay.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Feed */}
      {recentLogs.length > 0 && (
        <div
          style={{
            background: "var(--vi-card)",
            border: "1px solid var(--vi-border)",
            borderRadius: 20,
            padding: "20px",
            boxShadow: "var(--vi-shadow-sm)",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--vi-text)", display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fa-solid fa-clock-rotate-left" style={{ color: "#10b981" }} />
              Nhật Ký Nhận Acc Gần Đây
            </h4>
            <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>● Trực tiếp</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {recentLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(0, 0, 0, 0.03)",
                  borderRadius: 12,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12.5,
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--vi-text)", fontFamily: "monospace" }}>
                  {maskUsername(log.targetUser)}
                </span>
                <span style={{ color: "var(--vi-muted)", fontSize: 11.5 }}>
                  {timeAgo(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notice & Disclaimer */}
      <div
        style={{
          background: "rgba(245, 158, 11, 0.05)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: 16,
          padding: "16px 20px",
          fontSize: 13,
          color: "var(--vi-muted)",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#d97706" }}>
          ⚠️ LƯU Ý VỀ TÀI KHOẢN TẶNG MIỄN PHÍ:
        </p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Tài khoản phục vụ mục đích trải nghiệm skin, test tướng, làm sự kiện hoặc thử nghiệm mẹo chơi.</li>
          <li>Để giữ tài khoản cho riêng bạn lâu dài, vui lòng truy cập <b>account.garena.com</b> để thêm thông tin bảo mật.</li>
          <li>Nghiêm cấm hành vi sử dụng tài khoản vào các mục đích lừa đảo hoặc vi phạm điều khoản dịch vụ của nhà phát hành.</li>
        </ul>
      </div>
    </div>
  );
}
