"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SDivider } from "@/components/brand/s-divider";
import { TiltCard } from "@/components/motion/tilt-card";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { useReducedMotion } from "@/hooks/use-media";
import { cn } from "@/lib/utils";

const STATEMENT = "The problem isn’t a lack of talent. It’s the lack of connection.";

const PROBLEMS = [
  {
    n: "01",
    title: "Unverified Skills",
    body: "Every CV says “advanced Excel.” Without proof, companies can’t tell the claim from the capability — so they default to pedigree.",
    Visual: UnverifiedVisual,
    offset: "lg:translate-y-0",
  },
  {
    n: "02",
    title: "Hidden Talent",
    body: "Brilliant students outside a handful of campuses never reach a recruiter’s shortlist. The talent exists; the signal doesn’t travel.",
    Visual: HiddenVisual,
    offset: "lg:translate-y-16",
  },
  {
    n: "03",
    title: "Availability Gap",
    body: "Companies need help for three weeks in October. Students are free for three weeks in October. Nobody tells either side.",
    Visual: GapVisual,
    offset: "lg:translate-y-32",
  },
];

export function Why() {
  return (
    <section data-surface="dark" className="relative overflow-hidden bg-navy-900 text-ivory">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_85%_10%,rgba(53,104,184,0.18),transparent_60%)]" />
      <div className="container-x section-y relative">
        <p className="eyebrow mb-10 flex items-center gap-3 text-gold">
          <span className="h-px w-8 bg-gold/60" />
          Why SARASMER
        </p>
        <ScrollStatement text={STATEMENT} />

        <div className="mt-24 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-32 lg:gap-6 lg:pb-32">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08} className={cn("transition-transform", p.offset)}>
              <RevealItem className="h-full">
                <TiltCard className="card-dark rounded-card-lg">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
                  <div className="flex h-full flex-col p-7 lg:p-8" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-[1.9rem] leading-[1.05] tracking-[-0.015em] text-ivory lg:text-[2.1rem]">{p.title}</h3>
                      <span className="font-mono text-[12px] text-gold/80">{p.n}</span>
                    </div>
                    <div className="my-8 h-28">
                      <p.Visual />
                    </div>
                    <p className="text-[15px] leading-relaxed text-mist/75">{p.body}</p>
                  </div>
                </TiltCard>
              </RevealItem>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center text-center lg:mt-12">
          <SDivider tone="dark" className="mb-10 max-w-3xl" />
          <Reveal>
            <RevealItem as="p" className="font-serif text-display-m italic text-gradient-gold">
              SARASMER connects all three.
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Words light up from 18% → 100% as the statement scrolls through the viewport. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <h2 ref={ref} className="max-w-[1100px] font-serif text-[clamp(2.4rem,5.6vw,5.25rem)] font-normal leading-[1.02] tracking-[-0.025em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduced={reduced} gold={i >= 7}>
          {w}
        </Word>
      ))}
    </h2>
  );
}

function Word({ children, progress, range, reduced, gold }: { children: string; progress: MotionValue<number>; range: [number, number]; reduced: boolean; gold: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity: reduced ? 1 : opacity }} className={cn("inline-block pr-[0.24em]", gold && "italic text-gold-soft")}>
      {children}
    </motion.span>
  );
}

/* ─── micro visuals ─── */
function UnverifiedVisual() {
  const lines = ["Advanced Excel", "Financial modelling", "Data storytelling"];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {lines.map((l, i) => (
        <div key={l} className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full border border-dashed border-mist/30" />
          <span className="relative text-[13px] text-mist/55">
            {l}
            <motion.span
              className="absolute left-0 top-1/2 h-px bg-peach/70"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          <span className="eyebrow ml-auto text-[9px] text-mist/35">Self-reported</span>
        </div>
      ))}
    </div>
  );
}

function HiddenVisual() {
  return (
    <div className="grid h-full grid-cols-12 content-center gap-2">
      {Array.from({ length: 36 }, (_, i) => (
        <motion.span
          key={i}
          className={cn("aspect-square rounded-full", i === 22 ? "bg-gold" : "bg-mist/15")}
          initial={i === 22 ? { scale: 0.4, boxShadow: "0 0 0 0 rgba(217,164,65,0)" } : false}
          whileInView={i === 22 ? { scale: 1.25, boxShadow: "0 0 18px 4px rgba(217,164,65,0.45)" } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

function GapVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 text-[11px]">
      {[
        { label: "Company", from: "30%", w: "38%", color: "bg-[#6f93d6]" },
        { label: "Student", from: "34%", w: "40%", color: "bg-gold" },
      ].map((r, i) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-14 text-mist/50">{r.label}</span>
          <div className="relative h-2 flex-1 rounded-full bg-white/[0.06]">
            <motion.span
              className={cn("absolute inset-y-0 rounded-full", r.color)}
              style={{ left: r.from }}
              initial={{ width: 0 }}
              whileInView={{ width: r.w }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
      <div className="flex justify-between pl-[4.25rem] font-mono text-[10px] text-mist/35">
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
      </div>
    </div>
  );
}
