"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>Có lỗi xảy ra</h1>
        <p className="vt-hint">
          Hệ thống đang gặp sự cố tạm thời. Thử tải lại trang sau vài giây.
        </p>
        {process.env.NODE_ENV !== "production" && error?.message && (
          <p style={{ fontSize: 12, color: "#ef4444", fontFamily: "monospace", marginTop: 8 }}>
            {error.message}
          </p>
        )}
        <div className="vt-actions" style={{ marginTop: 14, justifyContent: "center" }}>
          <button className="vt-btn-primary" type="button" onClick={reset}>
            Thử lại
          </button>
          <Link className="vt-btn-ghost" href="/">
            Về trang chính
          </Link>
        </div>
      </div>
    </main>
  );
}

