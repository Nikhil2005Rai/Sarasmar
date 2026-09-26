"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SMark } from "@/components/brand/s-mark";
import { OpportunityCard } from "@/components/marketplace/opportunity-card";
import type { OpportunityView } from "@/lib/types";

export function OpportunityGrid({ items, matched }: { items: OpportunityView[]; matched: string[] }) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center overflow-hidden rounded-card-lg border border-dashed border-line-light bg-warm-white px-6 py-20 text-center"
      >
        <SMark className="h-24 w-[72px] opacity-80" tone="light" drawOnMount sparkle={false} />
        <h3 className="mt-6 font-serif text-[2rem] leading-none text-navy-900">Nothing fits — yet.</h3>
        <p className="mt-3 max-w-sm text-[14.5px] text-ink-muted">
          No open projects match every filter. Loosen one, or set your availability and we’ll notify you when a match is posted.
        </p>
        <Link href="/opportunities" className="mt-8 inline-flex h-11 items-center rounded-[11px] bg-navy-900 px-5 text-[14px] font-medium text-ivory">
          Clear filters
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((o) => (
          <OpportunityCard key={o.id} o={o} matched={matched} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
