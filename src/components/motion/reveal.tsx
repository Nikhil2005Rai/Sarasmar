"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { Children, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-media";
import { revealChild, revealChildReduced, staggerParent } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  amount?: number;
  as?: "div" | "section" | "ul" | "ol" | "header";
};

/** Parent that staggers its <RevealItem> children in once, 24px → 0. */
export function Reveal({ children, stagger = 0.075, delay = 0, amount = 0.2, as = "div", ...rest }: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerParent(stagger, delay)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, as = "div", ...rest }: HTMLMotionProps<"div"> & { as?: "div" | "li" | "p" | "span" | "h1" | "h2" | "h3" }) {
  const reduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp variants={reduced ? revealChildReduced : revealChild} {...rest}>
      {children}
    </Comp>
  );
}

/** Masked, word-by-word headline reveal. Keeps real text for a11y/SEO. */
export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const reduced = useReducedMotion();
  const lines = text.split("\n");
  let i = 0;
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } };
  return (
    <motion.span className={className} initial="hidden" {...trigger} aria-label={text.replace(/\n/g, " ").replace(/_/g, "")}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(" ").map((word, wi) => {
            const idx = i++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block will-change-transform"
                  variants={{
                    hidden: reduced ? { opacity: 0 } : { y: "105%" },
                    show: reduced
                      ? { opacity: 1, transition: { duration: 0.4, delay: delay + idx * 0.02 } }
                      : { y: "0%", transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: delay + idx * stagger } },
                  }}
                >
                  {/^_.+_[.,!?]*$/.test(word) ? (
                    <>
                      <em className="text-gradient-gold pr-[0.06em] font-serif italic">{word.replace(/[.,!?]+$/, "").replace(/_/g, "")}</em>
                      {word.match(/[.,!?]+$/)?.[0]}
                    </>
                  ) : (
                    word
                  )}
                  {wi < line.split(" ").length - 1 ? " " : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}

export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal as="ul" className={className}>
      {Children.map(children, (c) => (
        <RevealItem as="li">{c}</RevealItem>
      ))}
    </Reveal>
  );
}
