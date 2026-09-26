"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { OpportunityCard } from "@/components/marketplace/opportunity-card";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal, RevealItem, SplitReveal } from "@/components/motion/reveal";
import { Arrow, Button } from "@/components/ui/button";
import { PREVIEW_OPPORTUNITIES } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "skill", label: "Skill: Power BI" },
  { key: "industry", label: "Industry: Finance" },
  { key: "duration", label: "Duration ≤ 3 wks" },
  { key: "paid", label: "Paid only" },
  { key: "avail", label: "Available in Oct" },
] as const;
type FilterKey = (typeof FILTERS)[number]["key"];

export function MarketplacePreview() {
  const [f, setF] = useState<FilterKey>("all");
  const items = useMemo(() => {
    return PREVIEW_OPPORTUNITIES.filter((o) => {
      if (f === "skill") return o.skills.includes("Power BI");
      if (f === "industry") return o.industry === "Finance";
      if (f === "duration") return o.durationWeeks <= 3;
      if (f === "paid") return o.paid;
      return true;
    });
  }, [f]);

  return (
    <section data-surface="light" className="relative bg-warm-white">
      <div className="container-x section-y">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Reveal>
              <RevealItem as="p" className="eyebrow mb-6 text-royal">
                Opportunity marketplace
              </RevealItem>
            </Reveal>
            <h2 className="display-l max-w-3xl text-navy-900">
              <SplitReveal text={"Work that’s scoped, dated,\nand _actually_ paid."} />
            </h2>
          </div>
          <Reveal>
            <RevealItem>
              <Magnetic>
                <Button asChild variant="navy" size="lg">
                  <Link href="/opportunities">
                    Browse the marketplace <Arrow />
                  </Link>
                </Button>
              </Magnetic>
            </RevealItem>
          </Reveal>
        </div>

        <LayoutGroup>
          <div className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter opportunities">
            {FILTERS.map((c) => {
              const active = c.key === f;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setF(c.key)}
                  className={cn(
                    "relative h-10 shrink-0 rounded-[9px] border px-4 text-[13.5px] font-medium transition-colors duration-300",
                    active ? "border-navy-900 text-ivory" : "border-line-light bg-ivory text-ink-muted hover:border-navy-900/25 hover:text-navy-900",
                  )}
                >
                  {active && <motion.span layoutId="chip-bg" className="absolute inset-0 rounded-[8px] bg-navy-900" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <AnimatePresence mode="popLayout">
              {items.map((o, i) => (
                <OpportunityCard
                  key={o.id}
                  o={o}
                  featured={i === 0}
                  matched={["Excel", "Power BI"]}
                  className={cn(i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5")}
                />
              ))}
              {items.length === 0 && (
                <motion.p key="empty" className="col-span-full py-16 text-center text-ink-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No previews for that filter — the full marketplace has more.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
