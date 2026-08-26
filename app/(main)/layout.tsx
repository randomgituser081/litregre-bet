import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SlipShell } from "@/components/slip/SlipShell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto w-full">
      <TopBar />
      <main className="flex-1 pb-4">{children}</main>
      <SlipShell />
      <BottomNav />
    </div>
  );
}
