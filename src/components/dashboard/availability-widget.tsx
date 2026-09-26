"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";
import { setAvailability } from "@/app/dashboard/student/actions";
import { Switch } from "@/components/ui/switch";
import { EASE_QUINT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type A = { status: "AVAILABLE" | "UNAVAILABLE"; from: string; to: string };

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const toInput = (iso: string) => iso.slice(0, 10);

/** The product's hero feature: students broadcast exactly when they can work. */
export function AvailabilityWidget({ initial }: { initial: A }) {
  const [a, setA] = useState<A>(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ from: toInput(initial.from), to: toInput(initial.to) });
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const available = a.status === "AVAILABLE";
  const days = Math.max(0, Math.round((new Date(a.to).getTime() - new Date(a.from).getTime()) / 86400000) + 1);

  const commit = (next: A) => {
    const prev = a;
    setA(next); // optimistic
    setError(undefined);
    start(async () => {
      const res = await setAvailability(next);
      if (!res.ok) {
        setA(prev);
        setError(res.error);
      } else setA(res.availability as A);
    });
  };

  return (
    <section
      data-surface="dark"
      aria-label="Availability"
      className="relative w-full overflow-hidden rounded-card-lg border border-line-dark bg-navy-900 p-6 text-ivory shadow-card-dark sm:p-7"
    >
      <div aria-hidden className={cn("pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl transition-colors duration-700", available ? "bg-verified/25" : "bg-peach/20")} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[10.5px] text-gold/80">Availability</p>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {available && <span className="absolute inset-0 animate-ping rounded-full bg-[#4cc38a]/70" />}
              <span className={cn("relative h-2.5 w-2.5 rounded-full", available ? "bg-[#4cc38a]" : "bg-peach")} />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={a.status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }} className="text-[15px] font-medium">
                {available ? "Available for projects" : "Not taking projects"}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <Switch checked={available} disabled={pending} label="Toggle availability" onCheckedChange={(v) => commit({ ...a, status: v ? "AVAILABLE" : "UNAVAILABLE" })} />
      </div>

      <div className={cn("relative mt-6 transition-opacity duration-500", !available && "opacity-40")}>
        <p className="font-serif text-[2.4rem] leading-none tracking-[-0.02em] text-ivory sm:text-[2.7rem]">
          {fmt(a.from)} <span className="text-gold-soft">–</span> {fmt(a.to)}
        </p>
        <p className="mt-2 text-[13px] text-mist/60">
          {days} days · companies see you in matches for this window
        </p>
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_QUINT }}
            className="relative overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              commit({ status: "AVAILABLE", from: new Date(draft.from).toISOString(), to: new Date(draft.to).toISOString() });
              setEditing(false);
            }}
          >
            <div className="mt-5 grid grid-cols-2 gap-3">
              {(["from", "to"] as const).map((k) => (
                <label key={k} className="flex flex-col gap-1.5 text-[11.5px] uppercase tracking-[0.14em] text-mist/60">
                  {k}
                  <input
                    type="date"
                    value={draft[k]}
                    onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                    className="h-11 rounded-[10px] border border-white/10 bg-white/[0.04] px-3 text-[14px] normal-case tracking-normal text-ivory [color-scheme:dark] focus:border-gold/50 focus:outline-none"
                  />
                </label>
              ))}
            </div>
            <button type="submit" className="mt-3 h-10 w-full rounded-[10px] bg-gold text-[14px] font-medium text-navy-900 transition-colors hover:bg-gold-soft">
              Save window
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[13px]">
        <button type="button" onClick={() => setEditing((v) => !v)} className="font-medium text-gold-soft underline-offset-4 hover:underline">
          {editing ? "Cancel" : "Change dates"}
        </button>
        <span className="text-mist/50" aria-live="polite">
          {pending ? "Saving…" : error ? <span className="text-peach">{error}</span> : "Saved"}
        </span>
      </div>
    </section>
  );
}
