"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export type FacetData = { skills: string[]; industries: string[]; months: { value: string; label: string }[] };

const DURATIONS = [
  { value: "2", label: "≤ 2 weeks" },
  { value: "4", label: "≤ 4 weeks" },
  { value: "8", label: "≤ 8 weeks" },
];

function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = (key: string, value: string | null, multi = false) => {
    const next = new URLSearchParams(params.toString());
    if (multi && value) {
      const cur = next.getAll(key);
      next.delete(key);
      (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).forEach((v) => next.append(key, v));
    } else if (value === null || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };
  const clear = () => start(() => router.replace(pathname, { scroll: false }));
  return { params, set, clear, pending };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line-light py-5 first:border-t-0 first:pt-0">
      <legend className="eyebrow mb-3 text-[10.5px] text-ink-faint">{title}</legend>
      {children}
    </fieldset>
  );
}

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "h-8 rounded-[8px] border px-3 text-[13px] font-medium transition-colors duration-300",
        on ? "border-navy-900 bg-navy-900 text-ivory" : "border-line-light bg-warm-white text-ink-muted hover:border-navy-900/25 hover:text-navy-900",
      )}
    >
      {children}
    </button>
  );
}

function Row({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className="group flex w-full items-center gap-3 py-1.5 text-left text-[14px]">
      <span className={cn("grid h-4 w-4 place-items-center rounded-[5px] border transition-colors", on ? "border-royal bg-royal" : "border-line-light bg-warm-white group-hover:border-navy-900/30")}>
        {on && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white">
            <path d="M2.2 6.3 4.8 8.8 9.8 3.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={on ? "font-medium text-navy-900" : "text-ink-muted group-hover:text-navy-900"}>{children}</span>
    </button>
  );
}

function FilterBody({ facets }: { facets: FacetData }) {
  const { params, set, clear, pending } = useFilterNav();
  const skills = params.getAll("skill");
  const [q, setQ] = useState(params.get("q") ?? "");
  return (
    <div className={cn("transition-opacity", pending && "opacity-60")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          set("q", q.trim() || null);
        }}
        className="mb-6"
      >
        <label htmlFor="q" className="sr-only">
          Search
        </label>
        <div className="relative">
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden>
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects"
            className="h-11 w-full rounded-[11px] border border-line-light bg-warm-white pl-10 pr-3 text-[14px] text-navy-900 placeholder:text-ink-faint focus:border-royal/50 focus:outline-none focus:ring-4 focus:ring-royal/10"
          />
        </div>
      </form>

      <Group title="Skill">
        <div className="flex flex-wrap gap-1.5">
          {facets.skills.map((s) => (
            <Chip key={s} on={skills.includes(s)} onClick={() => set("skill", s, true)}>
              {s}
            </Chip>
          ))}
        </div>
      </Group>
      <Group title="Industry">
        {facets.industries.map((i) => (
          <Row key={i} on={params.get("industry") === i} onClick={() => set("industry", i)}>
            {i}
          </Row>
        ))}
      </Group>
      <Group title="Duration">
        {DURATIONS.map((d) => (
          <Row key={d.value} on={params.get("duration") === d.value} onClick={() => set("duration", d.value)}>
            {d.label}
          </Row>
        ))}
      </Group>
      <Group title="Compensation">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { v: "paid", l: "Paid" },
            { v: "unpaid", l: "Unpaid" },
          ].map((o) => (
            <Chip key={o.v} on={params.get("pay") === o.v} onClick={() => set("pay", o.v)}>
              {o.l}
            </Chip>
          ))}
        </div>
      </Group>
      <Group title="Availability">
        {facets.months.map((m) => (
          <Row key={m.value} on={params.get("month") === m.value} onClick={() => set("month", m.value)}>
            Open during {m.label}
          </Row>
        ))}
      </Group>
      {params.toString() && (
        <button type="button" onClick={clear} className="mt-2 text-[13px] font-medium text-royal underline-offset-4 hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );
}

export function FilterSidebar({ facets }: { facets: FacetData }) {
  return (
    <aside className="sticky top-24 hidden max-h-[calc(100svh-7rem)] overflow-y-auto pr-2 lg:block" data-lenis-prevent>
      <FilterBody facets={facets} />
    </aside>
  );
}

export function MobileFilters({ facets, count }: { facets: FacetData; count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex h-11 items-center gap-2 rounded-[10px] border border-line-light bg-warm-white px-4 text-[14px] font-medium text-navy-900 lg:hidden">
        <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
          <path d="M3 6h14M6 10h8M8.5 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Filters
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[86svh] overflow-y-auto rounded-t-[20px] bg-ivory p-6 pb-10"
            data-lenis-prevent
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-light" />
            <Dialog.Title className="font-serif text-[1.8rem] text-navy-900">Filters</Dialog.Title>
            <Dialog.Description className="mb-6 text-[13px] text-ink-muted">{count} opportunities match</Dialog.Description>
            <FilterBody facets={facets} />
            <Dialog.Close className="mt-6 h-12 w-full rounded-[12px] bg-navy-900 text-[15px] font-medium text-ivory">Show results</Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
