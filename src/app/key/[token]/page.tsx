import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { fingerprint, generateKey, hashKey } from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import CopyKey from "@/components/CopyKey";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function Fail({ msg }: { msg: string }) {
  return (
    <main>
      <div className="vt-key-card">
        <h1 style={{ fontSize: 19, margin: "0 0 8px" }}>Không lấy được key</h1>
        <p className="vt-hint">{msg}</p>
        <Link className="vt-btn-ghost" href="/" style={{ marginTop: 14 }}>
          Về trang chính
        </Link>
      </div>
    </main>
  );
}

export default async function KeyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const s = await db.keySession.findUnique({
    where: { token },
    include: { keyType: true, app: true },
  });
  if (!s) return <Fail msg="Phiên không tồn tại." />;
  if (s.expiresAt < new Date()) return <Fail msg="Phiên đã hết hạn. Bấm Get Key lại." />;
  if (s.doneAt) return <Fail msg="Phiên này đã lấy key rồi. Bấm Get Key để lấy key mới." />;

  const h = await headers();
  const ip = clientIp(h);
  if (s.ipHash !== fingerprint(ip)) return <Fail msg="Phiên không khớp thiết bị." />;

  // Phải vượt đủ số cổng: step đếm từ 0, lớp cuối không có checkpoint riêng.
  const need = Math.max(1, Math.min(s.keyType.steps, 8)) - 1;
  if (s.step < need) {
    return <Fail msg={`Bạn chưa vượt đủ ${need + 1} bước. Bấm Get Key để làm lại.`} />;
  }

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
    // Đánh dấu xong: reload trang không sinh key thứ hai.
    db.keySession.update({ where: { id: s.id }, data: { doneAt: new Date() } }),
    db.freeFireKeyLog.updateMany({ where: { token: s.token }, data: { status: "completed" } }),
  ]);

  const currentUser = await getCurrentUser();
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
            💡 <Link href="/login" style={{ color: "#6366f1", fontWeight: 700 }}>Đăng nhập</Link> để tự động lưu các mã key vào tài khoản của bạn.
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
