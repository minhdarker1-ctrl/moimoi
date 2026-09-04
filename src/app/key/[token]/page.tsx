import Link from "next/link";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { fingerprint, generateKey, hashKey } from "@/lib/crypto";
import { clientIp } from "@/lib/guard";
import CopyKey from "@/components/CopyKey";

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
  ]);

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
          Hết hạn: {expiresAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
          <br />
          {s.keyType.maxUses > 0 ? `Dùng được ${s.keyType.maxUses} lần.` : "Dùng không giới hạn số lần."}
          <br />
          <strong>Key chỉ hiện 1 lần — hãy lưu lại.</strong>
        </p>

        <Link className="vt-btn-primary" href="/" style={{ marginTop: 8 }}>
          Về trang chính nhập key
        </Link>
      </div>
    </main>
  );
}
