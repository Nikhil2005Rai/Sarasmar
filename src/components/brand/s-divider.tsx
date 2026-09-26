"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

/** A horizontal S-wave that draws itself as it scrolls through the viewport. */
export function SDivider({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 45%"] });
  const length = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const star = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

  return (
    <div ref={ref} className={cn("relative h-16 w-full", className)} aria-hidden>
      <svg viewBox="0 0 1200 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sdiv" x1="0" x2="1">
            <stop offset="0" stopColor="#D9A441" stopOpacity="0" />
            <stop offset="0.3" stopColor="#D9A441" />
            <stop offset="0.7" stopColor={tone === "light" ? "#3568B8" : "#8A78C7"} />
            <stop offset="1" stopColor="#3568B8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 32 C 200 32, 260 6, 420 8 C 560 10, 560 56, 700 56 C 850 56, 880 30, 1200 32"
          fill="none"
          stroke="url(#sdiv)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : length }}
        />
      </svg>
      <motion.svg
        viewBox="-12 -12 24 24"
        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: reduced ? 1 : star, scale: reduced ? 1 : star }}
      >
        <path d="M0 -10 L1.6 -1.6 L10 0 L1.6 1.6 L0 10 L-1.6 1.6 L-10 0 L-1.6 -1.6 Z" fill="#D9A441" />
      </motion.svg>
    </div>
  );
}
