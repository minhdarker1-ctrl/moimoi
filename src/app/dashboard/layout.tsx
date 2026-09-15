import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}
