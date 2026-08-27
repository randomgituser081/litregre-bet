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
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Suspense } from "react";

const ACTIVITY = [
  { href: "/favorites", label: "Favorites", icon: Heart, count: 12 },
  { href: "/favorites?tab=recent", label: "Recently Played", icon: Clock },
];

const SPORTS = [
  { href: "/?tab=live", label: "Live Matches", icon: Radio },
  { href: "/?tab=today", label: "Today’s Football", icon: Flame },
  { href: "/sports", label: "All Sports", icon: Trophy },
  { href: "/sports/football/epl", label: "Premier League", icon: Flag },
  { href: "/sports/football/ucl", label: "Champions League", icon: Star },
  { href: "/sports/football/laliga", label: "La Liga", icon: CircleDot },
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
  const sportsActive = pathname.startsWith("/sports");

  function linkProps(href: string) {
    return {
      href,
      onClick: onNavigate,
    };
  }

  return (
    <div
      className="flex h-full flex-col gap-3 p-3"
      style={{ color: "var(--sidebar-text)" }}
    >
      {showLogo && (
        <div className="flex items-center justify-between px-1 pt-1">
          <BrandLogo
            href="/"
            size="sm"
            product="bet"
            inverted={!isLight}
          />
          <button
            type="button"
            onClick={onNavigate}
            className="w-10 h-10 rounded-2xl flex items-center justify-center opacity-60 hover:opacity-100"
            style={{ background: "var(--sidebar-elevated)" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div
        className="grid grid-cols-2 gap-2 p-1 rounded-[1.25rem]"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        <Link
          {...linkProps("/?tab=live")}
          className={clsx(
            "flex items-center justify-center gap-2 h-11 rounded-[1rem] text-[13px] font-bold transition",
            liveActive
              ? isLight
                ? "bg-[#0A1433] text-white"
                : "bg-accent-green text-[#0A1433] shadow-[0_8px_24px_rgba(34,211,102,0.28)]"
              : "opacity-55 hover:opacity-90"
          )}
        >
          <Radio size={16} />
          Live
        </Link>
        <Link
          {...linkProps("/sports")}
          className={clsx(
            "flex items-center justify-center gap-2 h-11 rounded-[1rem] text-[13px] font-bold transition",
            sportsActive
              ? isLight
                ? "bg-[#0A1433] text-white"
                : "bg-accent-green text-[#0A1433] shadow-[0_8px_24px_rgba(34,211,102,0.28)]"
              : "opacity-55 hover:opacity-90"
          )}
        >
          <Trophy size={16} />
          Sports
        </Link>
      </div>

      <Link
        {...linkProps("/?tab=today")}
        className={clsx(
          "relative isolate overflow-hidden rounded-[1.35rem] min-h-[7.5rem] p-4",
          isLight
            ? "bg-gradient-to-br from-[#1e5c40] via-[#174a34] to-[#0f3324] text-white"
            : "bg-gradient-to-br from-[#3B82FF] to-[#1D4ED8] text-white"
        )}
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
            src={`/images/hero/saka-join-original.png?v=photo-blend1`}
            alt=""
            fill
            unoptimized
            className="object-cover object-[60%_18%]"
            sizes="160px"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? "linear-gradient(90deg, #1e5c40 0%, #1e5c40 38%, rgba(30,92,64,0.85) 55%, rgba(30,92,64,0.3) 72%, transparent 90%)"
              : "linear-gradient(90deg, #2563EB 0%, #2563EB 38%, rgba(37,99,235,0.85) 55%, rgba(37,99,235,0.3) 72%, transparent 90%)",
          }}
        />
        <div className="relative z-10 max-w-[58%]">
          <p className="text-[15px] font-black leading-tight tracking-tight">
            BET FOR VICTORY
          </p>
          <span
            className={clsx(
              "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold",
              isLight
                ? "bg-accent-green/25 text-accent-lime"
                : "bg-[#5B9AFF]"
            )}
          >
            <Trophy size={12} />
            Today&apos;s picks
          </span>
        </div>
      </Link>

      <div
        className="rounded-[1.25rem] p-1.5"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        {ACTIVITY.map(({ href, label, icon: Icon, count }) => (
          <Link
            key={label}
            {...linkProps(href)}
            className="flex items-center gap-3 px-3 py-3 rounded-[1rem] text-[13px] font-semibold transition-colors hover:bg-[color-mix(in_srgb,var(--sidebar-text)_6%,transparent)]"
          >
            <Icon
              size={18}
              style={{ color: "var(--sidebar-accent)" }}
              strokeWidth={1.75}
            />
            <span className="flex-1">{label}</span>
            {typeof count === "number" && (
              <span
                className="text-[13px] font-bold"
                style={{ color: "var(--sidebar-accent)" }}
              >
                {count}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div
        className="rounded-[1.25rem] p-1.5 flex-1 min-h-0 overflow-y-auto"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        <p
          className="px-3 pt-2 pb-1 text-[11px] font-semibold"
          style={{ color: "var(--sidebar-muted)" }}
        >
          Sports
        </p>
        {SPORTS.map(({ href, label, icon: Icon }) => {
          const active =
            href.startsWith("/sports/") && pathname.startsWith(href);
          return (
            <Link
              key={label}
              {...linkProps(href)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-[13px] font-semibold transition-colors",
                active
                  ? "bg-[color-mix(in_srgb,var(--sidebar-text)_8%,transparent)]"
                  : "opacity-80 hover:opacity-100 hover:bg-[color-mix(in_srgb,var(--sidebar-text)_6%,transparent)]"
              )}
            >
              <Icon
                size={18}
                style={{ color: "var(--sidebar-accent)" }}
                strokeWidth={1.75}
              />
              {label}
            </Link>
          );
        })}
      </div>

      <div
        className="rounded-[1.25rem] p-1.5"
        style={{ background: "var(--sidebar-elevated)" }}
      >
        {EXTRAS.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={label}
            {...linkProps(href)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[1rem] text-[13px] font-semibold opacity-80 hover:opacity-100 hover:bg-[color-mix(in_srgb,var(--sidebar-text)_6%,transparent)]"
          >
            <Icon
              size={18}
              style={{ color: "var(--sidebar-accent)" }}
              strokeWidth={1.75}
            />
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
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
          style={{
            background: "var(--panel-inset)",
            color: "var(--sidebar-accent)",
          }}
        >
          EN
        </span>
        <span className="flex-1 text-left">English</span>
        <ChevronDown size={16} style={{ color: "var(--sidebar-muted)" }} />
      </button>
    </div>
  );
}

export function SideBar() {
  const { open, setOpen, collapsed } = useSidebar();

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

      {open && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[19rem] max-w-[88vw] shadow-2xl overflow-y-auto"
            style={{ background: "var(--sidebar)" }}
          >
            <Suspense fallback={null}>
              <SideBarInner showLogo onNavigate={() => setOpen(false)} />
            </Suspense>
          </aside>
        </div>
      )}
    </>
  );
}
