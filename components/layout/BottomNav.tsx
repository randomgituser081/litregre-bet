"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Home, Radio, Trophy, Ticket, User } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home", icon: Home, match: "home" as const },
  { href: "/?tab=live", label: "Live", icon: Radio, match: "live" as const },
  { href: "/sports", label: "Sports", icon: Trophy, match: "sports" as const },
  { href: "/open-bets", label: "Bets", icon: Ticket, match: "bets" as const },
  { href: "/me", label: "Me", icon: User, match: "me" as const },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80] safe-bottom border-t border-surface-border"
      style={{ background: "var(--chrome)" }}
    >
      <div className="mx-auto max-w-lg flex h-[3.25rem] items-stretch">
        {items.map(({ href, label, icon: Icon, match }) => {
          let active = false;
          if (match === "home") active = pathname === "/" && tab !== "live";
          else if (match === "live")
            active = pathname === "/" && tab === "live";
          else if (match === "sports") active = pathname.startsWith("/sports");
          else if (match === "bets") active = pathname.startsWith("/open-bets");
          else if (match === "me") active = pathname.startsWith("/me");

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 flex-1 text-[10px] font-semibold transition-colors",
                active ? "text-accent-green" : "text-[color:var(--chrome-muted)]"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense
      fallback={
        <nav
          className="fixed bottom-0 left-0 right-0 z-[80] h-14"
          style={{ background: "var(--chrome)" }}
          aria-hidden
        />
      }
    >
      <BottomNavInner />
    </Suspense>
  );
}
