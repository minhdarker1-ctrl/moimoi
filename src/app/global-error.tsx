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
          background: "#1e1e1e",
          color: "#cccccc",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 420,
            padding: 28,
            borderRadius: 12,
            background: "#252526",
            border: "1px solid #333333",
          }}
        >
          <h1 style={{ fontSize: 20, margin: "0 0 8px", color: "#ffffff" }}>Hệ thống đang bảo trì</h1>
          <p style={{ color: "#9d9d9d", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Vui lòng thử lại sau vài phút.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 18,
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid rgba(55, 148, 255, 0.45)",
              background: "#007acc",
              color: "#ffffff",
              fontWeight: 600,
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
