import { cn } from "@/lib/utils";

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={cn("h-3 w-3", className)} aria-hidden>
      <path d="M2.2 6.3 4.8 8.8 9.8 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" className={cn("h-3 w-3", className)} aria-hidden>
      <path d="M0 -10 L1.6 -1.6 L10 0 L1.6 1.6 L0 10 L-1.6 1.6 L-10 0 L-1.6 -1.6 Z" fill="currentColor" />
    </svg>
  );
}

/** Gold verification seal with a travelling shimmer. */
export function VerifiedBadge({ className, label = "Verified", size = "md" }: { className?: string; label?: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 overflow-hidden rounded-[7px] border border-gold/40 bg-gradient-to-b from-[#fbf1da] to-[#f3dfae] font-sans font-semibold uppercase text-[#7a5412]",
        size === "sm" ? "h-6 px-2 text-[10px] tracking-[0.14em]" : "h-8 px-3 text-[11px] tracking-[0.16em]",
        className,
      )}
    >
      <Check className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {label}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    </span>
  );
}

export function SkillTag({ children, verified, tone = "light", className }: { children: React.ReactNode; verified?: boolean; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-[7px] border px-2.5 text-[12.5px] font-medium",
        tone === "light"
          ? verified
            ? "border-verified/25 bg-verified/[0.07] text-verified"
            : "border-line-light bg-ivory text-ink-muted"
          : verified
            ? "border-gold/30 bg-gold/10 text-gold-soft"
            : "border-white/10 bg-white/[0.04] text-mist",
        className,
      )}
    >
      {verified && <Check className="h-2.5 w-2.5" />}
      {children}
    </span>
  );
}
