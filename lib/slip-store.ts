"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SlipLeg } from "@/lib/betting/markets";
import { legKey } from "@/lib/betting/markets";
import { MAX_SLIP_LEGS } from "@/lib/constants";

export { MAX_SLIP_LEGS };

type SlipState = {
  legs: SlipLeg[];
  stake: string;
  open: boolean;
  addLeg: (leg: SlipLeg) => boolean;
  removeLeg: (key: string) => void;
  clear: () => void;
  setStake: (v: string) => void;
  setOpen: (v: boolean) => void;
  loadLegs: (legs: SlipLeg[]) => void;
  hasLeg: (eventId: string, marketType: string, outcomeKey: string) => boolean;
};

export const useSlipStore = create<SlipState>()(
  persist(
    (set, get) => ({
      legs: [],
      stake: "100",
      open: false,
      addLeg: (leg) => {
        const key = legKey(leg.eventId, leg.marketType, leg.outcomeKey);
        const existing = get().legs.find(
          (l) => legKey(l.eventId, l.marketType, l.outcomeKey) === key
        );
        if (existing) return false;
        if (get().legs.length >= MAX_SLIP_LEGS) return false;
        set((s) => ({ legs: [...s.legs, leg], open: true }));
        return true;
      },
      removeLeg: (key) =>
        set((s) => ({
          legs: s.legs.filter(
            (l) => legKey(l.eventId, l.marketType, l.outcomeKey) !== key
          ),
        })),
      clear: () => set({ legs: [] }),
      setStake: (stake) => set({ stake }),
      setOpen: (open) => set({ open }),
      loadLegs: (legs) => set({ legs: legs.slice(0, MAX_SLIP_LEGS), open: true }),
      hasLeg: (eventId, marketType, outcomeKey) =>
        get().legs.some(
          (l) =>
            l.eventId === eventId &&
            l.marketType === marketType &&
            l.outcomeKey === outcomeKey
        ),
    }),
    { name: "litregre-bet-slip" }
  )
);

export function slipLegKey(leg: SlipLeg) {
  return legKey(leg.eventId, leg.marketType, leg.outcomeKey);
}
