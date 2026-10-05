import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { fingerprint, generateKey, hashKey } from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import CopyKey from "@/components/CopyKey";
import CopyAovAccount from "@/components/CopyAovAccount";
import { getCurrentUser } from "@/lib/auth";

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

  const s = await db.keySession.findUnique({
    where: { token },
    include: { keyType: true, app: true },
  });
  if (!s) return <Fail msg="Phiên không tồn tại hoặc đã hết hạn." />;
  if (s.expiresAt < new Date()) return <Fail msg="Phiên đã hết hạn. Vui lòng bấm nhận lại." />;

  const isAov = sp.scope === "aov" || s.hopUrls.includes("scope=aov");

  // Nếu là phiên AOV và đã hoàn thành trước đó:
  if (isAov && s.doneAt) {
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
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
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

  const currentUser = await getCurrentUser();

  // === NHÁNH 1: NHẬN VÉ LIÊN QUÂN (AOV TICKET) ===
  if (isAov) {
    let updatedTickets = 1;

    if (currentUser) {
      const updatedUser = await db.user.update({
        where: { id: currentUser.id },
        data: { aovTickets: { increment: 1 } },
        select: { aovTickets: true, username: true },
      });
      updatedTickets = updatedUser.aovTickets;
    }

    await db.$transaction([
      db.keySession.update({ where: { id: s.id }, data: { doneAt: new Date() } }),
      db.serviceUsageLog.create({
        data: {
          userId: currentUser?.id ?? null,
          serviceType: "AOV_TICKET",
          serviceName: "Nạp Vé Đấu Trường AOV",
          targetUser: currentUser?.username ?? ip,
          ip,
          status: "SUCCESS",
          metadata: JSON.stringify({
            ticketsAwarded: 1,
            totalTickets: updatedTickets,
            username: currentUser?.username ?? "Khách",
          }),
        },
      }),
    ]);

    return (
      <main>
        <div
          className="vt-key-card"
          style={{
            maxWidth: 540,
            textAlign: "center",
            background: "linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))",
            border: "1.5px solid rgba(56, 189, 248, 0.4)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4), 0 0 30px rgba(56, 189, 248, 0.2)",
            borderRadius: 24,
            padding: "36px 24px",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 12, filter: "drop-shadow(0 0 16px rgba(245, 158, 11, 0.6))" }}>
            🎟️
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", color: "#38bdf8" }}>
            NHẬN VÉ AOV THÀNH CÔNG!
          </h1>
          <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 20px" }}>
            Bạn đã vượt link xuất sắc! Hệ thống đã cộng <b>+1 Vé Tham Gia</b> vào tài khoản{" "}
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>
              {currentUser ? `@${currentUser.username}` : "của bạn"}
            </span>.
          </p>

          <div
            style={{
              background: "rgba(56, 189, 248, 0.08)",
              border: "1px dashed rgba(56, 189, 248, 0.3)",
              borderRadius: 16,
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>VÉ VỪA NHẬN</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#10b981" }}>+1 Vé</div>
            </div>
            {currentUser && (
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>TỔNG VÉ HIỆN TẠI</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b" }}>{updatedTickets} Vé</div>
              </div>
            )}
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
                padding: "14px 28px",
                fontSize: 16,
                fontWeight: 800,
                borderRadius: 14,
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
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

  await db.$transaction([
    db.appKey.create({
      data: {
        keyHash: hashKey(plain),
        prefix: plain.slice(0, 4),
        keyTypeId: s.keyTypeId,
        appId: s.appId,
        expiresAt,
        maxUses: s.keyType.maxUses,
      },
    }),
    db.keySession.update({ where: { id: s.id }, data: { doneAt: new Date() } }),
    db.freeFireKeyLog.updateMany({ where: { token: s.token }, data: { status: "completed" } }),
  ]);

  if (currentUser) {
    await db.userSavedKey.create({
      data: {
        userId: currentUser.id,
        appName: s.app ? s.app.name : (s.keyType ? s.keyType.name : "Free Fire"),
        key: plain,
        expiresAt,
      },
    }).catch(() => {});
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

        {currentUser ? (
          <div className="dash-alert dash-alert-success" style={{ margin: "14px 0 6px", fontSize: 13 }}>
            <span>✅ Mã key này đã được tự động lưu vào <Link href="/dashboard/keys" style={{ color: "inherit", textDecoration: "underline" }}>Dashboard của bạn</Link>!</span>
          </div>
        ) : (
          <p className="vt-hint" style={{ marginTop: 10 }}>
            💡 Hãy sao chép và cất giữ mã key cẩn thận để kích hoạt dịch vụ của bạn.
          </p>
        )}

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
