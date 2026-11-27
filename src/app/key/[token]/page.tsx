import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { AOV_TICKET_COOKIE, fingerprint, generateKey, hashKey, verifyAovTickets } from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import CopyKey from "@/components/CopyKey";
import FocusedFlowShell from "@/components/FocusedFlowShell";

export const dynamic = "force-dynamic";

function Fail({ msg }: { msg: string }) {
  return (
    <FocusedFlowShell title="Thông báo" backHref="/" backLabel="Trang chủ" maxWidth={440}>
      <div style={{ textAlign: "center" }}>
        <p className="vt-hint" style={{ marginBottom: 18 }}>
          {msg}
        </p>
        <Link className="pro-btn-secondary" href="/">
          <span>Về trang chính</span>
        </Link>
      </div>
    </FocusedFlowShell>
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
      <FocusedFlowShell backHref="/aov" backLabel="Đấu trường AOV" maxWidth={520}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎟️</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "#4ec9b0" }}>
            Nhận vé AOV thành công!
          </h1>
          <p style={{ fontSize: 13.5, color: "#cccccc", lineHeight: 1.6, margin: "0 0 18px" }}>
            Bạn đã vượt link hoàn tất. Hệ thống đã cộng <b>+1 Vé Tham Gia</b> vào phiên của bạn.
          </p>

          <div
            style={{
              background: "#181818",
              border: "1px solid #333333",
              borderRadius: 8,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 11.5, color: "#9d9d9d", fontWeight: 600 }}>VÉ VỪA NHẬN</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#4ec9b0" }}>+1 Vé</div>
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "#9d9d9d", fontWeight: 600 }}>TỔNG VÉ HIỆN TẠI</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#dcdcaa" }}>{updatedTickets} Vé</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href="/aov"
              className="pro-btn-primary"
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              <span>Vào Đấu Trường AOV dùng vé ngay</span>
            </Link>
          </div>
        </div>
      </FocusedFlowShell>
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
    <FocusedFlowShell
      title="Key của bạn"
      subtitle={`${s.keyType.name}${s.app ? ` — ${s.app.name}` : ""}`}
      backHref={s.app ? "/" : "/freefire"}
      backLabel={s.app ? "Trang chủ" : "Free Fire"}
      maxWidth={480}
    >
      <CopyKey value={plain} />

      <p className="vt-hint" style={{ marginTop: 12, lineHeight: 1.6 }}>
        Hạn sống (TTL): {expiresAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
        <br />
        {s.keyType.maxUses > 0
          ? `Số lượt dùng: Tối đa ${s.keyType.maxUses} lần (chạy song song với TTL, hết hạn hoặc hết lượt là Key hết hiệu lực).`
          : "Số lượt dùng: Không giới hạn (trong thời hạn TTL)."}
        <br />
        <strong>Lưu ý: Hãy sao chép lại mã Key để sử dụng.</strong>
      </p>

      {s.app ? (
        <Link className="pro-btn-primary" href="/" style={{ marginTop: 14, width: "100%", boxSizing: "border-box" }}>
          Về trang chính nhập key
        </Link>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <Link
            className="pro-btn-primary"
            href={`/freefire/result?unlockedKey=${encodeURIComponent(plain)}`}
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            Mở Khóa &amp; Xem Độ Nhạy Free Fire Ngay
          </Link>
          <Link className="pro-btn-secondary" href="/freefire" style={{ width: "100%", boxSizing: "border-box" }}>
            Về trang tra cứu Free Fire
          </Link>
        </div>
      )}
    </FocusedFlowShell>
  );
}
