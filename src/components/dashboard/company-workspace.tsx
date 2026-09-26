"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { createProject } from "@/app/dashboard/company/actions";
import { SLoader } from "@/components/brand/s-loader";
import { ProgressRing } from "@/components/motion/count-up";
import { SkillTag } from "@/components/ui/badges";
import { Arrow, Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { EASE_QUINT } from "@/lib/motion";
import type { RankedStudent } from "@/lib/queries";
import { cn, formatRange, initials } from "@/lib/utils";
import { projectSchema, type ProjectInput } from "@/lib/validations";

const WEEKS = ["2", "3", "4", "6", "8"] as const;

function useDebounced<T>(value: T, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function CompanyWorkspace({ skills, defaults }: { skills: string[]; defaults: { from: string; to: string } }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const form = useForm<ProjectInput>({
    // zod coerces date strings → Date; the server action re-validates with the same schema
    resolver: zodResolver(projectSchema) as unknown as Resolver<ProjectInput>,
    defaultValues: {
      title: "",
      description: "",
      skills: ["Financial Modelling", "Excel"],
      durationWeeks: 3,
      availabilityFrom: defaults.from,
      availabilityTo: defaults.to,
      headcount: 2,
      budget: 20000,
      industry: "Finance",
    },
  });
  const { errors } = form.formState;
  const watched = form.watch(["skills", "availabilityFrom", "availabilityTo"]);
  const q = useDebounced({ skills: (watched[0] ?? []) as string[], from: String(watched[1] ?? ""), to: String(watched[2] ?? "") });

  const matches = useQuery({
    queryKey: ["matches", q.skills.join(","), q.from, q.to],
    enabled: q.skills.length > 0 && !!q.from && !!q.to,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params = new URLSearchParams({ skills: q.skills.join(","), from: q.from, to: q.to });
      const res = await fetch(`/api/matches?${params}`);
      if (!res.ok) throw new Error("Could not load matches");
      return (await res.json()) as { students: RankedStudent[] };
    },
  });

  const onSubmit = form.handleSubmit((v) =>
    start(async () => {
      setResult(null);
      const res = await createProject(v);
      if (!res.ok) {
        if ("fieldErrors" in res && res.fieldErrors) for (const [k, m] of Object.entries(res.fieldErrors)) form.setError(k as keyof ProjectInput, { message: m });
        setResult({ ok: false, message: res.error });
      } else {
        setResult({ ok: true, message: `“${res.title}” is live — matched students can now see it.` });
        form.reset({ ...v, title: "", description: "" });
      }
    }),
  );

  const students = matches.data?.students ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ── requirement form ───────────────────────────────── */}
      <section id="new" className="card-light scroll-mt-24 p-6 sm:p-7">
        <p className="eyebrow text-[10.5px] text-ink-faint">New project</p>
        <h2 className="mt-2 font-serif text-[1.9rem] leading-none text-navy-900">What do you need done?</h2>
        <form onSubmit={onSubmit} className="mt-7 space-y-6" noValidate>
          <Field label="Project title" htmlFor="title" error={errors.title?.message}>
            <Input id="title" placeholder="e.g. Q4 budget model refresh" invalid={!!errors.title} {...form.register("title")} />
          </Field>
          <Field label="Brief" htmlFor="description" error={errors.description?.message} hint="What will they deliver?">
            <Textarea id="description" rows={3} placeholder="Two sentences on the outcome, the data, and who they’ll work with." invalid={!!errors.description} {...form.register("description")} />
          </Field>

          <Controller
            control={form.control}
            name="skills"
            render={({ field }) => (
              <Field label="Required skills" error={errors.skills?.message} hint={`${field.value.length}/6 selected`}>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Required skills">
                  {skills.map((s) => {
                    const on = field.value.includes(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        aria-pressed={on}
                        onClick={() => field.onChange(on ? field.value.filter((x) => x !== s) : field.value.length < 6 ? [...field.value, s] : field.value)}
                        className={cn(
                          "h-8 rounded-[8px] border px-3 text-[13px] font-medium transition-[background-color,border-color,color] duration-300",
                          on ? "border-navy-900 bg-navy-900 text-ivory" : "border-line-light bg-ivory text-ink-muted hover:border-navy-900/25 hover:text-navy-900",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="durationWeeks"
            render={({ field }) => (
              <Field label="Duration (weeks)">
                <Segmented size="sm" value={String(field.value) as (typeof WEEKS)[number]} onChange={(v) => field.onChange(Number(v))} options={WEEKS.map((w) => ({ value: w, label: w }))} />
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Window starts" htmlFor="from" error={errors.availabilityFrom?.message}>
              <Input id="from" type="date" {...form.register("availabilityFrom")} />
            </Field>
            <Field label="Window ends" htmlFor="to" error={errors.availabilityTo?.message}>
              <Input id="to" type="date" invalid={!!errors.availabilityTo} {...form.register("availabilityTo")} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Headcount" htmlFor="headcount" error={errors.headcount?.message}>
              <Input id="headcount" type="number" min={1} max={20} invalid={!!errors.headcount} {...form.register("headcount")} />
            </Field>
            <Field label="Stipend (₹)" htmlFor="budget" hint="0 = unpaid">
              <Input id="budget" type="number" min={0} step={1000} {...form.register("budget")} />
            </Field>
          </div>

          <AnimatePresence>
            {result && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className={cn(
                  "rounded-[10px] border px-4 py-3 text-[13.5px]",
                  result.ok ? "border-verified/25 bg-verified/[0.07] text-verified" : "border-[#e8bfb3] bg-[#fbeee9] text-[#9a3b26]",
                )}
              >
                {result.message}
              </motion.p>
            )}
          </AnimatePresence>
          <Button type="submit" variant="navy" size="lg" className="w-full" disabled={pending}>
            {pending ? "Publishing…" : "Publish project"} {!pending && <Arrow />}
          </Button>
        </form>
      </section>

      {/* ── live matches ───────────────────────────────────── */}
      <section className="flex flex-col">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2 text-[10.5px] text-ink-faint">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-verified/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-verified" />
              </span>
              Live matching
            </p>
            <h2 className="mt-2 font-serif text-[1.9rem] leading-none text-navy-900">Matching students</h2>
          </div>
          <span className="text-[13px] text-ink-faint">{matches.isFetching ? "Updating…" : `${students.length} ranked`}</span>
        </div>
        <p className="mt-2 text-[13.5px] text-ink-muted">Ranked by verified skill score (70%) and overlap with your window (30%). Updates as you edit.</p>

        <div className="mt-5 flex-1">
          {matches.isLoading ? (
            <div className="grid h-64 place-items-center">
              <SLoader label="Finding matches" />
            </div>
          ) : students.length === 0 ? (
            <div className="grid h-64 place-items-center rounded-card border border-dashed border-line-light text-center">
              <div>
                <p className="font-serif text-[1.4rem] text-navy-900">No one yet</p>
                <p className="mt-1 text-[13.5px] text-ink-muted">Pick a skill or widen the window to see ranked students.</p>
              </div>
            </div>
          ) : (
            <motion.ul layout className={cn("space-y-3 transition-opacity", matches.isFetching && "opacity-70")}>
              <AnimatePresence initial={false}>
                {students.map((s, i) => (
                  <MatchRow key={s.id} s={s} index={i} />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>
    </div>
  );
}

function MatchRow({ s, index }: { s: RankedStudent; index: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.55, ease: EASE_QUINT, delay: index * 0.05 }}
      className="group flex items-center gap-4 rounded-card border border-line-light bg-warm-white p-4 shadow-card transition-[box-shadow,border-color] duration-500 hover:border-navy-900/15 hover:shadow-card-hover"
    >
      <ProgressRing key={`${s.id}-${s.score}`} value={s.score} size={60} stroke={4} delay={index * 0.05} textClassName="font-serif text-[1.05rem] text-navy-900" color={s.score >= 80 ? "#D9A441" : "#3568B8"} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-navy-900 font-serif text-[10.5px] text-gold-soft">{initials(s.name)}</span>
          <p className="shrink-0 font-medium text-navy-900">{s.name}</p>
          <span className="hidden min-w-0 truncate text-[12.5px] text-ink-faint sm:inline">· {s.program}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {s.verified.length ? (
            s.verified.map((k) => (
              <SkillTag key={k} verified className="h-6 text-[11.5px]">
                {k}
              </SkillTag>
            ))
          ) : (
            <span className="text-[12px] text-ink-faint">No verified overlap yet</span>
          )}
        </div>
      </div>
      <div className="hidden shrink-0 text-right md:block">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">Available</p>
        <p className="mt-0.5 text-[13px] font-medium text-navy-900">{s.availability ? formatRange(s.availability.from, s.availability.to) : "—"}</p>
      </div>
      <button className="h-9 shrink-0 rounded-[9px] border border-line-light px-3 text-[12.5px] font-medium text-royal transition-colors hover:border-royal/40">View Profile</button>
    </motion.li>
  );
}
