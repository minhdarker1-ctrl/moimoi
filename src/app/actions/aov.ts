"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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
 * XÉ TÚI MÙ (Mystery Blind Bag)
 * Chi phí: 1 Vé
 * Phần thưởng ngẫu nhiên: 1 đến 3 acc Liên Quân Garena
 */
export async function openBlindBagAction(): Promise<
  ActionResult<{ accounts: ClaimedAovAccount[]; remainingTickets: number }>
> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { ok: false, error: "Vui lòng đăng nhập để tham gia xé Túi Mù!" };
  }

  const user = await db.user.findUnique({
    where: { id: currentUser.id },
    select: { id: true, username: true, aovTickets: true },
  });

  if (!user || user.aovTickets < 1) {
    return {
      ok: false,
      error: "Bạn không đủ vé để xé Túi Mù (Cần 1 vé). Hãy bấm 'Lấy Ticket' để vượt link nạp thêm vé nhé!",
    };
  }

  // Kiểm tra số lượng acc khả dụng trong kho
  const availableCount = await db.gameAccount.count({
    where: { game: "AOV", status: "AVAILABLE" },
  });

  if (availableCount <= 0) {
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
  const accountsToClaim = await db.gameAccount.findMany({
    where: { game: "AOV", status: "AVAILABLE" },
    take: actualCount,
    orderBy: { id: "asc" },
  });

  if (accountsToClaim.length === 0) {
    return { ok: false, error: "Kho tài khoản tạm hết. Vui lòng thử lại sau!" };
  }

  const h = await headers();
  const ip = clientIp(h);
  const now = new Date();

  // Thực hiện transaction: trừ 1 vé + chuyển trạng thái acc + ghi log
  const [updatedUser] = await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { aovTickets: { decrement: 1 } },
      select: { aovTickets: true },
    }),
    db.gameAccount.updateMany({
      where: { id: { in: accountsToClaim.map((a) => a.id) } },
      data: {
        status: "CLAIMED",
        claimedBy: user.username,
        claimedAt: now,
      },
    }),
    db.serviceUsageLog.create({
      data: {
        userId: user.id,
        serviceType: "AOV",
        serviceName: "Xé Túi Mù Liên Quân",
        targetUser: user.username,
        ip,
        status: "SUCCESS",
        metadata: JSON.stringify({
          mode: "BLIND_BAG",
          costTickets: 1,
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
      remainingTickets: updatedUser.aovTickets,
    },
  };
}

/**
 * VÒNG QUAY MAY MẮN (Lucky Wheel)
 * Chi phí: 2 Vé
 * 6 Ô giải thưởng:
 * Index 0: 0 Acc (Chúc bạn may mắn lần sau)
 * Index 1: 1 Acc VIP
 * Index 2: 2 Acc VIP
 * Index 3: 3 Acc VIP
 * Index 4: 4 Acc VIP
 * Index 5: 5 Acc JACKPOT
 */
export async function spinWheelAction(): Promise<
  ActionResult<{
    sliceIndex: number;
    count: number;
    accounts: ClaimedAovAccount[];
    remainingTickets: number;
  }>
> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { ok: false, error: "Vui lòng đăng nhập để tham gia Vòng Quay May Mắn!" };
  }

  const user = await db.user.findUnique({
    where: { id: currentUser.id },
    select: { id: true, username: true, aovTickets: true },
  });

  if (!user || user.aovTickets < 2) {
    return {
      ok: false,
      error: "Bạn cần ít nhất 2 vé để quay Vòng Quay May Mắn. Hãy bấm 'Lấy Ticket' để vượt link nạp thêm vé nhé!",
    };
  }

  // Kiểm tra số lượng acc khả dụng trong kho
  const availableCount = await db.gameAccount.count({
    where: { game: "AOV", status: "AVAILABLE" },
  });

  // Tỷ lệ quay trúng các ô:
  // Ô 0 (0 acc): 25%
  // Ô 1 (1 acc): 45%
  // Ô 2 (2 acc): 18%
  // Ô 3 (3 acc): 8%
  // Ô 4 (4 acc): 3%
  // Ô 5 (5 acc): 1%
  const rand = Math.random();
  let sliceIndex = 0;
  let desiredCount = 0;

  if (rand < 0.25 || availableCount === 0) {
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

  // Điều chỉnh theo số acc thật có trong kho nếu kho ít hơn
  const actualCount = Math.min(desiredCount, availableCount);
  if (actualCount === 0 && desiredCount > 0) {
    sliceIndex = 0;
  } else if (actualCount < desiredCount) {
    sliceIndex = actualCount;
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

  // Transaction: trừ 2 vé + cập nhật acc + ghi nhật ký
  const [updatedUser] = await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { aovTickets: { decrement: 2 } },
      select: { aovTickets: true },
    }),
    ...(accountsToClaim.length > 0
      ? [
          db.gameAccount.updateMany({
            where: { id: { in: accountsToClaim.map((a) => a.id) } },
            data: {
              status: "CLAIMED",
              claimedBy: user.username,
              claimedAt: now,
            },
          }),
        ]
      : []),
    db.serviceUsageLog.create({
      data: {
        userId: user.id,
        serviceType: "AOV",
        serviceName: "Vòng Quay May Mắn Liên Quân",
        targetUser: user.username,
        ip,
        status: "SUCCESS",
        metadata: JSON.stringify({
          mode: "LUCKY_WHEEL",
          sliceIndex,
          costTickets: 2,
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
      remainingTickets: updatedUser.aovTickets,
    },
  };
}

/**
 * LẤY TÚI ĐỒ (Danh sách acc AOV của tôi)
 */
export async function getMyAovInventoryAction(): Promise<
  ActionResult<ClaimedAovAccount[]>
> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { ok: true, data: [] };
  }

  const accounts = await db.gameAccount.findMany({
    where: {
      game: "AOV",
      claimedBy: currentUser.username,
    },
    orderBy: { claimedAt: "desc" },
    take: 50,
  });

  return {
    ok: true,
    data: accounts.map((a) => ({
      id: a.id,
      username: a.username,
      password: a.password,
      rank: a.rank,
      skins: a.skins,
      champs: a.champs,
      notes: a.notes,
      claimedAt: a.claimedAt ? a.claimedAt.toISOString() : null,
    })),
  };
}
