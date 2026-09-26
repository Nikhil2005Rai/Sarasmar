"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { applyToProject } from "@/app/dashboard/student/actions";
import { TiltCard } from "@/components/motion/tilt-card";
import { Check } from "@/components/ui/badges";
import { Arrow } from "@/components/ui/button";
import type { OpportunityView } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";

export function ProjectMatchCard({ o, score, matched, applied }: { o: OpportunityView; score: number; matched: string[]; applied: boolean }) {
  const [done, setDone] = useState(applied);
  const [pending, start] = useTransition();
  return (
    <TiltCard max={4} className="card-light rounded-card transition-shadow duration-500 hover:shadow-card-hover">
      <div className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] text-ink-faint">{o.company}</p>
            <h3 className="mt-1 font-serif text-[1.45rem] leading-[1.1] text-navy-900">{o.title}</h3>
          </div>
          <span className="shrink-0 rounded-[8px] bg-navy-900 px-2.5 py-1.5 text-center">
            <span className="block font-serif text-[1.15rem] leading-none text-gold-soft">{score}%</span>
            <span className="eyebrow text-[8.5px] text-mist/60">match</span>
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px]">
          <span className="font-semibold text-navy-900">{o.paid && o.budget ? formatINR(o.budget) : "Unpaid"}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink-muted">{o.duration}</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-[6px] bg-verified/10 px-2 py-1 text-[11.5px] font-medium text-verified">
            <Check className="h-2.5 w-2.5" /> {matched.length} {matched.length === 1 ? "skill" : "skills"} matched
          </span>
        </div>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={`/opportunities/${o.id}`} className="group inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[9px] border border-line-light bg-warm-white text-[13px] font-medium text-navy-900 transition-colors hover:border-navy-900/25">
            View Project <Arrow />
          </Link>
          <button
            disabled={done || pending}
            onClick={() =>
              start(async () => {
                const r = await applyToProject(o.id);
                if (r.ok) setDone(true);
              })
            }
            className={cn(
              "h-9 rounded-[9px] px-3.5 text-[13px] font-medium transition-colors",
              done ? "bg-verified/10 text-verified" : "bg-royal text-white hover:bg-[#2d5aa0]",
            )}
          >
            {done ? "Applied" : pending ? "…" : "Apply"}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
