import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FilterSidebar, MobileFilters, type FacetData } from "@/components/marketplace/filters";
import { OpportunityGrid } from "@/components/marketplace/grid";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { toOpportunityView } from "@/lib/queries";

export const metadata = { title: "Opportunities" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function OpportunitiesPage({ searchParams }: { searchParams: SP }) {
  const session = await auth();
  const skills = all(searchParams.skill);
  const industry = one(searchParams.industry);
  const duration = Number(one(searchParams.duration)) || null;
  const pay = one(searchParams.pay);
  const month = one(searchParams.month); // YYYY-MM
  const q = one(searchParams.q)?.trim();

  const where: Prisma.ProjectWhereInput = { AND: [] };
  const and = where.AND as Prisma.ProjectWhereInput[];
  if (skills.length) and.push({ skills: { hasSome: skills } });
  if (industry) and.push({ industry });
  if (duration) and.push({ durationWeeks: { lte: duration } });
  if (pay === "paid") and.push({ paid: true });
  if (pay === "unpaid") and.push({ paid: false });
  if (q) and.push({ OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] });
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 0, 23, 59));
    and.push({ availabilityFrom: { lte: end }, availabilityTo: { gte: start } });
  }

  const [projects, skillRows, industries, windows, mine] = await Promise.all([
    db.project.findMany({ where, include: { company: true }, orderBy: { createdAt: "desc" } }),
    db.skill.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
    db.project.findMany({ distinct: ["industry"], select: { industry: true }, orderBy: { industry: "asc" } }),
    db.project.findMany({ select: { availabilityFrom: true, availabilityTo: true } }),
    session?.user.role === "STUDENT"
      ? db.studentSkill.findMany({ where: { student: { userId: session.user.id }, verified: true }, include: { skill: true } })
      : Promise.resolve([]),
  ]);

  const monthSet = new Map<string, string>();
  for (const w of windows) {
    const d = new Date(Date.UTC(w.availabilityFrom.getUTCFullYear(), w.availabilityFrom.getUTCMonth(), 1));
    while (d <= w.availabilityTo) {
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      monthSet.set(key, d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }));
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
  }
  const facets: FacetData = {
    skills: skillRows.map((s) => s.name),
    industries: industries.map((i) => i.industry),
    months: [...monthSet.entries()].sort().map(([value, label]) => ({ value, label })),
  };
  const items = projects.map(toOpportunityView);
  const activeCount = [skills.length > 0, industry, duration, pay, month, q].filter(Boolean).length;

  return (
    <>
      <Navbar user={session?.user ? { name: session.user.name ?? "", role: session.user.role } : null} />
      <header data-surface="dark" className="relative overflow-hidden bg-navy-900 pb-16 pt-[calc(var(--nav-h)+4rem)] text-ivory">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(800px_400px_at_85%_20%,rgba(53,104,184,0.22),transparent_60%)]" />
        <svg aria-hidden viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-48 w-full opacity-60">
          <path d="M0 220 C 320 120, 560 300, 860 200 C 1120 110, 1260 160, 1440 90" fill="none" stroke="#D9A441" strokeOpacity="0.5" />
        </svg>
        <div className="container-x relative">
          <p className="eyebrow mb-6 text-gold">Discover</p>
          <h1 className="display-l max-w-3xl">
            Open projects, <em className="italic text-gold-soft">matched</em> to what you can prove.
          </h1>
          <p className="mt-5 max-w-xl text-mist/75">Filter by skill, industry, duration, pay and the weeks you’re free. Every listing is scoped and dated.</p>
        </div>
      </header>

      <main data-surface="light" className="bg-ivory">
        <div className="container-x grid grid-cols-1 gap-10 py-12 lg:grid-cols-[260px_1fr] lg:py-16">
          <FilterSidebar facets={facets} />
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-[14px] text-ink-muted">
                <span className="font-serif text-[1.6rem] text-navy-900">{items.length}</span> {items.length === 1 ? "opportunity" : "opportunities"}
                {activeCount > 0 && <span className="text-ink-faint"> · {activeCount} filter{activeCount > 1 ? "s" : ""}</span>}
              </p>
              <MobileFilters facets={facets} count={items.length} />
            </div>
            <OpportunityGrid items={items} matched={mine.map((m) => m.skill.name)} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
