"use client";
import { create } from "zustand";

type CursorVariant = "default" | "link" | "view" | "hidden";

interface UIState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  cursor: CursorVariant;
  cursorLabel: string | null;
  setCursor: (v: CursorVariant, label?: string | null) => void;
}

export const useUI = create<UIState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  cursor: "default",
  cursorLabel: null,
  setCursor: (cursor, cursorLabel = null) => set({ cursor, cursorLabel }),
}));
