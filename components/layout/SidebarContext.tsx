"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type SidebarCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
};

const Ctx = createContext<SidebarCtx>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const toggleCollapsed = useCallback(() => setCollapsed((v) => !v), []);
  return (
    <Ctx.Provider
      value={{
        open,
        setOpen,
        toggle,
        collapsed,
        setCollapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSidebar() {
  return useContext(Ctx);
}
