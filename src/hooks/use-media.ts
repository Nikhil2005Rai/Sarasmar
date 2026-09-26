"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** "high" → full R3F scene; "low" → static SVG emblem + CSS parallax. */
export function useDeviceTier() {
  const [tier, setTier] = useState<"pending" | "high" | "low">("pending");
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    const force = new URLSearchParams(window.location.search).get("gl");
    if (force === "1" || force === "0") return setTier(force === "1" ? "high" : "low");
    setTier(wide && webgl && !reduced && cores >= 4 && mem >= 4 ? "high" : "low");
  }, []);
  return tier;
}
