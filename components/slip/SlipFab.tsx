"use client";

import { Ticket } from "lucide-react";
import { useSlipStore } from "@/lib/slip-store";
import clsx from "clsx";

export function SlipFab() {
  const count = useSlipStore((s) => s.legs.length);
  const setOpen = useSlipStore((s) => s.setOpen);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={clsx(
        "fixed z-[85] right-4 bottom-[4.5rem] w-14 h-14 rounded-full bg-accent-green text-black shadow-lg flex items-center justify-center",
        count === 0 && "opacity-90"
      )}
      aria-label="Open betslip"
    >
      <Ticket size={22} strokeWidth={2.5} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-white text-black text-xs font-black flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </button>
  );
}
