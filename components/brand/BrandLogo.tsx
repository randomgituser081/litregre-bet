"use client";

import Link from "next/link";

type MarkProps = {
  size?: number;
  className?: string;
  inverted?: boolean;
  animate?: boolean;
};

const NAVY = "#0A1433";
const GREEN = "#22D366";
const ACCENT = "#7CFF30";

export function BrandMark({
  size = 40,
  className = "",
  inverted = false,
  animate = true,
}: MarkProps) {
  const lFill = inverted ? "#FFFFFF" : NAVY;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g opacity="0.9">
        <rect x="2" y="38" width="10" height="2.2" rx="1.1" fill={GREEN} transform="skewX(-12)" />
        <rect x="1" y="43" width="14" height="2" rx="1" fill={GREEN} opacity="0.75" transform="skewX(-12)" />
        <rect x="3" y="47.5" width="8" height="1.6" rx="0.8" fill={GREEN} opacity="0.55" transform="skewX(-12)" />
        <circle cx="5" cy="36.5" r="1.2" fill={GREEN} />
        <circle cx="9" cy="50.5" r="1" fill={GREEN} opacity="0.7" />
      </g>
      <path d="M18 12 L28 12 L24.5 42 L36 42 L34.5 50 L14 50 L18 12Z" fill={lFill} />
      <path
        d="M42 18 C52 18 58 26 56 36 C54 46 44 52 34 50 L35.5 42 C41 43 47 40 48 35 C49 29 45 24 39 24 L36 24 L37.2 16 L42 18Z"
        fill={GREEN}
      />
      <path d="M34 36 L48 36 L47 42 L32 42 L34 36Z" fill={GREEN} />
      <g className={animate ? "lg-arrow-rise" : undefined}>
        <path d="M38 44 L46 28 L50 29.5 L42 45.5 Z" fill={ACCENT} />
        <path d="M44.5 26 L54 24 L51.5 32 Z" fill={ACCENT} />
      </g>
    </svg>
  );
}

type LogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  showWordmark?: boolean;
  product?: "prediction" | "bet";
  className?: string;
  animate?: boolean;
};

const sizes = {
  sm: { mark: 28, text: "text-base", sub: "text-[8px]" },
  md: { mark: 36, text: "text-lg", sub: "text-[9px]" },
  lg: { mark: 44, text: "text-xl", sub: "text-[10px]" },
};

export default function BrandLogo({
  href = "/",
  size = "md",
  inverted = false,
  showWordmark = true,
  product = "bet",
  className = "",
  animate = true,
}: LogoProps) {
  const s = sizes[size];
  const productLabel = product === "bet" ? "BET" : "PREDICTION";

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={s.mark} inverted={inverted} animate={animate} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-bold italic tracking-tight ${s.text} ${
              inverted ? "text-white" : "text-[var(--lg-ink)]"
            }`}
            style={{ fontFamily: "var(--font-sans), system-ui" }}
          >
            Litre
            <span className="text-[#22D366]">Gre</span>
          </span>
          <span
            className={`${s.sub} font-semibold tracking-[0.22em] uppercase mt-1 flex items-center gap-1.5 ${
              inverted ? "text-white/70" : "text-[var(--lg-ink)]/55"
            }`}
          >
            <span className="h-px w-3 bg-[#22D366]" />
            {productLabel}
            <span className="h-px w-3 bg-[#22D366]" />
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="flex-shrink-0 hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
