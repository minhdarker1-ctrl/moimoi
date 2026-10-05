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

  // Nếu là phiên AOV và đã hoàn thành trước đó: kiểm tra xem có acc đã gán token này không
  if (isAov && s.doneAt) {
    const claimedBefore = await db.gameAccount.findMany({
      where: { token: s.token },
      orderBy: { id: "asc" },
    });
    if (claimedBefore.length > 0) {
      return (
        <main>
          <div className="vt-key-card" style={{ maxWidth: 540 }}>
            <h1 style={{ fontSize: 22, margin: "0 0 4px", color: "#38bdf8" }}>
              ⚔️ Nick Liên Quân Mobile Của Bạn
            </h1>
            <p className="vt-hint" style={{ marginBottom: 12 }}>
              Tài khoản Garena trắng thông tin đã được phát thành công cho bạn.
            </p>
            <CopyAovAccount accounts={claimedBefore} />
          </div>
        </main>
      );
    }
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

  // === NHÁNH 1: NHẬN ACC LIÊN QUÂN (AOV) ===
  if (isAov) {
    const aovConfig = await db.aovConfig.findUnique({ where: { id: 1 } });
    // Tỷ lệ 10% may mắn trúng Túi Mù nhận 5 tài khoản cùng lúc, 90% nhận 1 tài khoản
    const countToClaim = aovConfig?.blindBoxEnabled && Math.random() < 0.1 ? 5 : 1;

    const available = await db.gameAccount.findMany({
      where: { game: "AOV", status: "AVAILABLE" },
      take: countToClaim,
      orderBy: { id: "asc" },
    });

    if (available.length === 0) {
      return <Fail msg="Kho tài khoản Liên Quân hiện đang tạm hết. Admin đang nạp thêm acc, vui lòng quay lại sau ít phút!" />;
    }

    await db.$transaction([
      db.gameAccount.updateMany({
        where: { id: { in: available.map((a) => a.id) } },
        data: {
          status: "CLAIMED",
          claimedBy: ip,
          claimedAt: new Date(),
          token: s.token,
        },
      }),
      db.keySession.update({ where: { id: s.id }, data: { doneAt: new Date() } }),
      db.serviceUsageLog.create({
        data: {
          userId: currentUser?.id ?? null,
          serviceType: "AOV",
          serviceName: "Tặng Nick Liên Quân",
          targetUser: available[0].username,
          ip,
          status: "SUCCESS",
          metadata: JSON.stringify({
            accounts: available.map((a) => a.username),
            count: available.length,
          }),
        },
      }),
    ]);

    return (
      <main>
        <div className="vt-key-card" style={{ maxWidth: 540 }}>
          <h1 style={{ fontSize: 22, margin: "0 0 4px", color: "#38bdf8" }}>
            🎉 Chúc Mừng Bạn Nhận Acc Thành Công!
          </h1>
          <p className="vt-hint" style={{ marginBottom: 12 }}>
            {available.length > 1
              ? `🎁 BẠN ĐÃ MỞ TRÚNG TÚI MÙ MAY MẮN: NHẬN ĐƯỢC ${available.length} TÀI KHOẢN VIP!`
              : "Tài khoản Garena Liên Quân Mobile 100% trắng thông tin."}
          </p>
          <CopyAovAccount accounts={available} />
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
