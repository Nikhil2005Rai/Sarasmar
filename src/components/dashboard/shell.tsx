"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { SMark } from "@/components/brand/s-mark";
import { Wordmark } from "@/components/brand/wordmark";
import { cn, initials } from "@/lib/utils";

type Item = { label: string; href: string; glyph: string };

const STUDENT_NAV: Item[] = [
  { label: "Overview", href: "/dashboard/student", glyph: "M3 10.5 10 4l7 6.5V17H3z" },
  { label: "Skills", href: "/dashboard/student#skills", glyph: "M4 10l4 4 8-8" },
  { label: "Projects", href: "/dashboard/student#projects", glyph: "M3 6h14v10H3zM7 6V4h6v2" },
  { label: "Marketplace", href: "/opportunities", glyph: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" },
];
const COMPANY_NAV: Item[] = [
  { label: "Overview", href: "/dashboard/company", glyph: "M3 10.5 10 4l7 6.5V17H3z" },
  { label: "New project", href: "/dashboard/company#new", glyph: "M10 4v12M4 10h12" },
  { label: "Your projects", href: "/dashboard/company#projects", glyph: "M3 6h14v10H3zM7 6V4h6v2" },
  { label: "Marketplace", href: "/opportunities", glyph: "M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" },
];

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardShell({ role, user, org, children }: { role: "STUDENT" | "COMPANY"; user: { name: string; email: string }; org?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = role === "COMPANY" ? COMPANY_NAV : STUDENT_NAV;
  const [pending, start] = useTransition();

  return (
    <div data-surface="light" className="min-h-[100svh] bg-ivory lg:grid lg:grid-cols-[256px_1fr]">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-[100svh] flex-col border-r border-line-light bg-warm-white px-4 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 px-3">
          <SMark className="h-7 w-5" sparkle={false} tone="light" />
          <Wordmark className="text-[19px]" tone="light" />
        </Link>
        <p className="eyebrow mt-10 px-3 text-[10px] text-ink-faint">{role === "COMPANY" ? "Company" : "Student"} workspace</p>
        <nav className="mt-3 flex flex-col gap-0.5" aria-label="Dashboard">
          {nav.map((it) => {
            const active = it.href === pathname;
            return (
              <Link
                key={it.label}
                href={it.href}
                className={cn(
                  "relative flex h-10 items-center gap-3 rounded-[9px] px-3 text-[14px] transition-colors duration-300",
                  active ? "text-royal" : "text-ink-muted hover:bg-ivory hover:text-navy-900",
                )}
              >
                {active && (
                  <motion.span layoutId="dash-active" className="absolute inset-0 rounded-[9px] bg-royal/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 34 }}>
                    <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-royal" />
                  </motion.span>
                )}
                <span className="relative">
                  <Glyph d={it.glyph} />
                </span>
                <span className="relative font-medium">{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[12px] border border-line-light bg-ivory p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] bg-navy-900 font-serif text-[14px] text-gold-soft">{initials(user.name)}</span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-navy-900">{user.name}</p>
              <p className="truncate text-[11.5px] text-ink-faint">{org ?? user.email}</p>
            </div>
          </div>
          <button
            onClick={() => start(() => signOutAction())}
            disabled={pending}
            className="mt-3 h-8 w-full rounded-[8px] border border-line-light bg-warm-white text-[12.5px] text-ink-muted transition-colors hover:border-navy-900/20 hover:text-navy-900"
          >
            {pending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-line-light bg-warm-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <SMark className="h-6 w-5" sparkle={false} tone="light" />
            <Wordmark className="text-[17px]" tone="light" />
          </Link>
          <button onClick={() => start(() => signOutAction())} className="text-[13px] text-ink-muted">
            Sign out
          </button>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Dashboard">
          {nav.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              className={cn("h-8 shrink-0 rounded-[8px] px-3 text-[13px] leading-8", it.href === pathname ? "bg-royal/10 font-medium text-royal" : "text-ink-muted")}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="min-w-0 px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-10">{children}</main>
    </div>
  );
}
