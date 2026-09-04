import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 40, margin: "0 0 4px" }}>404</h1>
        <p className="vt-hint">Trang này không tồn tại.</p>
        <Link className="vt-btn-primary" href="/" style={{ marginTop: 14 }}>
          Về trang chính
        </Link>
      </div>
    </main>
  );
}
