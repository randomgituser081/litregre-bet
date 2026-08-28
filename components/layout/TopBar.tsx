"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Wallet,
  User,
  PanelLeftOpen,
  PanelLeftClose,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatNaira } from "@/lib/utils";
import BrandLogo from "@/components/brand/BrandLogo";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useTheme } from "@/components/providers/ThemeProvider";

type Me = { phone: string; name: string; balance: number } | null;

/** Must match SideBar desktop width */
const SIDEBAR_W = "w-[17.5rem]";

export function TopBar() {
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);
  const [q, setQ] = useState("");
  const { toggle, collapsed, toggleCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const inverted = theme === "dark";

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setMe({ ...d.user, balance: d.balance ?? 0 });
      })
      .catch(() => undefined);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  return (
    <header
      className="h-14 lg:h-16 border-b"
      style={{
        background: "var(--chrome)",
        color: "var(--chrome-text)",
        borderColor: "var(--chrome-border)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[90rem] items-center">
        {/* Logo + collapse in the sidebar column */}
        <div
          className={`hidden lg:flex ${
            collapsed ? "w-0 overflow-hidden p-0" : `${SIDEBAR_W} px-3`
          } shrink-0 items-center justify-between gap-2 h-full transition-[width] duration-200`}
        >
          {!collapsed && (
            <>
              <BrandLogo href="/" size="sm" product="bet" inverted={inverted} />
              <button
                type="button"
                onClick={toggleCollapsed}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 hover:opacity-80"
                style={{
                  background: "var(--chrome-elevated)",
                  color: "var(--chrome-muted)",
                }}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeftClose size={17} />
              </button>
            </>
          )}
        </div>

        <div className="flex flex-1 min-w-0 items-center gap-2 px-3 lg:px-5">
          {/* Mobile: logo + balance pill + avatar */}
          <div className="flex lg:hidden items-center gap-2 min-w-0 flex-1">
            <BrandLogo href="/" size="sm" product="bet" inverted={inverted} />
            <button
              type="button"
              onClick={toggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "var(--chrome-elevated)",
                color: "var(--chrome-text)",
              }}
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>

            <div className="ml-auto flex items-center gap-2 shrink-0">
              {me ? (
                <>
                  <Link
                    href="/me?tab=deposit"
                    className="balance-pill"
                    aria-label="Wallet balance"
                  >
                    <span className="balance-pill__icon">
                      <Wallet size={13} strokeWidth={2.5} />
                    </span>
                    <span className="balance-pill__amount tabular-nums">
                      {formatNaira(Math.round(me.balance * 100))}
                    </span>
                    <ChevronDown size={12} className="balance-pill__chev opacity-60" />
                  </Link>
                  <Link
                    href="/me"
                    className="topbar-avatar"
                    aria-label="Account"
                  >
                    <User size={16} />
                    <span className="topbar-avatar__badge">VIP</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[12px] font-semibold px-2 py-1.5"
                    style={{ color: "var(--chrome-muted)" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center h-9 rounded-full bg-accent-green text-[#0A1433] text-[12px] font-bold px-3.5"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>

          {collapsed && (
            <>
              <div className="hidden lg:block shrink-0">
                <BrandLogo href="/" size="sm" product="bet" inverted={inverted} />
              </div>
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex w-10 h-10 rounded-2xl items-center justify-center shrink-0 hover:opacity-80"
                style={{ background: "var(--chrome-elevated)" }}
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            </>
          )}

          <form
            onSubmit={onSearch}
            className="hidden lg:flex flex-1 max-w-md items-center gap-2 h-10 rounded-full px-3.5"
            style={{ background: "var(--chrome-elevated)" }}
          >
            <Search
              size={16}
              className="shrink-0"
              style={{ color: "var(--chrome-muted)" }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search matches, leagues…"
              className="w-full bg-transparent text-[13px] font-medium outline-none placeholder:text-[color:var(--chrome-muted)]"
              style={{
                color: "var(--chrome-text)",
              }}
            />
          </form>

          <div className="hidden lg:flex ml-auto items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80"
              style={{ background: "var(--chrome-elevated)" }}
              aria-label={
                theme === "light" ? "Switch to dark mode" : "Switch to light mode"
              }
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {me ? (
              <>
                <Link
                  href="/me?tab=deposit"
                  className="balance-pill balance-pill--lg"
                >
                  <span className="balance-pill__icon">
                    <Wallet size={14} strokeWidth={2.5} />
                  </span>
                  <span className="balance-pill__amount tabular-nums">
                    {formatNaira(Math.round(me.balance * 100))}
                  </span>
                  <ChevronDown size={13} className="balance-pill__chev opacity-60" />
                </Link>
                <Link
                  href="/me"
                  className="topbar-avatar topbar-avatar--lg"
                  aria-label="Account"
                >
                  <User size={18} />
                  <span className="topbar-avatar__badge">VIP</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-semibold px-2 py-2 hover:opacity-80"
                  style={{ color: "var(--chrome-muted)" }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center h-10 rounded-full bg-accent-green text-[#0A1433] text-[13px] font-bold px-4"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
