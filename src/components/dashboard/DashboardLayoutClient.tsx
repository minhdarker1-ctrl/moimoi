"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { AuthUser } from "@/lib/auth";

interface Props {
  user: AuthUser;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dash-root">
      <DashboardSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main-area">
        <DashboardHeader
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="dash-content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
