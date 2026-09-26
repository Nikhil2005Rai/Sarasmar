import Link from "next/link";
import { SMark } from "@/components/brand/s-mark";

const COLS = [
  {
    title: "Platform",
    links: [
      { l: "Discover opportunities", h: "/opportunities" },
      { l: "How it works", h: "/#how" },
      { l: "Skill verification", h: "/signup?role=student" },
    ],
  },
  {
    title: "Students",
    links: [
      { l: "Create a profile", h: "/signup?role=student" },
      { l: "Student dashboard", h: "/dashboard/student" },
      { l: "Log in", h: "/login" },
    ],
  },
  {
    title: "Companies",
    links: [
      { l: "Post a project", h: "/signup?role=company" },
      { l: "Company dashboard", h: "/dashboard/company" },
      { l: "About SARASMER", h: "/#story" },
    ],
  },
];

export function Footer() {
  return (
    <footer data-surface="dark" className="relative overflow-hidden bg-navy-900 text-ivory">
      <svg aria-hidden viewBox="0 0 1440 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[400px] w-full opacity-30">
        <defs>
          <linearGradient id="ft" x1="0" x2="1">
            <stop offset="0" stopColor="#3568B8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8A78C7" stopOpacity="0.6" />
            <stop offset="1" stopColor="#D9A441" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 120 C 360 20, 520 260, 820 180 C 1100 110, 1200 20, 1440 80" fill="none" stroke="url(#ft)" strokeWidth="1" />
      </svg>
      <div className="container-x relative pt-24">
        <div className="grid grid-cols-1 gap-14 border-b border-white/[0.07] pb-16 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <SMark className="h-10 w-8" sparkle={false} />
              <p className="font-serif text-[1.9rem] leading-none text-ivory">Skills Meet Opportunity</p>
            </div>
            <p className="mt-5 max-w-sm text-[15px] text-mist/60">Verified student talent for the projects that can’t wait for next hiring season.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5 text-[10.5px] text-gold/80">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.l}>
                      <Link href={l.h} className="text-[14.5px] text-mist/70 transition-colors duration-300 hover:text-ivory">
                        {l.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden className="relative select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-serif text-[18.6vw] font-medium leading-[0.8] tracking-[-0.02em] text-ivory/[0.045]">
          SARASMER
        </p>
      </div>
      <div className="container-x flex flex-col items-start justify-between gap-3 border-t border-white/[0.07] py-7 text-[12.5px] text-mist/50 sm:flex-row sm:items-center">
        <p>© 2026 SARASMER</p>
        <p className="eyebrow text-[10.5px]">Knowledge × Connection × Opportunity</p>
      </div>
    </footer>
  );
}
