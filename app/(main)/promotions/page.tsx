"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Percent, Sparkles, Ticket } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const PROMOS = [
  {
    id: "welcome",
    href: "/register",
    eyebrow: "New players",
    title: "Welcome bonus waiting",
    body: "Join LitreGre Bet and unlock first-deposit offers when banking goes live.",
    cta: "Create account",
    tone: "from-[#1e5c40] via-[#174a34] to-[#0A1433]",
    wash: "linear-gradient(90deg, #1e5c40 0%, #1e5c40 40%, rgba(30,92,64,0.75) 58%, transparent 85%)",
    image: "/images/hero/saka-join-original.png",
    icon: Gift,
  },
  {
    id: "codes",
    href: "/open-bets",
    eyebrow: "Booking codes",
    title: "Load a code. Share a slip.",
    body: "Generate booking codes from your slip and claim shared tips from friends.",
    cta: "Open bets",
    tone: "from-[#2563EB] via-[#1D4ED8] to-[#0A1433]",
    wash: "linear-gradient(90deg, #2563EB 0%, #2563EB 40%, rgba(37,99,235,0.75) 58%, transparent 85%)",
    image: "/images/hero/saka-gift-original.png",
    icon: Ticket,
  },
  {
    id: "weekend",
    href: "/?tab=today",
    eyebrow: "Weekend special",
    title: "Chase the green this weekend",
    body: "Stack Premier League and UCL markets — odds that move with the match.",
    cta: "Today’s picks",
    tone: "from-[#7C3AED] via-[#5B21B6] to-[#0A1433]",
    wash: "linear-gradient(90deg, #7C3AED 0%, #7C3AED 40%, rgba(124,58,237,0.75) 58%, transparent 85%)",
    image: "/images/hero/saka-hero-original.png",
    icon: Sparkles,
  },
];

const BONUSES = [
  {
    title: "First deposit boost",
    detail: "Coming with wallet Phase 2 — demo accounts track bonus balance already.",
    tag: "Soon",
  },
  {
    title: "Reload Friday",
    detail: "Weekly top-up boost for active sports players.",
    tag: "Soon",
  },
  {
    title: "Accumulator insurance",
    detail: "One leg fails? Partial refund on selected multi-bets.",
    tag: "VIP+",
  },
  {
    title: "Referral credits",
    detail: "Invite friends — both of you earn betting credits.",
    tag: "Soon",
  },
];

export default function PromotionsPage() {
  return (
    <div className="pb-24">
      <PageHeader
        title="Promotions"
        subtitle="Offers, codes & bonuses built for football"
        backHref="/"
      />

      <div className="px-3 sm:px-5 space-y-4">
        {PROMOS.map((p) => (
          <Link
            key={p.id}
            href={p.href}
            className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${p.tone} min-h-[11rem] block text-white shadow-[0_14px_32px_rgba(10,20,51,0.18)]`}
          >
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-[55%]"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 22%, black 48%)",
              }}
            >
              <Image
                src={p.image}
                alt=""
                fill
                unoptimized
                className="object-cover object-[58%_18%]"
                sizes="280px"
              />
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: p.wash }}
            />
            <div className="relative z-10 flex h-full flex-col justify-center p-5 max-w-[58%]">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
                {p.eyebrow}
              </p>
              <h2 className="mt-1.5 text-[1.15rem] font-black leading-tight">
                {p.title}
              </h2>
              <p className="mt-2 text-[12px] text-white/85 leading-snug">
                {p.body}
              </p>
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold">
                <p.icon size={12} />
                {p.cta}
              </span>
            </div>
          </Link>
        ))}

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <Percent size={16} className="text-accent-green" />
            <h2 className="text-[16px] font-black text-ink">Bonuses</h2>
            <span className="ml-auto text-[11px] font-bold text-accent-green bg-accent-green/15 px-2 py-0.5 rounded-full">
              4
            </span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {BONUSES.map((b) => (
              <div key={b.title} className="card-surface p-4 rounded-2xl">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-bold text-ink">{b.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted bg-[var(--surface-raised)] px-2 py-0.5 rounded-full shrink-0">
                    {b.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] text-muted leading-snug">
                  {b.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
