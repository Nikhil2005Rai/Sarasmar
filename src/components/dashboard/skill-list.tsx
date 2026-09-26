"use client";

import { motion } from "framer-motion";
import { Check } from "@/components/ui/badges";
import { EASE_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type S = { id: string; name: string; category: string; verified: boolean; score: number | null; verifiedAt: string | null };

export function SkillList({ skills }: { skills: S[] }) {
  return (
    <ul className="divide-y divide-line-light">
      {skills.map((s, i) => (
        <motion.li
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_QUINT, delay: 0.15 + i * 0.07 }}
          className="flex items-center gap-4 py-3.5"
        >
          <span
            className={cn(
              "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border",
              s.verified ? "border-verified/30 bg-verified/10 text-verified" : "border-dashed border-ink-faint/40 text-ink-faint",
            )}
          >
            {s.verified ? (
              <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 + i * 0.07 }}>
                <Check className="h-3.5 w-3.5" />
              </motion.span>
            ) : (
              <span className="h-1 w-1 rounded-full bg-current" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-medium text-navy-900">{s.name}</p>
            <p className="text-[12px] text-ink-faint">
              {s.category}
              {s.verifiedAt && ` · verified ${new Date(s.verifiedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
            </p>
          </div>
          {s.verified ? (
            <div className="flex w-32 items-center gap-3 sm:w-44">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-light">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-royal to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.score ?? 0}%` }}
                  transition={{ duration: 1.2, ease: EASE_QUINT, delay: 0.3 + i * 0.07 }}
                />
              </div>
              <span className="w-7 text-right font-mono text-[12.5px] text-navy-900">{s.score}</span>
            </div>
          ) : (
            <button className="h-8 shrink-0 rounded-[8px] border border-line-light bg-warm-white px-3 text-[12.5px] font-medium text-royal transition-colors hover:border-royal/40">
              Take assessment
            </button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
