import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ user: null });
  }

  // Lấy dữ liệu mới nhất từ DB
  try {
    const dbUser = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        coins: true,
        spinTickets: true,
        tasksToday: true,
        referralCode: true,
        _count: {
          select: {
            savedKeys: true,
          },
        },
      },
    });

    if (dbUser) {
      // Đếm thông báo chưa đọc (bao gồm thông báo chung và riêng)
      const unreadCount = await db.notification.count({
        where: {
          OR: [
            { userId: dbUser.id, isRead: false },
            { userId: null, isRead: false },
          ],
        },
      });

      return NextResponse.json({
        user: {
          ...dbUser,
          role: dbUser.role as "USER" | "ADMIN",
          savedKeysCount: dbUser._count.savedKeys,
          unreadCount,
        },
      });
    }
  } catch (err) {
    console.error("Lỗi lấy thông tin me:", err);
  }

  return NextResponse.json({ user: sessionUser });
}

