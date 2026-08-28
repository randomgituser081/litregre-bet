"use client";

import Image from "next/image";
import Link from "next/link";

/** Processed from official litre-images assets — do not redraw in SVG. */
const BRAND = {
  light: { src: "/brand/logo-light.png", width: 1984, height: 453 },
  dark: { src: "/brand/logo-dark.png", width: 1984, height: 453 },
  mark: { src: "/brand/mark.png", width: 615, height: 426 },
  markLight: { src: "/brand/mark-light.png", width: 414, height: 170 },
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
  inverted = false,
}: MarkProps) {
  const asset = inverted ? BRAND.markLight : BRAND.mark;
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

function BetWordmark({
  h,
  inverted,
}: {
  h: number;
  inverted: boolean;
}) {
  const markAsset = inverted ? BRAND.markLight : BRAND.mark;
  const markH = Math.round(h * 0.92);
  const markW = Math.round(markH * (markAsset.width / markAsset.height));

  return (
    <span className="inline-flex items-center gap-1.5">
      <Image
        src={markAsset.src}
        alt=""
        width={markW}
        height={markH}
        className="block object-contain"
        style={{ height: markH, width: markW }}
        aria-hidden
        priority
      />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight ${inverted ? "text-white" : "text-ink"}`}
          style={{ fontSize: Math.round(h * 0.38) }}
        >
          LitreGre
        </span>
        <span
          className="font-black uppercase tracking-[0.18em] text-accent-green"
          style={{ fontSize: Math.round(h * 0.28) }}
        >
          Bet
        </span>
      </span>
    </span>
  );
}

export default function BrandLogo({
  href = "/",
  size = "md",
  inverted = false,
  showWordmark = true,
  product = "bet",
  className = "",
}: LogoProps) {
  const h = heights[size];

  const content =
    product === "bet" ? (
      <span className={`inline-flex items-center ${className}`}>
        <BetWordmark h={h} inverted={inverted} />
      </span>
    ) : (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src={
            (showWordmark
              ? inverted
                ? BRAND.dark
                : BRAND.light
              : inverted
                ? BRAND.markLight
                : BRAND.mark
            ).src
          }
          alt="LitreGre Prediction"
          width={Math.round(
            h *
              ((showWordmark
                ? inverted
                  ? BRAND.dark
                  : BRAND.light
                : inverted
                  ? BRAND.markLight
                  : BRAND.mark
              ).width /
                (showWordmark
                  ? inverted
                    ? BRAND.dark
                    : BRAND.light
                  : inverted
                    ? BRAND.markLight
                    : BRAND.mark
                ).height)
          )}
          height={h}
          className="block h-auto w-auto max-w-none object-contain object-left"
          style={{
            height: h,
            width: Math.round(
              h *
                ((showWordmark
                  ? inverted
                    ? BRAND.dark
                    : BRAND.light
                  : inverted
                    ? BRAND.markLight
                    : BRAND.mark
                ).width /
                  (showWordmark
                    ? inverted
                      ? BRAND.dark
                      : BRAND.light
                    : inverted
                      ? BRAND.markLight
                      : BRAND.mark
                  ).height)
            ),
          }}
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
