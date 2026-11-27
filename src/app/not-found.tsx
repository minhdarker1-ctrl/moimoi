import Link from "next/link";
import FocusedFlowShell from "@/components/FocusedFlowShell";

export default function NotFound() {
  return (
    <FocusedFlowShell maxWidth={440}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          404
        </div>
        <p className="vt-hint" style={{ marginTop: 8, marginBottom: 18 }}>
          Trang này không tồn tại hoặc đường dẫn đã được thay đổi.
        </p>
        <Link className="pro-btn-primary" href="/">
          <i className="fa-solid fa-house" aria-hidden="true" />
          <span>Về trang chính</span>
        </Link>
      </div>
    </FocusedFlowShell>
  );
}
