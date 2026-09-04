"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  // Không hiện error.message: có thể chứa chuỗi kết nối DB hoặc chi tiết nội bộ.
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>Có lỗi xảy ra</h1>
        <p className="vt-hint">
          Hệ thống đang gặp sự cố tạm thời. Thử tải lại trang sau vài giây.
        </p>
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
