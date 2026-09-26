"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsTouch, useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  glareColor?: string;
  onHoverChange?: (h: boolean) => void;
};

/**
 * CSS-3D tilt: perspective(1000px) rotateX/Y following the cursor.
 * max 6deg · spring {stiffness 150, damping 20} · disabled on touch & reduced motion.
 */
export function TiltCard({ children, className, max = 6, glare = true, glareColor = "rgba(240,213,154,0.16)", onHoverChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const off = touch || reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 20 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, ${glareColor}, transparent 60%)`;
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        className={cn("relative h-full [transform-style:preserve-3d]", className)}
        style={off ? undefined : { rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (off || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerEnter={() => {
          glareOpacity.set(1);
          onHoverChange?.(true);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
          glareOpacity.set(0);
          onHoverChange?.(false);
        }}
      >
        {children}
        {glare && !off && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: glareOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
}
