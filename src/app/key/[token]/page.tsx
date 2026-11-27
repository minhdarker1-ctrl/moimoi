import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { AOV_TICKET_COOKIE, fingerprint, generateKey, hashKey, verifyAovTickets } from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import CopyKey from "@/components/CopyKey";

export const dynamic = "force-dynamic";

function Fail({ msg }: { msg: string }) {
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>Thông báo</h1>
        <p className="vt-hint">{msg}</p>
        <Link className="vt-btn-ghost" href="/" style={{ marginTop: 14 }}>
          Về trang chính
        </Link>
      </div>
    </main>
  );
}

export default async function KeyPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ scope?: string }>;
}) {
  const { token } = await params;
  const sp = searchParams ? await searchParams : {};
  const spTyped = sp as { scope?: string; already?: string };

  const s = await db.keySession.findUnique({
    where: { token },
    include: { keyType: true, app: true },
  });
  if (!s) return <Fail msg="Phiên không tồn tại hoặc đã hết hạn." />;
  if (s.expiresAt < new Date()) return <Fail msg="Phiên đã hết hạn. Vui lòng bấm nhận lại." />;

  const isAov = spTyped.scope === "aov" || s.hopUrls.includes("scope=aov") || s.hopUrls.includes("/api/aov/claim");

  // Nếu là phiên AOV và đã từng claim trước đó (?already=1):
  if (isAov && s.doneAt && spTyped.already === "1") {
    return (
      <main>
        <div className="vt-key-card" style={{ maxWidth: 540, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎟️</div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px", color: "#38bdf8" }}>
            Vé Đã Được Cộng Trước Đó
          </h1>
          <p className="vt-hint" style={{ marginBottom: 20 }}>
            Phiên vượt link này đã cộng vé vào tài khoản của bạn. Hãy đến Đấu Trường AOV để xé Túi Mù hoặc quay Vòng Quay May Mắn!
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link
              href="/aov"
              className="vt-btn-primary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 12,
                background: "#007acc",
              }}
            >
              <span>⚔️ VÀO ĐẤU TRƯỜNG AOV DÙNG VÉ</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (s.doneAt && !isAov) return <Fail msg="Phiên này đã lấy key rồi. Bấm Get Key để lấy key mới." />;

  const h = await headers();
  const ip = clientIp(h);
  if (s.ipHash !== fingerprint(ip)) return <Fail msg="Phiên không khớp thiết bị." />;

  // Phải vượt đủ số cổng: step đếm từ 0, lớp cuối không có checkpoint riêng.
  const need = Math.max(1, Math.min(s.keyType.steps, 8)) - 1;
  if (s.step < need) {
    return <Fail msg={`Bạn chưa vượt đủ ${need + 1} bước nhiệm vụ. Vui lòng thử lại.`} />;
  }

  // === NHÁNH 1: NHẬN VÉ LIÊN QUÂN (AOV TICKET) ===
  if (isAov) {
    // Next.js 15 không cho set cookie trực tiếp trong Server Component render -> chuyển sang Route Handler claim
    if (!s.doneAt) {
      redirect(`/api/aov/claim?token=${encodeURIComponent(token)}`);
    }

    const cookieStore = await cookies();
    const updatedTickets = verifyAovTickets(cookieStore.get(AOV_TICKET_COOKIE)?.value);

    return (
      <main>
        <div
          className="vt-key-card"
          style={{
            maxWidth: 540,
            textAlign: "center",
            background: "#252526",
            border: "1px solid #3c3c3c",
            borderRadius: 12,
            padding: "36px 24px",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎟️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", color: "#4ec9b0" }}>
            NHẬN VÉ AOV THÀNH CÔNG!
          </h1>
          <p style={{ fontSize: 14, color: "#d4d4d4", lineHeight: 1.6, margin: "0 0 20px" }}>
            Bạn đã vượt link xuất sắc! Hệ thống đã tự động cộng <b>+1 Vé Tham Gia</b> vào phiên của bạn.
          </p>

          <div
            style={{
              background: "#1e1e1e",
              border: "1px solid #3c3c3c",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#858585", fontWeight: 600 }}>VÉ VỪA NHẬN</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#4ec9b0" }}>+1 Vé</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#858585", fontWeight: 600 }}>TỔNG VÉ HIỆN TẠI</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#dcdcaa" }}>{updatedTickets} Vé</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/aov"
              className="vt-btn-primary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 8,
                background: "#007acc",
              }}
            >
              <span>⚔️ VÀO ĐẤU TRƯỜNG AOV DÙNG VÉ NGAY</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // === NHÁNH 2: NHẬN KEY THÔNG THƯỜNG / FREE FIRE ===
  const plain = generateKey();
  const expiresAt = new Date(Date.now() + s.keyType.ttlHours * 3600_000);

  const keyIssued = await db.$transaction(async (tx) => {
    const claimed = await tx.keySession.updateMany({
      where: { id: s.id, doneAt: null },
      data: { doneAt: new Date() },
    });
    if (claimed.count === 0) return false;

    await tx.appKey.create({
      data: {
        keyHash: hashKey(plain),
        prefix: plain.slice(0, 4),
        keyTypeId: s.keyTypeId,
        appId: s.appId,
        expiresAt,
        maxUses: s.keyType.maxUses,
      },
    });
    await tx.freeFireKeyLog.updateMany({
      where: { token: s.token },
      data: { status: "completed" },
    });
    return true;
  });

  if (!keyIssued) {
    return <Fail msg="Phiên này đã lấy key rồi. Bấm Get Key để lấy key mới." />;
  }
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 4px" }}>Key của bạn</h1>
        <p className="vt-hint">
          {s.keyType.name}
          {s.app ? ` — ${s.app.name}` : ""}
        </p>

        <CopyKey value={plain} />

        <p className="vt-hint">
          Hạn sống (TTL): {expiresAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
          <br />
          {s.keyType.maxUses > 0
            ? `Số lượt dùng: Tối đa ${s.keyType.maxUses} lần (chạy song song với TTL, hết hạn hoặc hết lượt là Key die).`
            : "Số lượt dùng: Không giới hạn (trong thời hạn TTL)."}
          <br />
          <strong>Lưu ý: Bạn hãy sao chép lại mã Key để sử dụng!</strong>
        </p>

        {s.app ? (
          <Link className="vt-btn-primary" href="/" style={{ marginTop: 8 }}>
            Về trang chính nhập key
          </Link>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            <Link
              className="vt-btn-primary"
              href={`/freefire/result?unlockedKey=${encodeURIComponent(plain)}`}
              style={{ textDecoration: "none", padding: "12px 18px", textAlign: "center" }}
            >
              👉 Mở Khóa & Xem Độ Nhạy Free Fire Ngay
            </Link>
            <Link className="vt-btn-ghost" href="/freefire" style={{ textAlign: "center" }}>
              Về trang tra cứu Free Fire
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
