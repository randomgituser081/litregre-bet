"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  Heart,
  Clock,
  Radio,
  Trophy,
  Flag,
  Star,
  CircleDot,
  Flame,
  Percent,
  Gift,
  Crown,
  ChevronDown,
  X,
  Ticket,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Suspense, useEffect, useState } from "react";

const ACTIVITY = [
  { href: "/favorites", label: "Favorites", icon: Heart, count: 12 },
  { href: "/favorites?tab=recent", label: "Recently Played", icon: Clock },
];

const SPORTS = [
  { href: "/?tab=live", label: "Live Matches", icon: Radio },
  { href: "/?tab=today", label: "Today's Football", icon: Flame },
  { href: "/sports", label: "All Sports", icon: Trophy },
  { href: "/sports/football/epl", label: "Premier League", icon: Flag },
  { href: "/sports/football/ucl", label: "Champions League", icon: Star },
  { href: "/sports/football/laliga", label: "La Liga", icon: CircleDot },
  { href: "/open-bets", label: "My Bets", icon: Ticket },
];

const EXTRAS = [
  { href: "/promotions", label: "Promotions", icon: Percent },
  { href: "/bonuses", label: "Bonuses", icon: Gift, badge: 4 },
  { href: "/vip", label: "VIP Club", icon: Crown },
];

