"use server";

import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { clientIp } from "@/lib/guard";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface ClaimedAovAccount {
  id: number;
  username: string;
  password: string;
  rank: string;
  skins: number;
  champs: number;
  notes: string;
  claimedAt: string | null;
}

/**
 * LẤY SỐ VÉ HIỆN TẠI TỪ COOKIE CỦA KHÁCH HOẶC ĐẶC QUYỀN ADMIN
 */
export async function getAovTicketsAction(): Promise<number> {
  const currentUser = await getCurrentUser().catch(() => null);
  if (currentUser?.role === "ADMIN") {
    return 9999;
  }
  const cookieStore = await cookies();
  const val = cookieStore.get("aov_tickets")?.value;
  return Math.max(0, parseInt(val || "0", 10) || 0);
}

/**
 * XÉ TÚI MÙ (Mystery Blind Bag)
 * Chi phí: 1 Vé (Miễn phí vô hạn cho Admin)
 * Phần thưởng ngẫu nhiên: 1 đến 3 acc Liên Quân Garena
 */
export async function openBlindBagAction(): Promise<
  ActionResult<{ accounts: ClaimedAovAccount[]; remainingTickets: number }>
> {
  const currentUser = await getCurrentUser().catch(() => null);
  const isAdmin = currentUser?.role === "ADMIN";

  const cookieStore = await cookies();
  const currentTickets = Math.max(0, parseInt(cookieStore.get("aov_tickets")?.value || "0", 10) || 0);

  if (!isAdmin && currentTickets < 1) {
    return {
      ok: false,
      error: "Bạn không đủ vé để xé Túi Mù (Cần 1 vé). Hãy bấm 'Lấy Thêm Vé' để vượt link nạp thêm vé nhé!",
    };
  }

  // Kiểm tra số lượng acc khả dụng trong kho
  const availableCount = await db.gameAccount.count({
    where: { game: "AOV", status: "AVAILABLE" },
  });

  if (availableCount <= 0) {
    if (isAdmin) {
      // Đặc quyền Admin: Cấp tài khoản VIP mẫu để test hiệu ứng & giao diện ngay cả khi kho trống
      const now = new Date();
      return {
        ok: true,
        data: {
          accounts: [
            {
              id: 999901,
              username: "admin_vip_aov01",
              password: "•••••••• (Đặc Quyền Admin)",
              rank: "Cao Thủ 50 Sao (Test Admin)",
              skins: 188,
              champs: 118,
              notes: "Tài khoản VIP mẫu đặc quyền Admin để kiểm tra giao diện & tính năng",
              claimedAt: now.toISOString(),
            },
          ],
          remainingTickets: 9999,
        },
      };
    }
    return {
      ok: false,
      error: "Kho tài khoản Liên Quân hiện đang tạm hết. Admin đang nạp thêm acc, vui lòng quay lại sau ít phút!",
    };
  }

  // Tỷ lệ ngẫu nhiên 1 - 3 acc
  // 60% ra 1 acc, 30% ra 2 acc, 10% ra 3 acc (giới hạn theo số lượng trong kho)
  const rand = Math.random();
  let desiredCount = 1;
  if (rand > 0.90) {
    desiredCount = 3;
  } else if (rand > 0.60) {
    desiredCount = 2;
  }
  const actualCount = Math.min(desiredCount, availableCount);

  // Lấy các acc để trao thưởng
  let accountsToClaim = await db.gameAccount.findMany({
    where: { game: "AOV", status: "AVAILABLE" },
    take: actualCount,
    orderBy: { id: "asc" },
  });

  const h = await headers();
  const ip = clientIp(h);
  const now = new Date();
  const remainingTickets = isAdmin ? 9999 : currentTickets - 1;

  if (accountsToClaim.length === 0) {
    if (isAdmin) {
      accountsToClaim = [
        {
          id: 999901,
          game: "AOV",
          username: "admin_vip_aov01",
          password: "•••••••• (Đặc Quyền Admin)",
          rank: "Cao Thủ 50 Sao (Test Admin)",
          skins: 188,
          champs: 118,
          notes: "Tài khoản VIP mẫu đặc quyền Admin",
          status: "AVAILABLE",
          claimedBy: "",
          claimedAt: now,
          token: "",
          createdAt: now,
        },
      ];
    } else {
      return { ok: false, error: "Kho tài khoản tạm hết. Vui lòng thử lại sau!" };
    }
  }

  if (!isAdmin) {
    cookieStore.set("aov_tickets", String(remainingTickets), {
      path: "/",
      maxAge: 86400 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const realAccountIds = accountsToClaim.filter((a) => a.id < 990000).map((a) => a.id);

  if (realAccountIds.length > 0) {
    await db.$transaction([
      db.gameAccount.updateMany({
        where: { id: { in: realAccountIds } },
        data: {
          status: "CLAIMED",
          claimedBy: isAdmin ? `Admin (${currentUser?.username || "admin"})` : `Khách (${ip})`,
          claimedAt: now,
        },
      }),
      db.serviceUsageLog.create({
        data: {
          serviceType: "AOV",
          serviceName: "Xé Túi Mù Liên Quân",
          targetUser: isAdmin ? `Admin (${currentUser?.username || "admin"})` : ip,
          ip,
          status: "SUCCESS",
          metadata: JSON.stringify({
            mode: "BLIND_BAG",
            costTickets: isAdmin ? 0 : 1,
            isAdmin,
            count: accountsToClaim.length,
            usernames: accountsToClaim.map((a) => a.username),
          }),
        },
      }),
    ]);
  }

  revalidatePath("/aov");

  return {
    ok: true,
    data: {
      accounts: accountsToClaim.map((a) => ({
        id: a.id,
        username: a.username,
        password: a.password,
        rank: a.rank,
        skins: a.skins,
        champs: a.champs,
        notes: a.notes,
        claimedAt: now.toISOString(),
      })),
      remainingTickets,
    },
  };
}

/**
 * VÒNG QUAY MAY MẮN (Lucky Spin Wheel)
 * Chi phí: 2 Vé
 * 6 Ô: 0 acc (chúc may mắn), 1 acc, 2 acc, 3 acc, 4 acc, 5 acc
 */
export async function spinWheelAction(): Promise<
  ActionResult<{
    sliceIndex: number;
    count: number;
    accounts: ClaimedAovAccount[];
    remainingTickets: number;
  }>
> {
  const currentUser = await getCurrentUser().catch(() => null);
  const isAdmin = currentUser?.role === "ADMIN";

  const cookieStore = await cookies();
  const currentTickets = Math.max(0, parseInt(cookieStore.get("aov_tickets")?.value || "0", 10) || 0);

  if (!isAdmin && currentTickets < 2) {
    return {
      ok: false,
      error: "Bạn cần ít nhất 2 vé để quay Vòng Quay May Mắn. Hãy bấm 'Lấy Thêm Vé' để vượt link nạp thêm vé nhé!",
    };
  }

  // Kiểm tra số lượng acc khả dụng trong kho
  const availableCount = await db.gameAccount.count({
    where: { game: "AOV", status: "AVAILABLE" },
  });

  // Tỷ lệ quay trúng các ô:
  const rand = Math.random();
  let sliceIndex = 0;
  let desiredCount = 0;

  if (rand < 0.25 || (availableCount === 0 && !isAdmin)) {
    sliceIndex = 0;
    desiredCount = 0;
  } else if (rand < 0.70) {
    sliceIndex = 1;
    desiredCount = 1;
  } else if (rand < 0.88) {
    sliceIndex = 2;
    desiredCount = 2;
  } else if (rand < 0.96) {
    sliceIndex = 3;
    desiredCount = 3;
  } else if (rand < 0.99) {
    sliceIndex = 4;
    desiredCount = 4;
  } else {
    sliceIndex = 5;
    desiredCount = 5;
  }

  const actualCount = Math.min(desiredCount, availableCount);
  if (!isAdmin) {
    if (actualCount === 0 && desiredCount > 0) {
      sliceIndex = 0;
    } else if (actualCount < desiredCount) {
      sliceIndex = actualCount;
    }
  }

  let accountsToClaim: any[] = [];
  if (actualCount > 0) {
    accountsToClaim = await db.gameAccount.findMany({
      where: { game: "AOV", status: "AVAILABLE" },
      take: actualCount,
      orderBy: { id: "asc" },
    });
  }

  const h = await headers();
  const ip = clientIp(h);
  const now = new Date();
  const remainingTickets = isAdmin ? 9999 : currentTickets - 2;

  // Nếu là Admin và kho trống nhưng trúng giải, cấp acc VIP mẫu để test giao diện
  if (accountsToClaim.length === 0 && desiredCount > 0 && isAdmin) {
    accountsToClaim = Array.from({ length: desiredCount }, (_, idx) => ({
      id: 999910 + idx,
      game: "AOV",
      username: `admin_spin_vip0${idx + 1}`,
      password: "•••••••• (Đặc Quyền Admin)",
      rank: "Tinh Anh / Cao Thủ (Test Admin)",
      skins: 150 + idx * 10,
      champs: 115,
      notes: "Tài khoản trúng thưởng Vòng Quay VIP Admin",
      status: "AVAILABLE",
      claimedBy: "",
      claimedAt: now,
      token: "",
      createdAt: now,
    }));
  }

  if (!isAdmin) {
    cookieStore.set("aov_tickets", String(remainingTickets), {
      path: "/",
      maxAge: 86400 * 30,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const realAccountIds = accountsToClaim.filter((a) => a.id < 990000).map((a) => a.id);

  await db.$transaction([
    ...(realAccountIds.length > 0
      ? [
          db.gameAccount.updateMany({
            where: { id: { in: realAccountIds } },
            data: {
              status: "CLAIMED",
              claimedBy: isAdmin ? `Admin (${currentUser?.username || "admin"})` : `Khách (${ip})`,
              claimedAt: now,
            },
          }),
        ]
      : []),
    db.serviceUsageLog.create({
      data: {
        serviceType: "AOV",
        serviceName: "Vòng Quay May Mắn Liên Quân",
        targetUser: isAdmin ? `Admin (${currentUser?.username || "admin"})` : ip,
        ip,
        status: "SUCCESS",
        metadata: JSON.stringify({
          mode: "LUCKY_WHEEL",
          sliceIndex,
          costTickets: isAdmin ? 0 : 2,
          isAdmin,
          count: accountsToClaim.length,
          usernames: accountsToClaim.map((a) => a.username),
        }),
      },
    }),
  ]);

  revalidatePath("/aov");

  return {
    ok: true,
    data: {
      sliceIndex,
      count: accountsToClaim.length,
      accounts: accountsToClaim.map((a) => ({
        id: a.id,
        username: a.username,
        password: a.password,
        rank: a.rank,
        skins: a.skins,
        champs: a.champs,
        notes: a.notes,
        claimedAt: now.toISOString(),
      })),
      remainingTickets,
    },
  };
}
