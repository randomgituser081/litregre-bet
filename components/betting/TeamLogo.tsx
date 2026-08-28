"use client";

import clsx from "clsx";

type Props = {
  src?: string | null;
  name: string;
  size?: "sm" | "md";
  className?: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TeamLogo({ src, name, size = "md", className }: Props) {
  const dim = size === "sm" ? "match-card__crest--sm" : "match-card__crest";

  if (src) {
    return (
      <span className={clsx("match-card__crest overflow-hidden bg-white/90", dim, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            if (el.parentElement) {
              el.parentElement.textContent = initials(name);
            }
          }}
        />
      </span>
    );
  }

  return (
    <span className={clsx("match-card__crest", dim, className)}>
      {initials(name)}
    </span>
  );
}
