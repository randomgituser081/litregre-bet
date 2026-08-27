"use client";

import clsx from "clsx";

type Props = {
  label: string;
  odds: number;
  selected?: boolean;
  onClick: () => void;
  sub?: string;
  className?: string;
};

export function OddsButton({
  label,
  odds,
  selected,
  onClick,
  sub,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("odds-btn", selected && "odds-btn-selected", className)}
    >
      {sub && (
        <span className="text-[9px] font-medium opacity-70 leading-none truncate max-w-full px-0.5">
          {sub}
        </span>
      )}
      <span className="leading-none tabular-nums">{odds.toFixed(2)}</span>
      {!sub && label && (
        <span className="text-[9px] font-normal opacity-60 leading-none mt-0.5 truncate max-w-full px-0.5">
          {label}
        </span>
      )}
    </button>
  );
}
