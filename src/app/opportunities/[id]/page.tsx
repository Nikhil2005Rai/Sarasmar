import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ApplyButton } from "@/components/marketplace/apply-button";
import { SkillTag } from "@/components/ui/badges";
import { db } from "@/lib/db";
import { matchScore, matchedSkills } from "@/lib/matching";
import { formatINR, formatRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const p = await db.project.findUnique({ where: { id: params.id }, select: { title: true } });
  return { title: p?.title ?? "Opportunity" };
}

export default async function OpportunityPage({ params }: { params: { id: string } }) {
  const [session, project] = await Promise.all([
    auth(),
    db.project.findUnique({ where: { id: params.id }, include: { company: true, _count: { select: { applications: true } } } }),
  ]);
  if (!project) notFound();

  const role = session?.user.role ?? null;
  let fit: { score: number; matched: string[]; applied: boolean } | null = null;
  if (role === "STUDENT") {
    const st = await db.student.findUnique({
      where: { userId: session!.user.id },
      include: { skills: { include: { skill: true } }, availability: true, projects: { where: { projectId: project.id } } },
    });
    if (st) {
      const skills = st.skills.map((s) => ({ name: s.skill.name, verified: s.verified, score: s.score }));
      fit = {
        score: matchScore(project.skills, skills, { from: project.availabilityFrom, to: project.availabilityTo }, st.availability),
        matched: matchedSkills(project.skills, skills),
        applied: st.projects.length > 0,
      };
    }
  }

  return (
    <>
      <Navbar tone="light" user={session?.user ? { name: session.user.name ?? "", role: session.user.role } : null} />
      <main data-surface="light" className="bg-ivory pb-24 pt-[calc(var(--nav-h)+3rem)]">
        <div className="container-x">
          <Link href="/opportunities" className="text-[13.5px] text-ink-muted hover:text-navy-900">
            ← All opportunities
          </Link>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
            <article>
              <p className="eyebrow text-royal">
                {project.company.name} · {project.industry}
              </p>
              <h1 className="display-l mt-5 text-navy-900">{project.title}</h1>
              <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink-muted">{project.description}</p>
              <h2 className="eyebrow mt-12 text-[10.5px] text-ink-faint">Skills required</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <SkillTag key={s} verified={fit?.matched.includes(s)}>
                    {s}
                  </SkillTag>
                ))}
              </div>
              <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-line-light pt-8 sm:grid-cols-4">
                {[
                  { k: "Duration", v: project.duration },
                  { k: "Window", v: formatRange(project.availabilityFrom, project.availabilityTo) },
                  { k: "Seats", v: String(project.headcount) },
                  { k: "Mode", v: project.remote ? "Remote" : "On-site" },
                ].map((d) => (
                  <div key={d.k}>
                    <dt className="text-[12px] text-ink-faint">{d.k}</dt>
                    <dd className="mt-1 font-medium text-navy-900">{d.v}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <aside data-surface="dark" className="h-fit rounded-card-lg border border-line-dark bg-navy-900 p-7 text-ivory shadow-card-dark lg:sticky lg:top-24">
              <p className="eyebrow text-[10.5px] text-gold/80">{project.paid ? "Stipend" : "Unpaid · certificate"}</p>
              <p className="mt-3 font-serif text-[3rem] leading-none">{project.budget ? formatINR(project.budget) : "—"}</p>
              {fit && (
                <div className="mt-6 rounded-[12px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-mist/60">Your fit</p>
                  <p className="mt-1 font-serif text-[2rem] leading-none text-gold-soft">{fit.score}%</p>
                  <p className="mt-1 text-[12.5px] text-mist/60">
                    {fit.matched.length} of {project.skills.length} skills verified
                  </p>
                </div>
              )}
              <div className="mt-6">
                <ApplyButton projectId={project.id} role={role} applied={fit?.applied ?? false} />
              </div>
              <p className="mt-4 text-center text-[12px] text-mist/50">{project._count.applications} students have applied</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
