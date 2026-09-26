import { cn } from "@/lib/utils";

/** SARAS (knowledge, ink) + MER (connection, gold) — set in Cormorant with optical tightening. */
export function Wordmark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn("font-serif font-medium tracking-[0.06em] leading-none", className)}
      aria-label="SARASMER"
    >
      <span className={tone === "dark" ? "text-ivory" : "text-navy-900"}>SARAS</span>
      <span className="text-gradient-gold">MER</span>
    </span>
  );
}
