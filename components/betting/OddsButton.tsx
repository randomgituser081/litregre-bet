"use client";

import clsx from "clsx";

type Props = {
  label: string;
  odds: number;
  selected?: boolean;
  onClick: () => void;
  sub?: string;
};

export function OddsButton({ label, odds, selected, onClick, sub }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx("odds-btn", selected && "odds-btn-selected")}
    >
      {sub && (
        <span className="text-[9px] font-medium opacity-70 leading-none">{sub}</span>
      )}
      <span className="leading-none">{odds.toFixed(2)}</span>
      {!sub && label && (
        <span className="text-[9px] font-normal opacity-60 leading-none mt-0.5">
          {label}
        </span>
      )}
    </button>
  );
}
