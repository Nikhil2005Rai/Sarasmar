import Link from "next/link";
import { CompanyWorkspace } from "@/components/dashboard/company-workspace";
import { SplitReveal } from "@/components/motion/reveal";
import { SkillTag } from "@/components/ui/badges";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { formatINR, formatRange } from "@/lib/utils";

export const metadata = { title: "Company dashboard" };
export const dynamic = "force-dynamic";

export default async function CompanyDashboard() {
  const user = await requireRole("COMPANY");
  const [company, skills] = await Promise.all([
    db.company.findUnique({
      where: { userId: user.id },
      include: { projects: { orderBy: { createdAt: "desc" }, include: { applications: { select: { matchScore: true, status: true } } } } },
    }),
    db.skill.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  if (!company) return <p className="text-ink-muted">Company profile not found.</p>;

  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > 20 ? 1 : 0), 14);
  const to = new Date(from.getTime() + 16 * 864e5);
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const totalApplicants = company.projects.reduce((n, p) => n + p.applications.length, 0);

  return (
    <div className="mx-auto max-w-[1240px]">
      <header className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow mb-5 text-royal">{company.name}</p>
          <h1 className="font-serif text-[clamp(2.4rem,4.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.025em] text-navy-900">
            <SplitReveal immediate text={"Find people who are\n_ready_ to work."} />
          </h1>
        </div>
        <dl className="flex gap-10 border-t border-line-light pt-5 lg:border-0 lg:pt-0">
          {[
            { k: "Open projects", v: company.projects.length },
            { k: "Applicants", v: totalApplicants },
            { k: "Verified pool", v: await db.student.count({ where: { skills: { some: { verified: true } } } }) },
          ].map((s) => (
            <div key={s.k}>
              <dt className="text-[12px] text-ink-faint">{s.k}</dt>
              <dd className="mt-1 font-serif text-[2.2rem] leading-none text-navy-900">{s.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-10">
        <CompanyWorkspace skills={skills.map((s) => s.name)} defaults={{ from: iso(from), to: iso(to) }} />
      </div>

      <section id="projects" className="mt-14 scroll-mt-24">
        <p className="eyebrow text-[10.5px] text-ink-faint">Your projects</p>
        <div className="card-light mt-4 overflow-hidden">
          {company.projects.length === 0 ? (
            <p className="p-8 text-center text-ink-muted">Nothing posted yet. Your first project will appear here.</p>
          ) : (
            <ul className="divide-y divide-line-light">
              {company.projects.map((p) => {
                const best = p.applications.reduce((m, a) => Math.max(m, a.matchScore), 0);
                return (
                  <li key={p.id} className="grid grid-cols-1 gap-3 px-6 py-5 md:grid-cols-[1.6fr_1fr_auto_auto] md:items-center md:gap-8">
                    <div className="min-w-0">
                      <Link href={`/opportunities/${p.id}`} className="font-medium text-navy-900 hover:text-royal">
                        {p.title}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.skills.map((s) => (
                          <SkillTag key={s} className="h-6 text-[11.5px]">
                            {s}
                          </SkillTag>
                        ))}
                      </div>
                    </div>
                    <p className="text-[13px] text-ink-muted">
                      {formatRange(p.availabilityFrom, p.availabilityTo)} · {p.duration}
                      <br />
                      <span className="text-ink-faint">{p.budget ? formatINR(p.budget) : "Unpaid"} · {p.headcount} seats</span>
                    </p>
                    <p className="text-[13px]">
                      <span className="font-serif text-[1.6rem] text-navy-900">{p.applications.length}</span> <span className="text-ink-faint">applicants</span>
                    </p>
                    <p className="font-mono text-[13px] text-navy-900">{best ? `best ${best}%` : "—"}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
