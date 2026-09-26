"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CountUp } from "@/components/motion/count-up";
import { Reveal, RevealItem, SplitReveal } from "@/components/motion/reveal";
import { Check, Sparkle } from "@/components/ui/badges";
import { EASE_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const STEPS = [
  {
    n: "01",
    title: "Build",
    line: "A profile that reads like a portfolio.",
    body: "Education, projects and the tools you actually use — structured so a hiring manager can scan it in twenty seconds.",
    Visual: BuildVisual,
  },
  {
    n: "02",
    title: "Verify",
    line: "Claims become credentials.",
    body: "Timed, practical assessments turn “proficient in Excel” into a scored, dated, SARASMER-verified skill.",
    Visual: VerifyVisual,
  },
  {
    n: "03",
    title: "Match",
    line: "Skill × availability, not keywords.",
    body: "Companies post the work and the weeks. We rank students by verified fit and whether they’re genuinely free.",
    Visual: MatchVisual,
  },
  {
    n: "04",
    title: "Work",
    line: "Real projects. Real pay.",
    body: "Scoped, paid engagements from two to eight weeks — delivered, reviewed, and added back to your record.",
    Visual: WorkVisual,
  },
] as const;

export function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useIso(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      setPinned(true);
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 96;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progress.set(self.progress);
            setActive(Math.min(3, Math.floor(self.progress * 4.2)));
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        setPinned(false);
      };
    });
    return () => mm.revert();
  }, [progress]);

  return (
    <section id="how" ref={section} data-surface="light" className="relative overflow-hidden bg-ivory">
      {/* ── desktop: pinned horizontal journey ───────────────────── */}
      <div className="hidden lg:block lg:motion-reduce:hidden">
        <div className="flex h-screen flex-col justify-center">
          <div ref={track} className="flex items-stretch gap-8 pl-[max(3rem,calc((100vw-1320px)/2+3rem))] will-change-transform">
            <div className="flex w-[30vw] min-w-[380px] max-w-[460px] shrink-0 flex-col justify-center pr-8">
              <p className="eyebrow mb-6 text-royal">How SARASMER works</p>
              <h2 className="display-l text-navy-900">
                <SplitReveal text={"Four steps from\n_potential_ to paid."} />
              </h2>
              <p className="mt-6 max-w-sm text-ink-muted">
                One continuous journey. Scroll — each stage hands a stronger signal to the next.
              </p>
              <JourneyProgress progress={progress} active={active} />
            </div>
            {STEPS.map((s, i) => (
              <StepCard key={s.n} step={s} index={i} active={pinned ? active >= i : true} current={active === i} />
            ))}
            <div className="w-[8vw] shrink-0" />
          </div>
        </div>
      </div>

      {/* ── mobile/tablet: vertical S-timeline ───────────────────── */}
      <MobileTimeline />
    </section>
  );
}

