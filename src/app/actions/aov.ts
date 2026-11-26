"use server";

import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { clientIp } from "@/lib/guard";
import { AOV_TICKET_COOKIE, signAovTickets, verifyAovTickets } from "@/lib/crypto";

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

function buildAdminMockAccount(id: number, username: string, rank: string, notes: string, now: Date): ClaimedAovAccount {
  return {
    id,
    username,
    password: "•••••••• (Đặc Quyền Admin)",
    rank,
    skins: 188,
    champs: 118,
    notes,
    claimedAt: now.toISOString(),
  };
}

/**
 * LẤY SỐ VÉ HIỆN TẠI TỪ COOKIE ĐÃ KÝ HMAC HOẶC ĐẶC QUYỀN ADMIN
 */
export async function getAovTicketsAction(): Promise<number> {
  const currentUser = await getCurrentUser().catch(() => null);
  if (currentUser?.role === "ADMIN") {
    return 9999;
  }
  const cookieStore = await cookies();
  return verifyAovTickets(cookieStore.get(AOV_TICKET_COOKIE)?.value);
}

/**
 * XÉ TÚI MÙ (Mystery Blind Bag)
 * Chi phí: 1 Vé (Miễn phí vô hạn cho Admin)
 * Phần thưởng ngẫu nhiên: 1 đến 3 acc Liên Quân Garena (Atomic FOR UPDATE SKIP LOCKED)
 */
export async function openBlindBagAction(): Promise<
  ActionResult<{ accounts: ClaimedAovAccount[]; remainingTickets: number }>
