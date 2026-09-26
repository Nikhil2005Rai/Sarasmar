"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { forwardRef } from "react";
import { SkillTag } from "@/components/ui/badges";
import { Arrow, Button } from "@/components/ui/button";
import type { OpportunityView } from "@/lib/types";
import { cn, formatINR, formatRange } from "@/lib/utils";

type Props = { o: OpportunityView; featured?: boolean; matched?: string[]; className?: string };

export const OpportunityCard = forwardRef<HTMLElement, Props>(function OpportunityCard({ o, featured = false, matched = [], className }, ref) {
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line-light bg-warm-white p-6 shadow-card transition-[box-shadow,transform,border-color] duration-500 ease-quint hover:-translate-y-1 hover:border-navy-900/15 hover:shadow-card-hover sm:p-7",
        className,
      )}
    >
      {/* gold corner accent */}
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-16 w-16 overflow-hidden">
        <span className="absolute right-0 top-0 h-px w-10 bg-gradient-to-l from-gold to-transparent transition-all duration-500 ease-quint group-hover:w-16" />
        <span className="absolute right-0 top-0 h-10 w-px bg-gradient-to-b from-gold to-transparent transition-all duration-500 ease-quint group-hover:h-16" />
      </span>

      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-navy-900 font-serif text-[15px] text-gold-soft">{o.company[0]}</span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-navy-900">{o.company}</p>
          <p className="text-[12px] text-ink-faint">
            {o.industry} · {o.remote ? "Remote" : "On-site"}
          </p>
        </div>
        <span
          className={cn(
            "ml-auto shrink-0 rounded-[6px] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
            o.paid ? "bg-gold/15 text-[#8a5d12]" : "bg-line-light text-ink-muted",
          )}
        >
          {o.paid ? "Paid" : "Unpaid"}
        </span>
      </div>

      <h3 className={cn("mt-6 font-serif font-medium leading-[1.05] tracking-[-0.015em] text-navy-900", featured ? "text-[2.1rem]" : "text-[1.65rem]")}>
        {o.title}
      </h3>
      {featured && <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-muted">{o.description}</p>}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {o.skills.map((s) => (
          <SkillTag key={s} verified={matched.includes(s)}>
            {s}
          </SkillTag>
        ))}
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line-light pt-5 text-[12.5px]">
        <div>
          <dt className="text-ink-faint">Duration</dt>
          <dd className="mt-0.5 font-medium text-navy-900">{o.duration}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Window</dt>
          <dd className="mt-0.5 font-medium text-navy-900">{formatRange(o.from, o.to)}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">{o.paid ? "Stipend" : "Seats"}</dt>
          <dd className="mt-0.5 font-medium text-navy-900">{o.paid && o.budget ? formatINR(o.budget) : `${o.headcount} open`}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-[12px] text-ink-faint">{o.headcount} {o.headcount === 1 ? "seat" : "seats"}</span>
        <Button asChild variant="ghost-light" size="sm" className="group/btn">
          <Link href={`/opportunities/${o.id}`} data-cursor="view" data-cursor-label="Open">
            View Opportunity <Arrow />
          </Link>
        </Button>
      </div>
    </motion.article>
  );
});
