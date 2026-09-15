import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";

  try {
    const whereCondition: any = {
      OR: [
        ...(user ? [{ userId: user.id }] : []),
        { userId: null },
      ],
    };

    if (category !== "all") {
      whereCondition.category = category;
    }

    const items = await db.notification.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Nếu chưa có thông báo nào trong DB, tạo một vài thông báo mẫu thân thiện
    if (items.length === 0) {
      const defaultNotifs = [
        {
          id: 1,
          category: "system",
          title: "Chào mừng đến với The Darker!",
          message: "Hệ thống Dashboard mới đã chính thức hoạt động. Bạn có thể lưu trữ key, quay thưởng và xem bảng xếp hạng mỗi ngày.",
          isRead: false,
          linkUrl: "/dashboard",
          createdAt: new Date(),
        },
        {
          id: 2,
          category: "reward",
          title: "Tặng 100 Coins khởi nghiệp 🎉",
          message: "Tài khoản của bạn đã được cộng 100 Coins và 1 lượt quay may mắn miễn phí!",
          isRead: false,
          linkUrl: "/dashboard/spin",
          createdAt: new Date(),
        },
        {
          id: 3,
          category: "key",
          title: "Tự động lưu Key Free Fire",
          message: "Mỗi khi bạn vượt link lấy Key thành công, mã key sẽ được tự động lưu vào Bảng điều khiển.",
          isRead: true,
          linkUrl: "/dashboard/keys",
          createdAt: new Date(Date.now() - 3600000),
        },
      ];

      return NextResponse.json({
        items: defaultNotifs,
        unread_total: 2,
        cat_unread: { system: 1, reward: 1, key: 0, account: 0 },
      });
    }

    const unread_total = items.filter((i) => !i.isRead).length;
    const cat_unread: Record<string, number> = {};
    items.forEach((i) => {
      if (!i.isRead) {
        cat_unread[i.category] = (cat_unread[i.category] || 0) + 1;
      }
    });

    return NextResponse.json({
      items,
      unread_total,
      cat_unread,
    });
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
    return NextResponse.json({ items: [], unread_total: 0, cat_unread: {} });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  try {
    const body = await req.json().catch(() => ({}));
    if (body.all) {
      if (user) {
        await db.notification.updateMany({
          where: { OR: [{ userId: user.id }, { userId: null }] },
          data: { isRead: true },
        });
      }
    } else if (body.id) {
      await db.notification.updateMany({
        where: { id: Number(body.id) },
        data: { isRead: true },
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
