import Link from "next/link";

export default async function KeyError({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>Không lấy được key</h1>
        <p className="vt-hint">{m?.slice(0, 200) || "Có lỗi xảy ra."}</p>
        <Link className="vt-btn-primary" href="/" style={{ marginTop: 14 }}>
          Về trang chính
        </Link>
      </div>
    </main>
  );
}
