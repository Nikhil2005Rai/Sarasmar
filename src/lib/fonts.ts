import localFont from "next/font/local";

/** Self-hosted via next/font/local (no build-time network fetch; works offline & on Vercel). */
export const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin-wght-normal.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-wght-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const sans = localFont({
  src: [{ path: "../fonts/inter-tight-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-sans-latin",
  display: "swap",
  preload: true,
  // no fallback here: glyphs outside latin (e.g. ₹) must fall through to --font-sans-ext
  adjustFontFallback: false,
  fallback: [],
});

/** latin-ext carries ₹ (U+20B9); chained after the latin face in --font-sans. */
export const sansExt = localFont({
  src: [{ path: "../fonts/inter-tight-latin-ext-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-sans-ext",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

export const mono = localFont({
  src: [{ path: "../fonts/jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
