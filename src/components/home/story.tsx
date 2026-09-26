"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SPARKLE, S_PATHS, S_VIEWBOX } from "@/components/brand/s-mark";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { useReducedMotion } from "@/hooks/use-media";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 60%"] });
  const gold = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const royal = useTransform(scrollYProgress, [0.08, 0.9], [0, 1]);
  const hair = useTransform(scrollYProgress, [0.15, 1], [0, 1]);
  const star = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <section id="story" data-surface="dark" className="relative scroll-mt-10 overflow-hidden bg-navy-900 text-ivory">
      <div className="container-x section-y relative flex flex-col items-center text-center">
        <Reveal className="max-w-2xl">
          <RevealItem as="p" className="eyebrow mb-8 text-gold">
            Why SARASMER?
          </RevealItem>
          <RevealItem as="p" className="font-serif text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.3] tracking-[-0.01em] text-ivory">
            <span className="italic text-gold-soft">Saras</span> — from Saraswati, the keeper of knowledge.{" "}
            <span className="italic text-[#9dbcf2]">Mer</span> — from Hermes, the messenger who carried it between worlds.
          </RevealItem>
          <RevealItem as="p" className="mx-auto mt-8 max-w-lg text-[16px] leading-relaxed text-mist/70">
            We kept the idea and left the iconography. Knowledge is only half the story; it matters when it reaches the people who can use it.
            That’s the whole company.
          </RevealItem>
        </Reveal>

        <div ref={ref} className="relative mt-20 h-[340px] w-[255px] sm:h-[420px] sm:w-[315px]">
          <div aria-hidden className="absolute inset-0 -m-20 rounded-full bg-[radial-gradient(circle,rgba(217,164,65,0.12),transparent_60%)]" />
          <svg viewBox={S_VIEWBOX} className="relative h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="story-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#F0D59A" />
                <stop offset="0.55" stopColor="#D9A441" />
                <stop offset="1" stopColor="#B07A22" />
              </linearGradient>
              <linearGradient id="story-r" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8FB2EC" />
                <stop offset="0.5" stopColor="#3568B8" />
                <stop offset="1" stopColor="#8A78C7" />
              </linearGradient>
            </defs>
            <motion.path d={S_PATHS.hair} fill="none" stroke="rgba(248,245,239,0.5)" strokeWidth="0.6" strokeLinecap="round" style={{ pathLength: reduced ? 1 : hair }} />
            <motion.path d={S_PATHS.royal} fill="none" stroke="url(#story-r)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: reduced ? 1 : royal }} />
            <motion.path d={S_PATHS.gold} fill="none" stroke="url(#story-g)" strokeWidth="4.5" strokeLinecap="round" style={{ pathLength: reduced ? 1 : gold }} />
            <motion.g style={{ opacity: reduced ? 1 : star }}>
              <path d={SPARKLE} fill="url(#story-g)" transform="translate(104 64) scale(0.8)" />
            </motion.g>
          </svg>
        </div>
      </div>
    </section>
  );
}
