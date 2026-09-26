"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SMark } from "@/components/brand/s-mark";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitReveal } from "@/components/motion/reveal";
import { Arrow, Button } from "@/components/ui/button";
import { useDeviceTier, useReducedMotion } from "@/hooks/use-media";
import { EASE_QUINT } from "@/lib/motion";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), { ssr: false });

const TICKER = [
  { who: "Aarav M.", what: "verified Power BI", score: "91" },
  { who: "Northwind Capital", what: "matched 6 students to Q3 Forecasting", score: "87%" },
  { who: "Ishita R.", what: "set availability · 12 Oct – 28 Oct", score: "" },
  { who: "Meher K.", what: "verified Financial Modelling", score: "94" },
  { who: "Aster Labs", what: "hired 2 analysts for a 3-week sprint", score: "" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);

  // Parallax — 0.1× / 0.25× / 0.5× of scroll
  const { scrollY } = useScroll();
  const yBack = useTransform(scrollY, (v) => (reduced ? 0 : v * 0.1));
  const yMid = useTransform(scrollY, (v) => (reduced ? 0 : v * 0.25));
  const yFront = useTransform(scrollY, (v) => (reduced ? 0 : v * -0.12));
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const emblemScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.82]);
  const emblemOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const emblemY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Cursor-following gold glow
  const mx = useMotionValue(0.7);
  const my = useMotionValue(0.4);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const glx = useTransform(sx, (v) => `${v * 100}%`);
  const gly = useTransform(sy, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(640px circle at ${glx} ${gly}, rgba(217,164,65,0.16), rgba(53,104,184,0.06) 40%, transparent 70%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-surface="dark"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-900 pt-[var(--nav-h)] text-ivory"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
    >
      {/* ── background: layered S curves ─────────────────────────── */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ y: yBack }}>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_30%,rgba(53,104,184,0.22),transparent_60%),radial-gradient(900px_500px_at_10%_90%,rgba(138,120,199,0.14),transparent_60%)]" />
        <HeroCurves />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-navy-900" />

      <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-6 pb-10 pt-10 lg:grid-cols-[1.02fr_1fr] lg:gap-0 lg:pb-6 lg:pt-2">
        {/* ── copy ─────────────────────────────────────────────── */}
        <motion.div style={{ y: yMid, opacity: copyOpacity }} className="relative z-10 max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_QUINT, delay: 0.1 }}
            className="eyebrow mb-6 flex items-center gap-3 text-[10.5px] text-gold sm:mb-7 sm:text-eyebrow"
          >
            <span className="hidden h-px w-8 bg-gold/60 sm:block" />
            The bridge between potential &amp; opportunity
          </motion.p>

          <h1 className="font-serif text-[clamp(3.5rem,7.4vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.03em] text-ivory">
            <SplitReveal immediate delay={0.2} text={"Your skills\ndeserve a _real_\nopportunity."} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_QUINT, delay: 0.85 }}
            className="mt-8 max-w-[30rem] text-[17px] leading-[1.65] text-mist/85 lg:text-[18px]"
          >
            SARASMER verifies what students can actually do, then matches them — by skill and by the weeks they’re free — to paid
            projects at companies that need the work done now.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_QUINT, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild variant="gold" size="lg">
                <Link href="/signup?role=student">
                  Get verified <Arrow />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="ghost-dark" size="lg">
                <Link href="/signup?role=company">I’m hiring</Link>
              </Button>
            </Magnetic>
          </motion.div>

          <Ticker />
        </motion.div>

        {/* ── emblem ───────────────────────────────────────────── */}
        <motion.div
          style={{ scale: emblemScale, opacity: emblemOpacity, y: emblemY }}
          className="relative order-first -mx-5 h-[270px] sm:h-[400px] lg:order-none lg:-ml-[12%] lg:-mr-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:h-[min(84vh,820px)]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_QUINT, delay: 0.3 }}
            className="absolute inset-0"
          >
            {tier === "high" ? <HeroScene active={inView} /> : tier === "low" ? <EmblemFallback /> : null}
          </motion.div>
        </motion.div>
      </div>

      {/* ── bottom rail ─────────────────────────────────────────── */}
      <motion.div style={{ y: yFront }} className="container-x relative hidden items-end justify-between pb-8 lg:flex">
        <div className="flex items-center gap-4 text-mist/60">
          <span className="relative block h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gold"
              animate={reduced ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
          <span className="eyebrow text-[10.5px]">Scroll to explore</span>
        </div>
        <p className="eyebrow text-[10.5px] text-mist/50">Knowledge × Connection × Opportunity</p>
      </motion.div>
    </section>
  );
}

