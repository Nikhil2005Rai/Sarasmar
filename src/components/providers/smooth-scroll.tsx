"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function scrollToTarget(target: string | number) {
  const offset = -72;
  if (lenisInstance) return lenisInstance.scrollTo(target as string, { offset, duration: 1.4 });
  if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

/** Lenis driven by GSAP's ticker so ScrollTrigger and Lenis share one clock. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
