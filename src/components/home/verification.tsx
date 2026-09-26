"use client";

import { animate, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SMark } from "@/components/brand/s-mark";
import { Reveal, RevealItem, SplitReveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Check, VerifiedBadge } from "@/components/ui/badges";
import { Arrow } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-media";
import { EASE_QUINT } from "@/lib/motion";

const CRITERIA = [
  { k: "DCF valuation", v: 96 },
  { k: "3-statement build", v: 92 },
  { k: "Scenario & sensitivity", v: 94 },
];

export function Verification() {
  return (
    <section data-surface="light" className="relative overflow-hidden bg-ivory">
      <div className="container-x section-y relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <RevealItem as="p" className="eyebrow mb-6 text-royal">
            Skill verification
          </RevealItem>
          <h2 className="display-l text-navy-900">
            <SplitReveal text={"Don’t just say you have the skill.\n_Prove_ it."} />
          </h2>
          <RevealItem as="p" className="mx-auto mt-6 max-w-xl text-ink-muted">
            Practical, timed assessments designed with working analysts. Pass, and the skill carries a SARASMER seal every company on the
            platform can trust.
          </RevealItem>
        </Reveal>

        <div className="relative mx-auto mt-20 grid max-w-[1100px] grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_440px_1fr] lg:gap-16">
          <Callouts side="left" items={[{ t: "Timed, practical tasks", d: "Real models, real data — not multiple choice." }, { t: "Rubric-scored", d: "Reviewed against criteria set by practitioners." }]} />
          <VerificationCard />
          <Callouts side="right" items={[{ t: "Dated & portable", d: "Every seal shows when it was earned." }, { t: "Always improvable", d: "Learn more, reassess, raise the score." }]} />
        </div>

        <Reveal className="mt-16 flex justify-center">
          <RevealItem>
            <Link href="/signup?role=student" className="group inline-flex items-center gap-3 text-[15px] text-ink-muted transition-colors hover:text-navy-900">
              Learned a new skill?
              <span className="inline-flex items-center gap-2 font-medium text-royal">
                Take a reassessment <Arrow />
              </span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

function Callouts({ side, items }: { side: "left" | "right"; items: { t: string; d: string }[] }) {
  return (
    <Reveal className={`hidden flex-col gap-16 lg:flex ${side === "left" ? "items-end text-right" : "items-start text-left"}`} stagger={0.15} delay={0.3}>
      {items.map((it) => (
        <RevealItem key={it.t} className="relative max-w-[230px]">
          <span className={`absolute top-3 h-px bg-gradient-to-r ${side === "left" ? "-right-14 w-10 from-line-light to-gold" : "-left-14 w-10 from-gold to-line-light"}`} />
          <p className="font-serif text-[1.35rem] leading-tight text-navy-900">{it.t}</p>
          <p className="mt-1.5 text-[14px] text-ink-muted">{it.d}</p>
        </RevealItem>
      ))}
    </Reveal>
  );
}

function VerificationCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const done = pct >= 94;

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setPct(94);
    const c = animate(0, 94, { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.4, onUpdate: (v) => setPct(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduced]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[440px]">
      {/* halo */}
      <div aria-hidden className="absolute -inset-16 -z-10">
        <svg viewBox="0 0 400 400" className="h-full w-full animate-slow-spin opacity-60">
          <circle cx="200" cy="200" r="196" fill="none" stroke="#E5E0D6" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#E5E0D6" />
        </svg>
        <div className="absolute inset-16 rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.18),transparent_65%)] blur-2xl" />
      </div>
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <TiltCard className="card-light rounded-card-lg shadow-card-hover" glareColor="rgba(240,213,154,0.28)">
          <div className="relative overflow-hidden rounded-card-lg p-7 sm:p-8" style={{ transform: "translateZ(24px)" }}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-royal via-lavender to-gold" />
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-[10.5px] text-ink-faint">Skill</p>
                <p className="mt-2 font-serif text-[2rem] font-medium leading-none tracking-[-0.01em] text-navy-900">Financial Modelling</p>
              </div>
              <SMark className="h-10 w-8 shrink-0" tone="light" sparkle={false} />
            </div>

            <div className="mt-7 flex items-center gap-2 text-[13.5px] text-ink-muted">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-verified/10 text-verified">
                <Check className="h-2.5 w-2.5" />
              </span>
              Assessment completed · 58 min
            </div>

            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-ink-faint">Score</span>
                <span className="font-serif text-[2.6rem] leading-none text-navy-900" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {pct}
                  <span className="text-[1.3rem] text-ink-faint">%</span>
                </span>
              </div>
              <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-line-light">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-royal via-lavender to-gold" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              {CRITERIA.map((c, i) => (
                <motion.li
                  key={c.k}
                  className="flex items-center justify-between text-[13px]"
                  initial={{ opacity: 0, x: -6 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6, ease: EASE_QUINT }}
                >
                  <span className="text-ink-muted">{c.k}</span>
                  <span className="font-mono text-navy-900">{c.v}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-7 flex items-center justify-between border-t border-line-light pt-5">
              <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={done ? { opacity: 1, scale: 1 } : {}} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <VerifiedBadge />
              </motion.div>
              <p className="text-right text-[11.5px] leading-snug text-ink-faint">
                Verified by SARASMER
                <br />
                September 2026
              </p>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  );
}
