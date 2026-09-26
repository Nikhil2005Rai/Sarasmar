"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-media";

export function CountUp({ value, duration = 1.4, suffix = "", prefix = "", className, delay = 0 }: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced, delay]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** SVG ring that fills to `value`% with a gold stroke, with count-up in the middle. */
export function ProgressRing({
  value,
  size = 120,
  stroke = 6,
  color = "#D9A441",
  track = "rgba(11,23,42,0.08)",
  label,
  className,
  delay = 0,
  textClassName = "font-serif text-3xl text-navy-900",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  className?: string;
  delay?: number;
  textClassName?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [offset, setOffset] = useState(c);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setOffset(c * (1 - value / 100));
    const ctl = animate(c, c * (1 - value / 100), {
      duration: 1.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setOffset,
    });
    return () => ctl.stop();
  }, [inView, value, c, reduced, delay]);

  return (
    <div className={className} style={{ width: size, height: size, position: "relative" }}>
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={textClassName} style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round((1 - offset / c) * 100)}%</span>
        {label && <span className="eyebrow mt-1 text-[10px] text-ink-faint">{label}</span>}
      </div>
    </div>
  );
}
