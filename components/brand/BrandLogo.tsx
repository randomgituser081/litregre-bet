"use client";

import Image from "next/image";
import Link from "next/link";

/** Processed from official litre-images assets — do not redraw in SVG. */
const BRAND = {
  light: { src: "/brand/logo-light.png", width: 1984, height: 453 },
  dark: { src: "/brand/logo-dark.png", width: 1169, height: 268 },
  mark: { src: "/brand/mark.png", width: 615, height: 426 },
} as const;

type MarkProps = {
  size?: number;
  className?: string;
  inverted?: boolean;
  animate?: boolean;
};

export function BrandMark({
  size = 40,
  className = "",
}: MarkProps) {
  const asset = BRAND.mark;
  const w = Math.round(size * (asset.width / asset.height));

  return (
    <Image
      src={asset.src}
      alt=""
      width={w}
      height={size}
      className={`block h-auto w-auto object-contain ${className}`}
      style={{ height: size, width: w }}
      aria-hidden
      priority
    />
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

const heights = { sm: 32, md: 40, lg: 48 } as const;

export default function BrandLogo({
  href = "/",
  size = "md",
  inverted = false,
  showWordmark = true,
  className = "",
}: LogoProps) {
  const h = heights[size];
  const asset = showWordmark
    ? inverted
      ? BRAND.dark
      : BRAND.light
    : BRAND.mark;
  const w = Math.round(h * (asset.width / asset.height));

  const content = (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={asset.src}
        alt="LitreGre Prediction"
        width={w}
        height={h}
        className="block h-auto w-auto max-w-none object-contain object-left"
        style={{ height: h, width: w }}
        priority
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="flex-shrink-0 hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
