"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SMark } from "@/components/brand/s-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { EASE_QUINT } from "@/lib/motion";

const QUOTES = [
  { q: "Talent is everywhere. Proof is the rare thing.", a: "The SARASMER premise" },
  { q: "Knowledge becomes power only when it travels.", a: "After Saraswati & Hermes" },
  { q: "Three weeks free is a résumé line. Three weeks matched is a career.", a: "From a student in Pune" },
  { q: "We stopped reading CVs. We read scores and calendars.", a: "A hiring lead, fintech" },
];

export function AuthAside() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 5200);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[i];

  return (
    <aside data-surface="dark" className="relative hidden flex-col overflow-hidden bg-navy-900 p-12 text-ivory lg:flex">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(700px_500px_at_70%_40%,rgba(53,104,184,0.25),transparent_60%),radial-gradient(500px_400px_at_20%_90%,rgba(217,164,65,0.12),transparent_60%)]" />
      <svg aria-hidden viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-50">
        <defs>
          <linearGradient id="aa" x1="0" x2="1">
            <stop offset="0" stopColor="#3568B8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8A78C7" />
            <stop offset="1" stopColor="#D9A441" />
          </linearGradient>
        </defs>
        <motion.path
          d="M-40 700 C 160 620, 120 300, 320 280 C 520 260, 520 80, 680 40"
          fill="none"
          stroke="url(#aa)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: EASE_QUINT }}
        />
      </svg>

      <Link href="/" className="relative flex items-center gap-3">
        <SMark className="h-8 w-6" sparkle={false} />
        <Wordmark className="text-[21px]" />
      </Link>

      <div className="relative flex flex-1 items-center justify-center">
        <motion.div layoutId="brand-s" className="relative">
          <div className="absolute inset-0 -m-16 rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.22),transparent_65%)] blur-xl" />
          <SMark className="relative h-[300px] w-[225px]" drawOnMount duration={2.2} />
        </motion.div>
      </div>

      <div className="relative min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.8, ease: EASE_QUINT }}
          >
            <blockquote className="max-w-md font-serif text-[2rem] font-normal leading-[1.12] tracking-[-0.015em] text-ivory">“{q.q}”</blockquote>
            <figcaption className="eyebrow mt-5 text-[10.5px] text-gold/80">{q.a}</figcaption>
          </motion.figure>
        </AnimatePresence>
        <div className="mt-8 flex gap-1.5">
          {QUOTES.map((_, k) => (
            <span key={k} className="h-px w-8 overflow-hidden bg-white/10">
              {k === i && (
                <motion.span className="block h-full bg-gold" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5.2, ease: "linear" }} />
              )}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
