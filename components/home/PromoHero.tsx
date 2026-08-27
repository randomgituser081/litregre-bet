"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const AUTO_MS = 5200;
const IMG_V = "photo-blend1";

type SlideTone = {
  card: string;
  /** Soft left→right color fade into the photo (keeps text readable) */
  wash: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  nav: string;
};

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  objectPos?: string;
  dark: SlideTone;
  light: SlideTone;
};

const TONE_ORANGE: SlideTone = {
  card: "from-[#FF6A1A] via-[#FF4D00] to-[#E03A00]",
  wash: "linear-gradient(90deg, #FF4D00 0%, #FF4D00 34%, rgba(255,77,0,0.82) 48%, rgba(255,77,0,0.35) 62%, transparent 78%)",
  eyebrow: "text-white/80",
  title: "text-white",
  body: "text-white/90",
  cta: "bg-white text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-black/20 text-white hover:bg-black/35",
};

const TONE_NAVY_LIGHT: SlideTone = {
  card: "from-[#0A1433] via-[#0f2a1f] to-[#1a6b3c]",
  wash: "linear-gradient(90deg, #0A1433 0%, #0A1433 34%, rgba(10,20,51,0.88) 48%, rgba(10,20,51,0.35) 62%, transparent 78%)",
  eyebrow: "text-accent-green",
  title: "text-white",
  body: "text-white/85",
  cta: "bg-accent-green text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-white/15 text-white hover:bg-white/25",
};

const TONE_GUNNER_DARK: SlideTone = {
  card: "from-[#EF0107] via-[#9B0000] to-[#0A1433]",
  wash: "linear-gradient(90deg, #9B0000 0%, #9B0000 34%, rgba(155,0,0,0.85) 48%, rgba(155,0,0,0.35) 62%, transparent 78%)",
  eyebrow: "text-white/85",
  title: "text-white",
  body: "text-white/90",
  cta: "bg-white text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-black/25 text-white hover:bg-black/40",
};

const TONE_GUNNER_LIGHT: SlideTone = {
  card: "from-[#7A0C12] via-[#4A0A10] to-[#0A1433]",
  wash: "linear-gradient(90deg, #4A0A10 0%, #4A0A10 34%, rgba(74,10,16,0.88) 48%, rgba(74,10,16,0.35) 62%, transparent 78%)",
  eyebrow: "text-accent-green",
  title: "text-white",
  body: "text-white/85",
  cta: "bg-accent-green text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-white/15 text-white hover:bg-white/25",
};

const TONE_FOREST_DARK: SlideTone = {
  card: "from-[#0A1433] via-[#14532d] to-[#22D366]",
  wash: "linear-gradient(90deg, #0A1433 0%, #0A1433 34%, rgba(10,20,51,0.85) 48%, rgba(20,83,45,0.35) 62%, transparent 78%)",
  eyebrow: "text-accent-lime/90",
  title: "text-white",
  body: "text-white/90",
  cta: "bg-white text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-black/20 text-white hover:bg-black/35",
};

const TONE_FOREST_LIGHT: SlideTone = {
  card: "from-[#14532d] via-[#0f3d24] to-[#0A1433]",
  wash: "linear-gradient(90deg, #14532d 0%, #14532d 34%, rgba(20,83,45,0.88) 48%, rgba(20,83,45,0.35) 62%, transparent 78%)",
  eyebrow: "text-accent-lime",
  title: "text-white",
  body: "text-white/85",
  cta: "bg-white text-[#0A1433] hover:bg-accent-lime",
  nav: "bg-white/15 text-white hover:bg-white/25",
};

