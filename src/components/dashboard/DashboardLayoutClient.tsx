"use client";

import { useState, useEffect } from "react";
import { AuthUser } from "@/lib/auth";
import NovaTopBar from "@/components/nova/NovaTopBar";
import NovaDrawer from "@/components/nova/NovaDrawer";
import NovaNotificationDrawer from "@/components/nova/NovaNotificationDrawer";

interface Props {
  user: AuthUser;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ user, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [currentUser, setCurrentUser] = useState<AuthUser>(user);

  useEffect(() => {
    // Lấy thông tin user và số thông báo chưa đọc mới nhất
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          if (typeof data.user.unreadCount === "number") {
            setUnreadCount(data.user.unreadCount);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="nova-shell-root">
      {/* 1. Topbar cố định trên đầu trang */}
      <NovaTopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenNotif={() => setNotifOpen(true)}
        unreadCount={unreadCount}
        user={currentUser}
      />

      {/* 2. Menu Drawer trượt bên trái */}
      <NovaDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={currentUser}
      />

      {/* 3. Trung tâm thông báo trượt bên phải */}
      <NovaNotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onUnreadChange={(cnt) => setUnreadCount(cnt)}
      />

      {/* 4. Khung nội dung chính Web App (Mobile-first, Max-width centered) */}
      <main className="nova-shell-body">
        <div className="nova-shell-wrap">
          {children}
        </div>
      </main>
    </div>
  );
}
