import type { Transition, Variants } from "framer-motion";

/** easeOutQuint — every reveal */
export const EASE_QUINT = [0.22, 1, 0.36, 1] as const;
/** easeInOutCubic-ish — scroll-linked */
export const EASE_SCROLL = [0.65, 0, 0.35, 1] as const;

export const revealTransition: Transition = { duration: 0.9, ease: EASE_QUINT };

export const staggerParent = (stagger = 0.075, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: revealTransition },
};

export const revealChildReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};