function Ticker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TICKER.length), 3400);
    return () => clearInterval(id);
  }, []);
  const item = TICKER[i];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 1 }}
      className="mt-12 flex h-10 items-center gap-3 border-t border-white/[0.07] pt-5 text-[13.5px]"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-verified/60" />
        <span className="relative h-2 w-2 rounded-full bg-[#4cc38a]" />
      </span>
      <span className="eyebrow shrink-0 text-[10px] text-mist/50">Live</span>
      <span className="relative block h-5 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_QUINT }}
            className="absolute inset-0 truncate text-mist/80"
          >
            <span className="text-ivory">{item.who}</span> {item.what}
            {item.score && <span className="ml-2 font-mono text-[12px] text-gold-soft">{item.score}</span>}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.div>
  );
}

/** Big, slow gradient S-curves behind the hero. Stroke-drawn on mount. */
function HeroCurves() {
  const curves = [
    { d: "M-100 620 C 240 520, 380 180, 720 240 C 1040 300, 1080 700, 1540 520", w: 1.2, o: 0.55, delay: 0.2 },
    { d: "M-100 760 C 300 700, 420 380, 760 420 C 1100 460, 1180 820, 1540 700", w: 1, o: 0.35, delay: 0.45 },
    { d: "M200 -40 C 380 180, 760 80, 900 300 C 1040 520, 1320 420, 1540 160", w: 0.8, o: 0.3, delay: 0.7 },
  ];
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="hc" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3568B8" stopOpacity="0" />
          <stop offset="0.35" stopColor="#3568B8" />
          <stop offset="0.7" stopColor="#8A78C7" />
          <stop offset="1" stopColor="#D9A441" />
        </linearGradient>
      </defs>
      {curves.map((c, i) => (
        <motion.path
          key={i}
          d={c.d}
          fill="none"
          stroke="url(#hc)"
          strokeWidth={c.w}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: c.o }}
          transition={{ pathLength: { duration: 2.6, ease: EASE_QUINT, delay: c.delay }, opacity: { duration: 1, delay: c.delay } }}
        />
      ))}
    </svg>
  );
}

/** Mobile / low-end / reduced-motion: static SVG emblem + orbit chips, CSS-only motion. */
function EmblemFallback() {
  const chips = [
    { label: "Financial Modelling", sub: "Verified · 94", pos: "left-[4%] top-[18%]", gold: true },
    { label: "Power BI", sub: "Verified · 91", pos: "right-[4%] top-[34%]", gold: true },
    { label: "Northwind Capital", sub: "3 open projects", pos: "left-[10%] bottom-[14%]", gold: false },
  ];
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 400 400" className="absolute inset-0 m-auto h-full w-full" aria-hidden>
        <ellipse cx="200" cy="200" rx="170" ry="62" fill="none" stroke="#D9A441" strokeOpacity="0.35" transform="rotate(-18 200 200)" />
        <ellipse cx="200" cy="200" rx="185" ry="80" fill="none" stroke="#8A78C7" strokeOpacity="0.25" transform="rotate(24 200 200)" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#F0D59A" strokeOpacity="0.12" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.28),transparent_65%)] blur-xl" />
          <SMark className="relative h-[220px] w-[165px] drop-shadow-[0_20px_40px_rgba(217,164,65,0.25)] sm:h-[260px] sm:w-[195px]" drawOnMount duration={2} />
        </div>
      </div>
      {chips.map((c, i) => (
        <motion.div
          key={c.label}
          className={`absolute ${c.pos} flex items-center gap-2 rounded-[10px] border border-white/10 bg-navy-700/70 px-3 py-2 backdrop-blur-md`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -6, 0] }}
          transition={{ opacity: { delay: 1.2 + i * 0.15, duration: 0.8 }, y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" } }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${c.gold ? "bg-gold" : "bg-[#9dbcf2]"}`} />
          <span className="flex flex-col leading-tight">
            <span className="text-[11.5px] font-medium text-ivory">{c.label}</span>
            <span className="text-[10px] text-mist/60">{c.sub}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}
