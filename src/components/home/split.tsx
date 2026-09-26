"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { Arrow, Button } from "@/components/ui/button";
import { useIsDesktop, useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

const STUDENT = {
  id: "students",
  eyebrow: "For students",
  title: ["Build.", "Verify.", "Grow."],
  points: [
    "A structured profile companies actually read",
    "Assessments that turn skills into credentials",
    "Set your availability — get matched to those weeks",
    "Paid, scoped projects from two to eight weeks",
    "Reassess anytime; your record grows with you",
  ],
  cta: { label: "Join as a Student", href: "/signup?role=student" },
};

const COMPANY = {
  id: "companies",
  eyebrow: "For companies",
  title: ["Find.", "Match.", "Build."],
  points: [
    "Post a project in under five minutes",
    "Filter by verified score, not keywords",
    "See who’s free for your exact window",
    "Ranked matches with transparent fit scores",
    "Pay per project — no retainers, no agencies",
  ],
  cta: { label: "Hire Student Talent", href: "/signup?role=company" },
};

/** Builds the S-shaped leading edge of the dark panel at horizontal position x (0–1000). */
function edgePath(x: number) {
  const a = x + 38;
  const b = x - 38;
  return `M${a} 0 C ${a} 180, ${b} 260, ${b} 500 C ${b} 740, ${a} 820, ${a} 1000 L 1000 1000 L 1000 0 Z`;
}

export function Split() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<"s" | "c" | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 10%"] });
  const edgeX = useTransform(scrollYProgress, [0, 1], [reduced ? 500 : 0, 500]);
  const d = useTransform(edgeX, edgePath);
  const rightOpacity = useTransform(scrollYProgress, [0.55, 1], [reduced ? 1 : 0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {desktop ? (
        <div className="relative grid min-h-[92vh] grid-cols-2 bg-ivory">
          <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="split-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#D9A441" stopOpacity="0" />
                <stop offset="0.5" stopColor="#D9A441" />
                <stop offset="1" stopColor="#3568B8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path d={d} fill="#0B172A" />
            <motion.path d={d} fill="none" stroke="url(#split-edge)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <Panel data={STUDENT} tone="light" dim={hover === "c"} onHover={(h) => setHover(h ? "s" : null)} />
          <motion.div style={{ opacity: rightOpacity }} className="relative">
            <Panel data={COMPANY} tone="dark" dim={hover === "s"} onHover={(h) => setHover(h ? "c" : null)} />
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="bg-navy-900">
            <Panel data={COMPANY} tone="dark" />
          </div>
          <div className="relative h-16 bg-navy-900" aria-hidden>
            <svg viewBox="0 0 400 64" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d="M0 0 L0 30 C 100 70, 300 -10, 400 34 L400 64 L0 64 Z" fill="#F8F5EF" />
            </svg>
          </div>
          <div className="bg-ivory">
            <Panel data={STUDENT} tone="light" />
          </div>
        </div>
      )}
    </section>
  );
}

function Panel({ data, tone, dim = false, onHover }: { data: typeof STUDENT; tone: "light" | "dark"; dim?: boolean; onHover?: (h: boolean) => void }) {
  const dark = tone === "dark";
  return (
    <div
      id={data.id}
      data-surface={tone}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      className={cn(
        "relative flex h-full scroll-mt-20 flex-col justify-center px-5 py-24 transition-opacity duration-700 ease-quint sm:px-10 lg:px-[max(3rem,calc((100vw-1320px)/4+3rem))] lg:py-32",
        dim && "opacity-45",
        dark ? "text-ivory" : "text-navy-900",
      )}
    >
      <Reveal className="max-w-[470px]">
        <RevealItem as="p" className={cn("eyebrow mb-8 flex items-center gap-3", dark ? "text-gold" : "text-royal")}>
          <span className={cn("h-px w-8", dark ? "bg-gold/60" : "bg-royal/50")} />
          {data.eyebrow}
        </RevealItem>
        <RevealItem as="h2" className="font-serif text-[clamp(3rem,5.4vw,5rem)] font-medium leading-[0.92] tracking-[-0.03em]">
          {data.title.map((t, i) => (
            <span key={t} className={cn("block", i === 1 && (dark ? "italic text-gold-soft" : "italic text-royal"))}>
              {t}
            </span>
          ))}
        </RevealItem>
        <ul className="mt-12 space-y-0">
          {data.points.map((p, i) => (
            <RevealItem
              as="li"
              key={p}
              className={cn(
                "flex items-baseline gap-5 border-t py-4 text-[15.5px]",
                dark ? "border-white/[0.08] text-mist/85" : "border-line-light text-ink-muted",
              )}
            >
              <span className={cn("font-mono text-[11px]", dark ? "text-gold/70" : "text-royal/70")}>0{i + 1}</span>
              {p}
            </RevealItem>
          ))}
        </ul>
        <RevealItem className="mt-10">
          <Magnetic>
            <Button asChild variant={dark ? "gold" : "navy"} size="lg">
              <Link href={data.cta.href}>
                {data.cta.label} <Arrow />
              </Link>
            </Button>
          </Magnetic>
        </RevealItem>
      </Reveal>
    </div>
  );
}
