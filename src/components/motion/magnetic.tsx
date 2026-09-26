"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsTouch, useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

/** Pulls its child up to `strength`px toward the cursor, springs back on leave. */
export function Magnetic({ children, strength = 6, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const off = touch || reduced;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={off ? undefined : { x: sx, y: sy }}
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        x.set(Math.max(-1, Math.min(1, dx)) * strength);
        y.set(Math.max(-1, Math.min(1, dy)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
