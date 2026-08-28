"use client";

import { Ticket } from "lucide-react";
import { useSlipStore } from "@/lib/slip-store";
import clsx from "clsx";

export function SlipFab() {
  const count = useSlipStore((s) => s.legs.length);
  const setOpen = useSlipStore((s) => s.setOpen);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={clsx(
        "fixed z-[85] right-3 bottom-[5.55rem]",
        "bg-accent-green text-[#0A1433]",
        "flex items-center gap-1.5 px-3 py-2.5 rounded-md shadow-lg",
        "text-[12px] font-black transition-transform active:scale-95"
      )}
      aria-label="Open betslip"
    >
      <Ticket size={16} strokeWidth={2.5} />
      Betslip
      <span className="min-w-[1.15rem] h-[1.15rem] rounded-sm bg-[#0A1433] text-accent-green text-[10px] font-black flex items-center justify-center px-1">
        {count}
      </span>
    </button>
  );
}
