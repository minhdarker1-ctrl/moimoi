"use client";

// Bắt lỗi xảy ra trong chính layout (VD: DB sập lúc generateMetadata).
// File này phải tự render <html>/<body> vì layout gốc đã fail.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0f19",
          color: "#e8ecf4",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Hệ thống đang bảo trì</h1>
          <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.6 }}>
            Vui lòng thử lại sau vài phút.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              borderRadius: 10,
              border: 0,
              background: "linear-gradient(90deg,#7c5cff,#22d3ee)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
