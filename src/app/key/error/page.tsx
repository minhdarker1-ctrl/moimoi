import Link from "next/link";
import FocusedFlowShell from "@/components/FocusedFlowShell";

export default async function KeyError({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const message = m?.slice(0, 300) || "Đã xảy ra lỗi không xác định trong quá trình vượt link.";

  return (
    <FocusedFlowShell
      title="Không thể hoàn tất phiên Get Key"
      backHref="/"
      backLabel="Trang chủ"
      maxWidth={480}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ margin: "4px auto 14px" }}>
          <i
            className="fas fa-exclamation-triangle"
            style={{ fontSize: 38, color: "#f59e0b" }}
          />
        </div>

        <div
          style={{
            padding: "12px 14px",
            background: "rgba(244, 135, 113, 0.1)",
            border: "1px solid rgba(244, 135, 113, 0.28)",
            borderRadius: 8,
            color: "#f48771",
            fontSize: 13.5,
            fontWeight: 600,
            margin: "0 0 16px",
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        <div
          style={{
            textAlign: "left",
            fontSize: 13,
            color: "#9d9d9d",
            background: "#181818",
            border: "1px solid #333333",
            padding: "14px 16px",
            borderRadius: 8,
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#ffffff", display: "block", marginBottom: 6 }}>
            Hướng dẫn khắc phục:
          </strong>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Không dùng VPN, Proxy hoặc phần mềm chặn quảng cáo khi vượt link.</li>
            <li>Phiên vượt link chỉ hợp lệ trên cùng 1 thiết bị và trình duyệt.</li>
            <li>Nếu cổng bị quá tải, hãy quay lại trang chủ và bấm Get Key lại.</li>
          </ul>
        </div>

        <div className="vt-actions" style={{ justifyContent: "center", gap: 10 }}>
          <Link href="/" className="pro-btn-primary">
            <i className="fas fa-home" />
            <span>Về trang chính</span>
          </Link>
        </div>
      </div>
    </FocusedFlowShell>
  );
}
