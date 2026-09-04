import Link from "next/link";

export default async function KeyError({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const message = m?.slice(0, 300) || "Đã xảy ra lỗi không xác định trong quá trình vượt link.";

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="vt-key-card" style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ margin: "10px auto 16px" }}>
          <i
            className="fas fa-exclamation-triangle"
            style={{ fontSize: 48, color: "#f59e0b" }}
          />
        </div>

        <h1 style={{ fontSize: 20, margin: "0 0 10px", fontWeight: 800 }}>
          Không thể hoàn tất phiên Get Key
        </h1>

        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: 12,
            color: "#ef4444",
            fontSize: 14,
            fontWeight: 600,
            margin: "0 0 18px",
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        <div
          style={{
            textAlign: "left",
            fontSize: 13,
            color: "var(--vi-muted)",
            background: "var(--vi-bg)",
            padding: "14px 16px",
            borderRadius: 12,
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--vi-text)", display: "block", marginBottom: 6 }}>
            💡 Hướng dẫn khắc phục:
          </strong>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Không dùng VPN, Proxy hoặc phần mềm chặn quảng cáo khi vượt link.</li>
            <li>Phiên vượt link chỉ hợp lệ trên cùng 1 thiết bị và trình duyệt.</li>
            <li>Nếu cổng bị quá tải, hãy quay lại trang chủ và bấm Get Key lại.</li>
          </ul>
        </div>

        <div className="vt-actions" style={{ justifyContent: "center", gap: 10 }}>
          <Link href="/" className="vt-btn-primary">
            <i className="fas fa-home" />
            <span>Về trang chính</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
