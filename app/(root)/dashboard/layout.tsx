import React from "react";
import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardMobileNavigation from "./_components/DashboardMobileNavigation";
import DashboardHeader from "./_components/DashboardHeader";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/user";
import ModeToggle from "@/components/ModeToggle";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  if (user?.data === null) redirect("/sign-in");

  return (
    <main className="flex h-screen bg-light dark:bg-dark">
      <DashboardSidebar />
      <section className="flex h-full flex-1 flex-col overflow-auto card-scroll">
        <DashboardMobileNavigation />
        <DashboardHeader user={user?.data} />
        <div className="p-5 md:ml-32 lg:ml-64">{children}</div>
      </section>
      <div className="fixed bottom-5 left-5 z-50">
        <ModeToggle />
      </div>
    </main>
  );
};

export default DashboardLayout;
