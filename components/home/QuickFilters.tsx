"use client";

import clsx from "clsx";

type Props = {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
};

export function QuickFilters({ items, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-3 scrollbar-hide">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={clsx(
            "chip-filter",
            active === item.id && "chip-filter-active"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