/** Full photos with their own backgrounds — left color washes into the image */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: "saka-win",
    eyebrow: "Premier League",
    title: "Win big on football this season",
    body: "Place your share of daily markets across Premier League, UCL & more.",
    cta: "Place a bet",
    href: "/sports/football/epl",
    image: `/images/hero/saka-hero-original.png?v=${IMG_V}`,
    alt: "Bukayo Saka",
    objectPos: "object-[62%_12%]",
    dark: TONE_ORANGE,
    light: TONE_NAVY_LIGHT,
  },
  {
    id: "saka-live",
    eyebrow: "Live markets",
    title: "Feel every chance. Bet as it happens.",
    body: "From kickoff to stoppage time — in-play football that keeps pace with the game.",
    cta: "Go live",
    href: "/?tab=live",
    image: `/images/hero/saka-join-original.png?v=${IMG_V}`,
    alt: "Bukayo Saka celebrating",
    objectPos: "object-[58%_18%]",
    dark: TONE_GUNNER_DARK,
    light: TONE_GUNNER_LIGHT,
  },
  {
    id: "saka-picks",
    eyebrow: "Today’s picks",
    title: "Build your slip. Chase the green.",
    body: "Stack real football markets — Premier League to UCL — and ride the run.",
    cta: "Browse sports",
    href: "/sports",
    image: `/images/hero/saka-gift-original.png?v=${IMG_V}`,
    alt: "Bukayo Saka with the ball",
    objectPos: "object-[55%_20%]",
    dark: TONE_FOREST_DARK,
    light: TONE_FOREST_LIGHT,
  },
];

const SIDE_PROMOS = [
  {
    id: "join",
    href: "/register",
    title: "GET STARTED WITH LITREGRE",
    body: "Join and start placing on real football markets.",
    image: `/images/hero/saka-join-original.png?v=${IMG_V}`,
    objectPos: "object-[60%_20%]",
    dark: {
      card: "from-[#3B82FF] via-[#2563EB] to-[#1D4ED8]",
      wash: "linear-gradient(90deg, #2563EB 0%, #2563EB 36%, rgba(37,99,235,0.85) 52%, rgba(37,99,235,0.3) 68%, transparent 86%)",
      text: "text-white",
      muted: "text-white/90",
      chip: "bg-white/20 group-hover:bg-white/30",
    },
    light: {
      card: "from-[#1e5c40] via-[#174a34] to-[#0f3324]",
      wash: "linear-gradient(90deg, #1e5c40 0%, #1e5c40 36%, rgba(30,92,64,0.88) 52%, rgba(30,92,64,0.3) 68%, transparent 86%)",
      text: "text-white",
      muted: "text-white/85",
      chip: "bg-white/15 text-white group-hover:bg-white/25",
    },
  },
  {
    id: "gift",
    href: "/promotions",
    title: "CLAIM YOUR GIFT",
    body: "Promos & booking codes waiting in your slip.",
    image: `/images/hero/saka-gift-original.png?v=${IMG_V}`,
    objectPos: "object-[58%_22%]",
    dark: {
      card: "from-[#A855F7] via-[#7C3AED] to-[#5B21B6]",
      wash: "linear-gradient(90deg, #7C3AED 0%, #7C3AED 36%, rgba(124,58,237,0.85) 52%, rgba(124,58,237,0.3) 68%, transparent 86%)",
      text: "text-white",
      muted: "text-white/90",
      chip: "bg-white/20 group-hover:bg-white/30",
    },
    light: {
      card: "from-[#243d32] via-[#1a2e26] to-[#0f1f1a]",
      wash: "linear-gradient(90deg, #243d32 0%, #243d32 36%, rgba(36,61,50,0.88) 52%, rgba(36,61,50,0.3) 68%, transparent 86%)",
      text: "text-white",
      muted: "text-white/85",
      chip: "bg-accent-green/25 text-accent-lime group-hover:bg-accent-green/35",
    },
  },
] as const;

