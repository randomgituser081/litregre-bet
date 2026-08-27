"use client";

import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, User } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import BrandLogo from "@/components/brand/BrandLogo";
import { useTheme } from "@/components/providers/ThemeProvider";

const HERO_IMAGE = "/images/hero-footballer.png";

type Props = {
  balanceKobo?: number;
  loggedIn?: boolean;
};

export function HeroBanner({ balanceKobo, loggedIn }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1433]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover object-[center_35%] sm:object-[60%_40%] lg:object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1433]/95 via-[#0A1433]/55 to-transparent lg:from-[#0A1433]/90 lg:via-[#0A1433]/35 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[#0A1433]/50 to-[#0A1433]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1433]/55 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-12 sm:pb-14 lg:pb-16 min-h-[22rem] sm:min-h-[26rem] lg:min-h-[32rem] flex flex-col">
        <header className="flex items-center justify-between gap-3 shrink-0">
          <BrandLogo href="/" size="md" inverted product="bet" />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {loggedIn ? (
              <>
                <div className="text-right hidden xs:block sm:block">
                  <p className="text-sm sm:text-base font-bold tabular-nums leading-tight text-white">
                    {formatNaira(balanceKobo ?? 0)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/50 font-medium">
                    My Balance
                  </p>
                </div>
                <Link
                  href="/me"
                  aria-label="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/90 flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors"
                >
                  <User size={18} strokeWidth={2} className="text-white" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                <Link
                  href="/register"
                  className="bg-accent-green text-[#0A1433] px-4 py-2 rounded-full hover:bg-accent-lime transition-colors"
                >
                  Join
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className="relative mt-auto pt-10 sm:pt-12 lg:pt-16 lg:max-w-xl">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -left-2 sm:left-0 bottom-0 text-[7rem] sm:text-[9rem] lg:text-[11rem] font-black leading-none text-white/[0.07] tracking-tighter"
          >
            11
          </span>

          <div className="relative flex gap-3 sm:gap-4 items-stretch">
            <div
              className="w-1 sm:w-1.5 shrink-0 rounded-full bg-accent-green self-stretch min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[6.5rem]"
              aria-hidden
            />
            <div className="py-0.5">
              <h1 className="text-[1.75rem] sm:text-4xl lg:text-[3.25rem] xl:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">
                Big Nights.
                <br />
                Bigger Wins.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mt-3 sm:mt-4 font-medium">
                Back the best.{" "}
                <span className="text-accent-lime font-bold">Be LitreGre.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
