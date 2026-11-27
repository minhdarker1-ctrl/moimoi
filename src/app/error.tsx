"use client";

import { useEffect } from "react";
import Link from "next/link";
import FocusedFlowShell from "@/components/FocusedFlowShell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js error boundary caught:", error);
  }, [error]);

  return (
    <FocusedFlowShell
      title="Có lỗi xảy ra"
      subtitle="Hệ thống đang gặp sự cố tạm thời. Vui lòng thử tải lại trang."
      maxWidth={460}
    >
      <div style={{ textAlign: "center" }}>
        {process.env.NODE_ENV !== "production" && error?.message && (
          <p
            style={{
              fontSize: 12,
              color: "#f48771",
              fontFamily: "monospace",
              marginBottom: 14,
              background: "#181818",
              border: "1px solid #333333",
              borderRadius: 8,
              padding: "10px 12px",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </p>
        )}
        <div className="vt-actions" style={{ justifyContent: "center" }}>
          <button className="pro-btn-primary" type="button" onClick={reset}>
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            <span>Thử lại</span>
          </button>
          <Link className="pro-btn-secondary" href="/">
            <span>Về trang chính</span>
          </Link>
        </div>
      </div>
    </FocusedFlowShell>
  );
}

