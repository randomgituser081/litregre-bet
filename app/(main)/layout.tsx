"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { SideBar } from "@/components/layout/SideBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SlipShell } from "@/components/slip/SlipShell";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-surface text-ink">
        <div className="sticky top-0 z-50 w-full">
          <TopBar />
        </div>

        <div className="flex flex-1 w-full max-w-[90rem] mx-auto">
          <SideBar />
          <main className="flex-1 min-w-0 pb-20 lg:pb-8">{children}</main>
        </div>

        <SlipShell hideFabOnHome={isHome} />
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
