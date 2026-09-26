import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        navy: {
          900: "rgb(var(--c-navy-900) / <alpha-value>)",
          800: "rgb(var(--c-navy-800) / <alpha-value>)",
          700: "rgb(var(--c-navy-700) / <alpha-value>)",
        },
        ivory: "rgb(var(--c-ivory) / <alpha-value>)",
        "warm-white": "rgb(var(--c-warm-white) / <alpha-value>)",
        royal: "rgb(var(--c-royal) / <alpha-value>)",
        gold: { DEFAULT: "rgb(var(--c-gold) / <alpha-value>)", soft: "rgb(var(--c-gold-soft) / <alpha-value>)" },
        lavender: "rgb(var(--c-lavender) / <alpha-value>)",
        peach: "rgb(var(--c-peach) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
          faint: "rgb(var(--c-ink-faint) / <alpha-value>)",
        },
        mist: "rgb(var(--c-mist) / <alpha-value>)",
        line: { light: "rgb(var(--c-border-light) / <alpha-value>)", dark: "var(--border-dark)" },
        verified: "rgb(var(--c-verified) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans-latin)", "var(--font-sans-ext)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-l": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-m": ["clamp(1.875rem, 3.2vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      borderRadius: { card: "16px", "card-sm": "14px", "card-lg": "18px" },
      spacing: { section: "clamp(6rem, 12vh, 10rem)" },
      boxShadow: {
        card: "0 1px 0 rgba(11,23,42,0.04), 0 2px 6px -2px rgba(11,23,42,0.06), 0 16px 40px -20px rgba(11,23,42,0.18)",
        "card-hover":
          "0 1px 0 rgba(11,23,42,0.04), 0 6px 14px -6px rgba(11,23,42,0.10), 0 32px 64px -28px rgba(11,23,42,0.28)",
        "card-dark": "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 60px -30px rgba(0,0,0,0.55)",
        gold: "0 0 0 1px rgba(217,164,65,0.35), 0 12px 32px -12px rgba(217,164,65,0.45)",
      },
      transitionTimingFunction: {
        quint: "cubic-bezier(0.22, 1, 0.36, 1)",
        scroll: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        "slow-spin": { to: { transform: "rotate(360deg)" } },
        pulse_dot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(46,160,103,0.45)" },
          "50%": { boxShadow: "0 0 0 6px rgba(46,160,103,0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.8s cubic-bezier(0.65,0,0.35,1) infinite",
        "slow-spin": "slow-spin 40s linear infinite",
        "pulse-dot": "pulse_dot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
