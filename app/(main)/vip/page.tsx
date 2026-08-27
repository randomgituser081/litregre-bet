"use client";

import Link from "next/link";
import { Crown, Check, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const TIERS = [
  {
    name: "Green",
    price: "Free",
    blurb: "Standard sportsbook access with demo wallet tools.",
    perks: ["Live & pre-match football", "Betslip + booking codes", "Light & dark themes"],
    cta: { href: "/register", label: "Join free" },
    highlight: false,
  },
  {
    name: "VIP",
    price: "Invite",
    blurb: "Priority odds movement alerts and exclusive weekend boosts.",
    perks: [
      "Priority customer service",
      "Exclusive promo codes",
      "Higher slip limits (Phase 2)",
      "Early market access",
    ],
    cta: { href: "/me", label: "Check eligibility" },
    highlight: true,
  },
  {
    name: "Black",
    price: "Invite+",
    blurb: "Personal manager energy for high-volume football players.",
    perks: ["Dedicated account manager", "Custom limits", "Private promotions"],
    cta: { href: "/promotions", label: "See promotions" },
    highlight: false,
  },
];

export default function VipPage() {
  return (
    <div className="pb-24">
      <PageHeader
        title="VIP Club"
        subtitle="Play more. Unlock sharper edges."
        backHref="/"
      />

      <div className="px-3 sm:px-5 space-y-4">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0A1433] via-[#1a1040] to-[#7C3AED] p-6 text-white min-h-[10rem]">
          <div className="relative z-10 max-w-md">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-lime/90">
              <Crown size={14} /> LitreGre VIP
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight">
              Chase the green with club benefits
            </h2>
            <p className="mt-2 text-[13px] text-white/80 leading-relaxed">
              VIP is rolling out with live wallet. For now, explore tiers and keep
              stacking real football markets.
            </p>
            <Link
              href="/promotions"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-green text-[#0A1433] px-4 py-2.5 text-[13px] font-bold"
            >
              <Sparkles size={14} />
              View promotions
            </Link>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`card-surface rounded-2xl p-5 flex flex-col ${
                tier.highlight
                  ? "ring-2 ring-accent-green/60 shadow-[0_12px_28px_rgba(34,211,102,0.12)]"
                  : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-[17px] font-black text-ink">{tier.name}</h3>
                <span className="text-[12px] font-bold text-accent-green">
                  {tier.price}
                </span>
              </div>
              <p className="mt-2 text-[12px] text-muted leading-snug flex-1">
                {tier.blurb}
              </p>
              <ul className="mt-4 space-y-2">
                {tier.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2 text-[12px] text-ink/80"
                  >
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-accent-green"
                      strokeWidth={2.5}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.cta.href}
                className={`mt-5 inline-flex h-10 items-center justify-center rounded-full text-[13px] font-bold ${
                  tier.highlight
                    ? "bg-accent-green text-[#0A1433]"
                    : "border border-surface-border text-ink hover:border-accent-green/50"
                }`}
              >
                {tier.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
