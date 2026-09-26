"use client";

import { motion, useInView } from "framer-motion";
import { useId, useRef } from "react";
import { EASE_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The SARASMER "S" — a ribbon of three strands (gold / royal / hairline) that reads as
 * a flowing river, a scroll of text, and a wing at once. The paths are exported so the
 * same curve can be reused for dividers, loaders, progress, and 3D connection lines.
 */
export const S_VIEWBOX = "0 0 120 160";
export const S_PATHS = {
  gold: "M94 20 C 62 2, 20 16, 25 47 C 30 79, 93 73, 95 108 C 97 141, 55 158, 22 141",
  royal: "M103 33 C 76 19, 40 26, 41 49 C 42 72, 105 71, 105 111 C 105 147, 62 163, 31 152",
  hair: "M86 12 C 52 -2, 10 14, 14 45 C 18 76, 82 76, 85 106 C 88 134, 50 150, 16 131",
} as const;

/** 8-point compass sparkle, centered on 0,0 with radius 10 */
export const SPARKLE =
  "M0 -10 L1.6 -1.6 L10 0 L1.6 1.6 L0 10 L-1.6 1.6 L-10 0 L-1.6 -1.6 Z M0 -5.5 L0.7 -0.7 L5.5 0 L0.7 0.7 L0 5.5 Z";

type Props = {
  className?: string;
  /** draw the strokes in when scrolled into view */
  draw?: boolean;
  /** draw immediately on mount instead of on view */
  drawOnMount?: boolean;
  tone?: "dark" | "light";
  sparkle?: boolean;
  strokeScale?: number;
  duration?: number;
  loop?: boolean;
  title?: string;
};

export function SMark({
  className,
  draw = false,
  drawOnMount = false,
  tone = "dark",
  sparkle = true,
  strokeScale = 1,
  duration = 1.8,
  loop = false,
  title = "SARASMER",
}: Props) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: !loop, margin: "-10% 0px" });
  const animated = draw || drawOnMount;
  const active = drawOnMount || inView;

  const strand = (d: string, stroke: string, width: number, delay: number, opacity = 1) => (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width * strokeScale}
      strokeLinecap="round"
      initial={animated ? { pathLength: 0, opacity: 0 } : false}
      animate={
        animated
          ? active
            ? loop
              ? { pathLength: [0, 1, 1], opacity: [0, opacity, 0], pathOffset: [0, 0, 1] }
              : { pathLength: 1, opacity }
            : { pathLength: 0, opacity: 0 }
          : undefined
      }
      transition={
        loop
          ? { duration: duration * 1.4, ease: EASE_QUINT, repeat: Infinity, delay, times: [0, 0.6, 1] }
          : { pathLength: { duration, ease: EASE_QUINT, delay }, opacity: { duration: 0.3, delay } }
      }
      style={animated ? undefined : { opacity }}
    />
  );

  return (
    <svg ref={ref} viewBox={S_VIEWBOX} className={cn("overflow-visible", className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0D59A" />
          <stop offset="0.55" stopColor="#D9A441" />
          <stop offset="1" stopColor="#B07A22" />
        </linearGradient>
        <linearGradient id={`r-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FB2EC" />
          <stop offset="0.5" stopColor="#3568B8" />
          <stop offset="1" stopColor={tone === "dark" ? "#8A78C7" : "#142B4A"} />
        </linearGradient>
      </defs>
      {strand(S_PATHS.hair, tone === "dark" ? "rgba(248,245,239,0.55)" : "rgba(11,23,42,0.35)", 0.9, 0.25)}
      {strand(S_PATHS.royal, `url(#r-${id})`, 4.2, 0.12)}
      {strand(S_PATHS.gold, `url(#g-${id})`, 6, 0)}
      {sparkle && (
        <motion.path
          d={SPARKLE}
          fill={`url(#g-${id})`}
          transform="translate(104 64) scale(0.9)"
          initial={animated ? { opacity: 0, scale: 0.4 } : false}
          animate={animated ? (active ? { opacity: 1, scale: 0.9 } : { opacity: 0, scale: 0.4 }) : undefined}
          transition={{ duration: 0.9, ease: EASE_QUINT, delay: animated ? duration * 0.7 : 0 }}
          style={{ transformOrigin: "104px 64px", transformBox: "view-box" }}
        />
      )}
    </svg>
  );
}
