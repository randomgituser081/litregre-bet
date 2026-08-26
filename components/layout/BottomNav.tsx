"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, Gamepad2, RefreshCw, User } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sports", label: "AZ", icon: Menu },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/open-bets", label: "Bets", icon: RefreshCw },
  { href: "/me", label: "Me", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] bg-black border-t border-surface-border safe-bottom">
      <div className="max-w-lg mx-auto flex items-stretch justify-around h-14">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 flex-1 text-[10px] font-medium text-white/50 relative",
                active && "nav-item-active"
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-green rounded-full" />
              )}
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
