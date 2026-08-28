"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Home, Radio, Trophy, User, Wallet } from "lucide-react";
import clsx from "clsx";

const sideItems = [
  { href: "/", label: "Home", icon: Home, match: "home" as const },
  { href: "/?tab=live", label: "Live", icon: Radio, match: "live" as const },
  { href: "/sports", label: "Sports", icon: Trophy, match: "sports" as const },
  { href: "/me", label: "Me", icon: User, match: "me" as const },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  function isActive(match: (typeof sideItems)[number]["match"]) {
    if (match === "home") return pathname === "/" && tab !== "live";
    if (match === "live") return pathname === "/" && tab === "live";
    if (match === "sports") return pathname.startsWith("/sports");
    if (match === "me") return pathname.startsWith("/me");
    return false;
  }

  const walletActive =
    pathname.startsWith("/me") &&
    (searchParams.get("tab") === "deposit" || searchParams.get("tab") === "wallet");

  const left = sideItems.slice(0, 2);
  const right = sideItems.slice(2);

  return (
    <nav className="bottom-nav-float lg:hidden" aria-label="Main navigation">
      <div className="bottom-nav-float__inner">
        {left.map(({ href, label, icon: Icon, match }) => {
          const active = isActive(match);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "bottom-nav-item",
                active && "bottom-nav-item--active"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}

        <Link
          href="/me?tab=deposit"
          className={clsx("bottom-nav-wallet", walletActive && "bottom-nav-wallet--active")}
          aria-label="Wallet"
        >
          <Wallet size={22} strokeWidth={2.4} className="text-[#0A1433]" />
        </Link>

        {right.map(({ href, label, icon: Icon, match }) => {
          const active = isActive(match);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "bottom-nav-item",
                active && "bottom-nav-item--active"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
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
          className="bottom-nav-float lg:hidden"
          aria-hidden
        >
          <div className="bottom-nav-float__inner h-[4rem]" />
        </nav>
      }
    >
      <BottomNavInner />
    </Suspense>
  );
}