> {
  const currentUser = await getCurrentUser().catch(() => null);
  const isAdmin = currentUser?.role === "ADMIN";

  const cookieStore = await cookies();
  const currentTickets = verifyAovTickets(cookieStore.get(AOV_TICKET_COOKIE)?.value);

  if (!isAdmin && currentTickets < 1) {
    return {
      ok: false,
      error: "Bạn không đủ vé để xé Túi Mù (Cần 1 vé). Hãy bấm 'Lấy Thêm Vé' để vượt link nạp thêm vé nhé!",
    };
  }

  // Tỷ lệ ngẫu nhiên 1 - 3 acc: 60% ra 1 acc, 30% ra 2 acc, 10% ra 3 acc
  const rand = Math.random();
  let desiredCount = 1;
  if (rand > 0.9) desiredCount = 3;
  else if (rand > 0.6) desiredCount = 2;

  const h = await headers();
  const ip = clientIp(h);
  const now = new Date();
  const claimedBy = isAdmin ? `Admin (${currentUser?.username || "admin"})` : `Khách (${ip})`;

  const claimedRows = await db.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      Array<{
        id: number;
        username: string;
        password: string;
        rank: string;
        skins: number;
        champs: number;
        notes: string;
        claimedAt: Date | null;
      }>
    >`
      UPDATE "GameAccount"
      SET status = 'CLAIMED',
          "claimedBy" = ${claimedBy},
          "claimedAt" = ${now}
      WHERE id IN (
        SELECT id FROM "GameAccount"
        WHERE game = 'AOV' AND status = 'AVAILABLE'
        ORDER BY id ASC
        LIMIT ${desiredCount}
        FOR UPDATE SKIP LOCKED
      )
      RETURNING id, username, password, rank, skins, champs, notes, "claimedAt"
    `;

    if (rows.length > 0) {
      await tx.serviceUsageLog.create({
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
            count: rows.length,
            usernames: rows.map((a) => a.username),
          }),
        },
      });
    }

    return rows;
  });

  if (claimedRows.length === 0) {
    if (isAdmin) {
      return {
        ok: true,
        data: {
          accounts: [
            buildAdminMockAccount(
              999901,
              "admin_vip_aov01",
              "Cao Thủ 50 Sao (Test Admin)",
              "Tài khoản VIP mẫu đặc quyền Admin để kiểm tra giao diện & tính năng",
              now
            ),
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

  const remainingTickets = isAdmin ? 9999 : currentTickets - 1;
  if (!isAdmin) {
    cookieStore.set(AOV_TICKET_COOKIE, signAovTickets(remainingTickets), {
      path: "/",
      maxAge: 86400 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  revalidatePath("/aov");

  return {
    ok: true,
    data: {
      accounts: claimedRows.map((a) => ({
        id: a.id,
        username: a.username,
        password: a.password,
        rank: a.rank,
        skins: a.skins,
        champs: a.champs,
        notes: a.notes,
        claimedAt: (a.claimedAt ?? now).toISOString(),
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
  const currentTickets = verifyAovTickets(cookieStore.get(AOV_TICKET_COOKIE)?.value);

  if (!isAdmin && currentTickets < 2) {
    return {
      ok: false,
      error: "Bạn cần ít nhất 2 vé để quay Vòng Quay May Mắn. Hãy bấm 'Lấy Thêm Vé' để vượt link nạp thêm vé nhé!",
    };
  }

  // Tỷ lệ quay trúng các ô:
  const rand = Math.random();
  let sliceIndex = 0;
  let desiredCount = 0;

  if (rand < 0.25) {
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

  const h = await headers();
  const ip = clientIp(h);
  const now = new Date();
  const claimedBy = isAdmin ? `Admin (${currentUser?.username || "admin"})` : `Khách (${ip})`;

  const txOutcome = await db.$transaction(async (tx) => {
    let rows: Array<{
      id: number;
      username: string;
      password: string;
      rank: string;
      skins: number;
      champs: number;
      notes: string;
      claimedAt: Date | null;
    }> = [];

    if (desiredCount > 0) {
      rows = await tx.$queryRaw`
        UPDATE "GameAccount"
        SET status = 'CLAIMED',
            "claimedBy" = ${claimedBy},
            "claimedAt" = ${now}
        WHERE id IN (
          SELECT id FROM "GameAccount"
          WHERE game = 'AOV' AND status = 'AVAILABLE'
          ORDER BY id ASC
          LIMIT ${desiredCount}
          FOR UPDATE SKIP LOCKED
        )
        RETURNING id, username, password, rank, skins, champs, notes, "claimedAt"
      `;
    }

    const finalSlice = isAdmin
      ? desiredCount
      : rows.length < desiredCount
      ? rows.length
      : sliceIndex;

    await tx.serviceUsageLog.create({
      data: {
        serviceType: "AOV",
        serviceName: "Vòng Quay May Mắn Liên Quân",
        targetUser: isAdmin ? `Admin (${currentUser?.username || "admin"})` : ip,
        ip,
        status: "SUCCESS",
        metadata: JSON.stringify({
          mode: "LUCKY_WHEEL",
          sliceIndex: finalSlice,
          costTickets: isAdmin ? 0 : 2,
          isAdmin,
          count: rows.length,
          usernames: rows.map((a) => a.username),
        }),
      },
    });

    return { rows, finalSlice };
  });

  let accountsOut: ClaimedAovAccount[] = txOutcome.rows.map((a) => ({
    id: a.id,
    username: a.username,
    password: a.password,
    rank: a.rank,
    skins: a.skins,
    champs: a.champs,
    notes: a.notes,
    claimedAt: (a.claimedAt ?? now).toISOString(),
  }));

  if (accountsOut.length === 0 && desiredCount > 0 && isAdmin) {
    accountsOut = Array.from({ length: desiredCount }, (_, idx) =>
      buildAdminMockAccount(
        999910 + idx,
        `admin_spin_vip0${idx + 1}`,
        "Tinh Anh / Cao Thủ (Test Admin)",
        "Tài khoản trúng thưởng Vòng Quay VIP Admin",
        now
      )
    );
  }

  const remainingTickets = isAdmin ? 9999 : currentTickets - 2;
  if (!isAdmin) {
    cookieStore.set(AOV_TICKET_COOKIE, signAovTickets(remainingTickets), {
      path: "/",
      maxAge: 86400 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  revalidatePath("/aov");

  return {
    ok: true,
    data: {
      sliceIndex: txOutcome.finalSlice,
      count: accountsOut.length,
      accounts: accountsOut,
      remainingTickets,
    },
  };
}
