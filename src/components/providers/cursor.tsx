"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Desktop-only cursor: a precise dot + a lagging ring. Elements opt in with
 * data-cursor="link" | "view" and optional data-cursor-label.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "link" | "view" | "text">("default");
  const [label, setLabel] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      const target = el?.closest<HTMLElement>("[data-cursor], a, button, [role='button'], input, textarea, select, label");
      if (!target) {
        setVariant("default");
        setLabel(null);
      } else if (target.dataset.cursor === "view") {
        setVariant("view");
        setLabel(target.dataset.cursorLabel ?? "View");
      } else if (["INPUT", "TEXTAREA"].includes(target.tagName)) {
        setVariant("text");
        setLabel(null);
      } else {
        setVariant("link");
        setLabel(null);
      }
      const surface = el?.closest<HTMLElement>("[data-surface]");
      setDark(surface ? surface.dataset.surface === "dark" : true);
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  const ring = variant === "view" ? 84 : variant === "link" ? 44 : variant === "text" ? 4 : 30;
  const color = dark ? "rgba(240,213,154,0.9)" : "rgba(11,23,42,0.75)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ring,
          height: variant === "text" ? 22 : ring,
          borderRadius: variant === "text" ? 2 : 999,
          backgroundColor: variant === "view" ? "rgba(217,164,65,0.95)" : "rgba(0,0,0,0)",
          border: variant === "view" ? "0px solid transparent" : `1px solid ${color}`,
          scale: down ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="eyebrow text-[10px] text-navy-900"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-[5px] w-[5px] rounded-full"
        style={{ x, y, translateX: "-50%", translateY: "-50%", backgroundColor: dark ? "#F0D59A" : "#0B172A" }}
        animate={{ opacity: variant === "view" || variant === "text" ? 0 : 1 }}
      />
    </div>
  );
}