export function PromoHero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const slide = HERO_SLIDES[i];
  const tone = isLight ? slide.light : slide.dark;
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setI((v) => (v + 1) % HERO_SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, i]);

  function go(n: number) {
    setI(((n % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }
  function prev() {
    go(i - 1);
  }
  function next() {
    go(i + 1);
  }

  return (
    <section className="w-full p-3 sm:p-4 lg:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 lg:min-h-[22rem]">
        <div
          className={`relative lg:col-span-2 overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tone.card} min-h-[16rem] sm:min-h-[18rem] lg:min-h-full transition-[background] duration-500 ${
            isLight
              ? "shadow-[0_12px_32px_rgba(10,20,51,0.12)]"
              : "shadow-[0_18px_40px_rgba(10,20,51,0.14)]"
          }`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            touchX.current = null;
            setPaused(false);
            if (start == null || end == null) return;
            const dx = end - start;
            if (Math.abs(dx) < 48) return;
            if (dx > 0) prev();
            else next();
          }}
        >
          {/* Full photo (with its background) — soft left fade into the color wash */}
          {HERO_SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`pointer-events-none absolute inset-y-0 right-0 w-[62%] sm:w-[58%] transition-opacity duration-700 ease-out ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 18%, black 42%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 18%, black 42%)",
              }}
              aria-hidden={idx !== i}
            >
              <Image
                src={s.image}
                alt=""
                fill
                unoptimized
                priority={idx === 0}
                className={`object-cover ${s.objectPos ?? "object-center"}`}
                sizes="(max-width: 1024px) 65vw, 560px"
              />
            </div>
          ))}

          {/* Color → photo transition */}
          <div
            className="absolute inset-0 pointer-events-none transition-[background] duration-500"
            style={{ background: tone.wash }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8 max-w-[52%]">
            <div key={slide.id} className="hero-slide-copy">
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.18em] ${tone.eyebrow}`}
              >
                {slide.eyebrow}
              </p>
              <h1
                className={`mt-2 text-2xl sm:text-3xl lg:text-[2.15rem] font-black leading-[1.1] tracking-tight ${tone.title}`}
              >
                {slide.title}
              </h1>
              <p
                className={`mt-3 text-[13px] sm:text-sm max-w-md leading-relaxed ${tone.body}`}
              >
                {slide.body}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <Link
                href={slide.href}
                className={`inline-flex items-center justify-center rounded-full text-[13px] sm:text-sm font-bold px-5 py-2.5 transition-colors ${tone.cta}`}
              >
                {slide.cta}
              </Link>

              <div className="flex items-center gap-1.5 ml-1">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === i
                        ? "w-6 bg-accent-green"
                        : "w-1.5 bg-white/35 hover:bg-white/55"
                    }`}
                    aria-label={`Go to slide ${idx + 1}: ${s.alt}`}
                    aria-current={idx === i}
                  />
                ))}
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${tone.nav}`}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${tone.nav}`}
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/20 z-20">
            <div
              key={`${i}-${paused}`}
              className={`h-full bg-accent-green/90 origin-left ${
                paused ? "" : "hero-progress"
              }`}
              style={paused ? { width: "0%" } : undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4">
          {SIDE_PROMOS.map((promo) => {
            const p = isLight ? promo.light : promo.dark;
            return (
              <Link
                key={promo.id}
                href={promo.href}
                className={`group relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${p.card} min-h-[10.5rem] transition ${
                  isLight
                    ? "shadow-[0_10px_28px_rgba(10,20,51,0.1)] hover:brightness-[1.03]"
                    : "hover:brightness-110 shadow-[0_14px_32px_rgba(10,20,51,0.12)]"
                }`}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-[58%]"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)",
                  }}
                >
                  <Image
                    src={promo.image}
                    alt=""
                    fill
                    unoptimized
                    className={`object-cover ${promo.objectPos} group-hover:scale-[1.03] transition-transform duration-500`}
                    sizes="240px"
                  />
                </div>

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: p.wash }}
                />

                <div className="relative z-10 flex h-full flex-col justify-center p-4 sm:p-5 max-w-[52%]">
                  <p
                    className={`text-[14px] sm:text-[15px] font-black leading-tight tracking-tight ${p.text}`}
                  >
                    {promo.title}
                  </p>
                  <p className={`mt-2 text-[12px] leading-snug ${p.muted}`}>
                    {promo.body}
                  </p>
                  <span
                    className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${p.chip}`}
                  >
                    Open
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