function JourneyProgress({ progress, active }: { progress: ReturnType<typeof useMotionValue<number>>; active: number }) {
  const smooth = useSpring(progress, { stiffness: 120, damping: 30 });
  return (
    <div className="mt-12">
      <svg viewBox="0 0 320 40" className="h-10 w-full max-w-[320px] overflow-visible" aria-hidden>
        <path d="M0 20 C 50 20, 60 4, 100 4 S 150 36, 200 36 S 260 20, 320 20" fill="none" stroke="#E5E0D6" strokeWidth="1.5" />
        <motion.path
          d="M0 20 C 50 20, 60 4, 100 4 S 150 36, 200 36 S 260 20, 320 20"
          fill="none"
          stroke="url(#jp)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: smooth }}
        />
        <defs>
          <linearGradient id="jp" x1="0" x2="1">
            <stop offset="0" stopColor="#3568B8" />
            <stop offset="1" stopColor="#D9A441" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-3 flex max-w-[320px] justify-between font-mono text-[11px]">
        {STEPS.map((s, i) => (
          <span key={s.n} className={cn("transition-colors duration-500", i <= active ? "text-navy-900" : "text-ink-faint/60")}>
            {s.n}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index, active, current }: { step: (typeof STEPS)[number]; index: number; active: boolean; current: boolean }) {
  const { Visual } = step;
  return (
    <article
      className={cn(
        "relative flex h-[min(68vh,620px)] w-[min(34vw,480px)] min-w-[400px] shrink-0 flex-col overflow-hidden rounded-card-lg border bg-warm-white p-8 transition-[box-shadow,border-color] duration-700 ease-quint",
        current ? "border-navy-900/15 shadow-card-hover" : "border-line-light shadow-card",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-[5.5rem] font-light leading-[0.8] tracking-[-0.04em] text-navy-900/[0.08]">{step.n}</span>
        <span className={cn("eyebrow mt-2 transition-colors duration-500", active ? "text-gold" : "text-ink-faint")}>Step {index + 1} / 4</span>
      </div>
      <div className="relative my-6 flex-1 overflow-hidden rounded-[12px] border border-line-light bg-ivory">
        <Visual play={active} />
      </div>
      <h3 className="font-serif text-[2.4rem] font-medium leading-none tracking-[-0.02em] text-navy-900">{step.title}</h3>
      <p className="mt-2 text-[15px] font-medium text-navy-900">{step.line}</p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{step.body}</p>
    </article>
  );
}

function MobileTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const len = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div className="section-y container-x lg:hidden lg:motion-reduce:block">
      <Reveal>
        <RevealItem as="p" className="eyebrow mb-5 text-royal">
          How SARASMER works
        </RevealItem>
        <RevealItem as="h2" className="display-l text-navy-900">
          Four steps from <em className="font-serif italic text-royal">potential</em> to paid.
        </RevealItem>
      </Reveal>
      <div ref={ref} className="relative mt-14">
        <svg className="absolute left-0 top-0 h-full w-8" viewBox="0 0 32 1000" preserveAspectRatio="none" aria-hidden>
          <path d="M16 0 C 30 125, 2 125, 16 250 S 30 375, 16 500 S 2 625, 16 750 S 30 875, 16 1000" fill="none" stroke="#E5E0D6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <motion.path
            d="M16 0 C 30 125, 2 125, 16 250 S 30 375, 16 500 S 2 625, 16 750 S 30 875, 16 1000"
            fill="none"
            stroke="#D9A441"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: len }}
          />
        </svg>
        <div className="flex flex-col gap-12 pl-12">
          {STEPS.map((s) => (
            <MobileStep key={s.n} step={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileStep({ step }: { step: (typeof STEPS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { Visual } = step;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE_QUINT }}
      className="relative"
    >
      <span className="absolute -left-[42px] top-1 grid h-5 w-5 place-items-center rounded-full border border-gold/50 bg-ivory">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      <p className="font-mono text-[12px] text-gold">{step.n}</p>
      <h3 className="mt-1 font-serif text-[2.1rem] leading-none text-navy-900">{step.title}</h3>
      <p className="mt-2 font-medium text-navy-900">{step.line}</p>
      <p className="mt-1.5 text-[15px] text-ink-muted">{step.body}</p>
      <div className="mt-5 h-[220px] overflow-hidden rounded-[14px] border border-line-light bg-warm-white">
        <Visual play={inView} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── step visuals ─────────────────────────── */

function BuildVisual({ play }: { play: boolean }) {
  const rows = [
    { k: "Education", v: "B.Com (Hons) · SRCC, Delhi" },
    { k: "Focus", v: "Corporate finance, valuation" },
    { k: "Tools", v: "Excel · Power BI · Python" },
  ];
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-[300px] rounded-[12px] border border-line-light bg-warm-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          <motion.div
            className="grid h-11 w-11 place-items-center rounded-[10px] bg-navy-900 font-serif text-lg text-gold-soft"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={play ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE_QUINT }}
          >
            IR
          </motion.div>
          <div className="flex-1">
            <motion.div className="text-[14px] font-semibold text-navy-900" initial={{ opacity: 0 }} animate={play ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
              Ishita Rao
            </motion.div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-light">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-royal to-gold"
                initial={{ width: "8%" }}
                animate={play ? { width: "82%" } : {}}
                transition={{ duration: 2, ease: EASE_QUINT, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2.5">
          {rows.map((r, i) => (
            <motion.div
              key={r.k}
              className="flex items-baseline justify-between gap-3 border-t border-line-light pt-2.5 text-[12.5px]"
              initial={{ opacity: 0, x: -8 }}
              animate={play ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_QUINT, delay: 0.5 + i * 0.18 }}
            >
              <span className="text-ink-faint">{r.k}</span>
              <span className="truncate text-right font-medium text-navy-900">{r.v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerifyVisual({ play }: { play: boolean }) {
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setVerified(true), 1300);
    return () => clearTimeout(t);
  }, [play]);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
      <div className="relative overflow-hidden rounded-[10px]">
        <motion.div
          layout
          className={cn(
            "flex h-12 items-center gap-3 rounded-[10px] border px-4 text-[14px] font-medium transition-colors duration-700",
            verified ? "border-gold/50 bg-[#fbf1da] text-[#7a5412]" : "border-dashed border-ink-faint/40 bg-warm-white text-ink-muted",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {verified ? (
              <motion.span key="v" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-navy-900">
                  <Check className="h-2.5 w-2.5" />
                </span>
              </motion.span>
            ) : (
              <motion.span key="u" exit={{ scale: 0 }} className="h-5 w-5 rounded-full border border-dashed border-ink-faint/60" />
            )}
          </AnimatePresence>
          Financial Modelling
          <span className={cn("eyebrow ml-2 text-[10px]", verified ? "text-[#9a6a17]" : "text-ink-faint")}>{verified ? "Verified · 94" : "Unverified"}</span>
        </motion.div>
        {play && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#F0D59A]/90 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "260%" }}
            transition={{ duration: 1.1, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </div>
      <div className="grid w-full max-w-[280px] grid-cols-3 gap-2 text-center">
        {["DCF", "3-statement", "Sensitivity"].map((t, i) => (
          <motion.div
            key={t}
            className="rounded-[8px] border border-line-light bg-warm-white py-2 text-[11.5px] text-ink-muted"
            initial={{ opacity: 0, y: 6 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: EASE_QUINT }}
          >
            <span className="block font-mono text-[13px] font-semibold text-navy-900">{[96, 92, 94][i]}</span>
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MatchVisual({ play }: { play: boolean }) {
  return (
    <div className="relative h-full p-6">
      <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <motion.path
          d="M70 150 C 120 150, 110 50, 150 50 C 190 50, 180 150, 230 150"
          transform="translate(0 -50) scale(1 1.5)"
          fill="none"
          stroke="url(#mv)"
          strokeWidth="1.6"
          strokeDasharray="1 0"
          initial={{ pathLength: 0 }}
          animate={play ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE_QUINT, delay: 0.3 }}
        />
        <defs>
          <linearGradient id="mv" x1="0" x2="1">
            <stop offset="0" stopColor="#3568B8" />
            <stop offset="1" stopColor="#D9A441" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative flex h-full items-end justify-between">
        <motion.div
          className="rounded-[10px] border border-line-light bg-warm-white p-3 shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_QUINT }}
        >
          <p className="eyebrow text-[9.5px] text-royal">Student</p>
          <p className="mt-1 text-[13px] font-semibold text-navy-900">Meher K.</p>
          <p className="text-[11px] text-ink-faint">Free 12–28 Oct</p>
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-3 -translate-x-1/2 rounded-[10px] bg-navy-900 px-4 py-2.5 text-center text-ivory shadow-card-dark"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={play ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE_QUINT, delay: 1.2 }}
        >
          <span className="font-serif text-[1.9rem] leading-none text-gold-soft">{play ? <CountUp value={87} suffix="%" delay={1.2} /> : "0%"}</span>
          <span className="eyebrow block text-[9px] text-mist/70">Match</span>
        </motion.div>
        <motion.div
          className="rounded-[10px] border border-line-light bg-warm-white p-3 text-right shadow-card"
          initial={{ opacity: 0, y: 10 }}
          animate={play ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_QUINT, delay: 0.15 }}
        >
          <p className="eyebrow text-[9.5px] text-gold">Project</p>
          <p className="mt-1 text-[13px] font-semibold text-navy-900">Q3 Forecast</p>
          <p className="text-[11px] text-ink-faint">Needs 14–30 Oct</p>
        </motion.div>
      </div>
    </div>
  );
}

function WorkVisual({ play }: { play: boolean }) {
  const days = Array.from({ length: 21 }, (_, i) => i + 8);
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-[10px] text-ink-faint">October</span>
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-[6px] bg-verified/10 px-2 py-1 text-[11px] font-medium text-verified"
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : {}}
          transition={{ delay: 1.4 }}
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-verified" /> In progress
        </motion.span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const inRange = d >= 12 && d <= 28;
          return (
            <motion.div
              key={d}
              className={cn(
                "grid aspect-square place-items-center rounded-[6px] text-[11px] font-medium",
                inRange ? "text-navy-900" : "text-ink-faint/60",
              )}
              initial={{ backgroundColor: "rgba(0,0,0,0)" }}
              animate={play && inRange ? { backgroundColor: d === 12 || d === 28 ? "#D9A441" : "rgba(217,164,65,0.18)" } : {}}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }}
            >
              {d}
            </motion.div>
          );
        })}
      </div>
      <motion.div
        className="flex items-center justify-between rounded-[10px] border border-line-light bg-warm-white px-4 py-3"
        initial={{ opacity: 0, y: 8 }}
        animate={play ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.3, duration: 0.7, ease: EASE_QUINT }}
      >
        <span className="text-[12.5px] text-ink-muted">Market Research · Aster Labs</span>
        <span className="flex items-center gap-1 font-mono text-[13px] font-semibold text-navy-900">
          <Sparkle className="h-2.5 w-2.5 text-gold" />₹18,000
        </span>
      </motion.div>
    </div>
  );
}