function SideBarInner({
  onNavigate,
  showLogo,
}: {
  onNavigate?: () => void;
  showLogo: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { theme } = useTheme();
  const isLight = theme === "light";
  const liveActive = pathname === "/" && tab === "live";
  const sportsActive =
    pathname.startsWith("/sports") ||
    (pathname === "/" && tab !== "live" && tab !== "today");

  function linkProps(href: string) {
    return {
      href,
      onClick: onNavigate,
    };
  }

  return (
    <div
      className="flex h-full flex-col gap-3 p-3.5"
      style={{ color: "var(--sidebar-text)" }}
    >
      {showLogo && (
        <div className="flex items-center justify-between px-0.5 pt-0.5 pb-1">
          <BrandLogo href="/" size="sm" product="bet" inverted={!isLight} />
          <button
            type="button"
            onClick={onNavigate}
            className="w-9 h-9 rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 transition"
            style={{ background: "var(--sidebar-elevated)" }}
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Live / Sports toggle — DICEBET-style pills */}
      <div
        className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        <Link
          {...linkProps("/?tab=live")}
          className={clsx(
            "flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold transition-all duration-200",
            liveActive
              ? "bg-[#3B82FF] text-white shadow-[0_8px_22px_rgba(59,130,255,0.4)]"
              : "text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-text)] border border-transparent hover:border-[color:var(--chrome-border)]"
          )}
        >
          <Radio size={16} strokeWidth={2.2} />
          Live
        </Link>
        <Link
          {...linkProps("/sports")}
          className={clsx(
            "flex items-center justify-center gap-2 h-11 rounded-xl text-[13px] font-bold transition-all duration-200",
            sportsActive
              ? "bg-[#3B82FF] text-white shadow-[0_8px_22px_rgba(59,130,255,0.4)]"
              : "text-[color:var(--sidebar-muted)] hover:text-[color:var(--sidebar-text)] border border-[color:var(--chrome-border)]"
          )}
        >
          <Trophy size={16} strokeWidth={2.2} />
          Sports
        </Link>
      </div>

      {/* Promo card */}
      <Link
        {...linkProps("/?tab=today")}
        className="relative isolate overflow-hidden rounded-[1.35rem] min-h-[7.75rem] p-4 bg-gradient-to-br from-[#3B82FF] via-[#2563EB] to-[#1D4ED8] text-white shadow-[0_14px_32px_rgba(37,99,235,0.28)]"
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[55%]"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 24%, black 50%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 24%, black 50%)",
          }}
        >
          <Image
            src={`/images/hero/player-winger-victory.png?v=cast-v2`}
            alt=""
            fill
            unoptimized
            className="object-cover object-[72%_15%]"
            sizes="160px"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #2563EB 0%, #2563EB 38%, rgba(37,99,235,0.85) 55%, rgba(37,99,235,0.3) 72%, transparent 90%)",
          }}
        />
        <div className="relative z-10 max-w-[58%]">
          <p className="text-[15px] font-black leading-tight tracking-tight uppercase">
            Bet for victory
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#5B9AFF]/90 px-3 py-1.5 text-[11px] font-bold backdrop-blur-sm">
            <Trophy size={12} />
            100 Freebet
          </span>
        </div>
      </Link>

      {/* Favorites / Recently */}
      <div
        className="rounded-[1.25rem] p-1.5"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        {ACTIVITY.map(({ href, label, icon: Icon, count }) => (
          <Link
            key={label}
            {...linkProps(href)}
            className="flex items-center gap-3 px-3 py-3 rounded-[1rem] text-[13px] font-semibold transition-colors hover:bg-white/[0.04]"
          >
            <span className="w-8 h-8 rounded-xl bg-[#3B82FF]/12 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-[#8eb6ff]" strokeWidth={1.9} />
            </span>
            <span className="flex-1">{label}</span>
            {typeof count === "number" && (
              <span className="text-[13px] font-bold text-[#8eb6ff]">{count}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Sports list */}
      <div
        className="rounded-[1.25rem] p-1.5 flex-1 min-h-0 overflow-y-auto no-scrollbar"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        <p
          className="px-3 pt-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--sidebar-muted)" }}
        >
          Sports
        </p>
        {SPORTS.map(({ href, label, icon: Icon }) => {
          const active =
            (href.startsWith("/sports/") && pathname.startsWith(href)) ||
            (href === "/?tab=live" && liveActive) ||
            (href === "/open-bets" && pathname.startsWith("/open-bets"));
          return (
            <Link
              key={label}
              {...linkProps(href)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-[13px] font-semibold transition-all duration-150",
                active
                  ? "bg-[#3B82FF]/15 text-white"
                  : "opacity-80 hover:opacity-100 hover:bg-white/[0.04]"
              )}
            >
              <span
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                  active ? "bg-[#3B82FF]/25" : "bg-white/[0.04]"
                )}
              >
                <Icon
                  size={16}
                  className={active ? "text-[#8eb6ff]" : "text-[#8eb6ff]/80"}
                  strokeWidth={1.9}
                />
              </span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Extras */}
      <div
        className="rounded-[1.25rem] p-1.5"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        {EXTRAS.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={label}
            {...linkProps(href)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-[13px] font-semibold opacity-85 hover:opacity-100 hover:bg-white/[0.04] transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-accent-green/10 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-accent-green" strokeWidth={1.9} />
            </span>
            <span className="flex-1">{label}</span>
            {badge != null && (
              <span className="min-w-[1.35rem] h-[1.35rem] rounded-full bg-accent-green text-[#0A1433] text-[11px] font-bold flex items-center justify-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="flex items-center gap-3 w-full rounded-[1.25rem] px-3.5 py-3 text-[13px] font-semibold"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        <span className="w-7 h-7 rounded-full bg-[#3B82FF]/15 text-[#8eb6ff] flex items-center justify-center text-[11px] font-black">
          EN
        </span>
        <span className="flex-1 text-left">English</span>
        <ChevronDown size={16} style={{ color: "var(--sidebar-muted)" }} />
      </button>
    </div>
  );
}

function MobileDrawer() {
  const { open, setOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setEntered(false);
    const t = window.setTimeout(() => setMounted(false), 320);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[100]" aria-modal="true" role="dialog">
      <button
        type="button"
        className={clsx(
          "absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-300 ease-out",
          entered ? "opacity-100" : "opacity-0"
        )}
        aria-label="Close sidebar"
        onClick={() => setOpen(false)}
      />
      <aside
        className={clsx(
          "absolute left-0 top-0 bottom-0 w-[19.5rem] max-w-[88vw] shadow-[12px_0_40px_rgba(0,0,0,0.5)] overflow-y-auto no-scrollbar will-change-transform",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          entered ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ background: "var(--sidebar)" }}
      >
        <Suspense fallback={null}>
          <SideBarInner showLogo onNavigate={() => setOpen(false)} />
        </Suspense>
      </aside>
    </div>
  );
}

export function SideBar() {
  const { collapsed } = useSidebar();

  return (
    <>
      {!collapsed && (
        <aside
          className="hidden lg:flex w-[17.5rem] shrink-0 flex-col min-h-[calc(100vh-4rem)] sticky top-16 self-start overflow-y-auto border-r"
          style={{
            background: "var(--sidebar)",
            borderColor: "var(--surface-border)",
          }}
        >
          <Suspense fallback={null}>
            <SideBarInner showLogo={false} />
          </Suspense>
        </aside>
      )}

      <MobileDrawer />
    </>
  );
}
