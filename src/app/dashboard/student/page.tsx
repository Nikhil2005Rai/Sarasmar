import Link from "next/link";
import { AvailabilityWidget } from "@/components/dashboard/availability-widget";
import { Greeting } from "@/components/dashboard/greeting";
import { ProjectMatchCard } from "@/components/dashboard/project-match-card";
import { SkillList } from "@/components/dashboard/skill-list";
import { ProgressRing } from "@/components/motion/count-up";
import { Arrow } from "@/components/ui/button";
import { getStudentDashboard } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { cn, formatRange } from "@/lib/utils";

export const metadata = { title: "Student dashboard" };
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  APPLIED: "bg-royal/10 text-royal",
  SHORTLISTED: "bg-gold/15 text-[#8a5d12]",
  MATCHED: "bg-lavender/15 text-[#5b4a9b]",
  ACCEPTED: "bg-verified/10 text-verified",
  DECLINED: "bg-line-light text-ink-muted",
};

export default async function StudentDashboard() {
  const user = await requireRole("STUDENT");
  const data = await getStudentDashboard(user.id);
  if (!data) return <p className="text-ink-muted">We couldn’t find your student profile.</p>;
  const { student, completeness, recommended, applications } = data;
  const verified = student.skills.filter((s) => s.verified).length;
  const availability = student.availability
    ? { status: student.availability.status, from: student.availability.from.toISOString(), to: student.availability.to.toISOString() }
    : { status: "UNAVAILABLE" as const, from: new Date().toISOString(), to: new Date(Date.now() + 14 * 864e5).toISOString() };

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* ── header + availability ─────────────────────────────── */}
      <div className="grid grid-cols-1 items-end gap-8 xl:grid-cols-[1fr_400px]">
        <div className="pb-2">
          <p className="eyebrow mb-5 text-royal">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
          <Greeting name={student.user.name} />
          <p className="mt-4 max-w-lg text-[16px] text-ink-muted">
            {recommended.length > 0 ? (
              <>
                <span className="font-medium text-navy-900">{recommended.length} projects</span> match your verified skills
                {student.availability?.status === "AVAILABLE" ? " inside your availability window." : ". Turn availability on to appear in company matches."}
              </>
            ) : (
              "Verify a skill to start receiving matched projects."
            )}
          </p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line-light pt-6">
            {[
              { k: "Verified skills", v: `${verified}/${student.skills.length}` },
              { k: "Applications", v: applications.length },
              { k: "Best match", v: recommended[0] ? `${recommended[0].score}%` : "—" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[12px] text-ink-faint">{s.k}</dt>
                <dd className="mt-1 font-serif text-[2rem] leading-none text-navy-900">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <AvailabilityWidget initial={availability} />
      </div>

      {/* ── profile + skills ──────────────────────────────────── */}
      <div id="skills" className="mt-10 grid scroll-mt-24 grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="card-light flex flex-col p-6 lg:col-span-4">
          <p className="eyebrow text-[10.5px] text-ink-faint">Profile strength</p>
          <div className="mt-6 flex items-center gap-6">
            <ProgressRing value={completeness.score} size={124} stroke={7} label="Complete" />
            <div className="min-w-0">
              <p className="font-medium text-navy-900">{student.program}</p>
              <p className="text-[13.5px] text-ink-muted">{student.education}</p>
              <p className="mt-1 text-[12.5px] text-ink-faint">{student.location}</p>
            </div>
          </div>
          {completeness.missing.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-line-light pt-5">
              {completeness.missing.map((m) => (
                <li key={m} className="flex items-center gap-3 text-[13.5px] text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card-light p-6 lg:col-span-8">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="eyebrow text-[10.5px] text-ink-faint">Skills</p>
              <h2 className="mt-2 font-serif text-[1.8rem] leading-none text-navy-900">Verified by SARASMER</h2>
            </div>
            <span className="text-[13px] text-ink-faint">
              {verified} of {student.skills.length}
            </span>
          </div>
          <div className="mt-4">
            <SkillList
              skills={student.skills.map((s) => ({
                id: s.id,
                name: s.skill.name,
                category: s.skill.category,
                verified: s.verified,
                score: s.score,
                verifiedAt: s.verifiedAt?.toISOString() ?? null,
              }))}
            />
          </div>
        </section>
      </div>

      {/* ── projects ──────────────────────────────────────────── */}
      <section id="projects" className="mt-14 scroll-mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-[10.5px] text-ink-faint">Available projects</p>
            <h2 className="mt-2 font-serif text-[2.2rem] leading-none text-navy-900">Matched to you</h2>
          </div>
          <Link href="/opportunities" className="group hidden items-center gap-2 text-[14px] font-medium text-royal sm:inline-flex">
            All opportunities <Arrow />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((r) => (
            <ProjectMatchCard key={r.o.id} o={r.o} score={r.score} matched={r.matched} applied={r.applied} />
          ))}
        </div>
      </section>

      {/* ── applications ─────────────────────────────────────── */}
      <section className="mt-14">
        <p className="eyebrow text-[10.5px] text-ink-faint">Your applications</p>
        <div className="card-light mt-4 overflow-hidden">
          {applications.length === 0 ? (
            <p className="p-8 text-center text-ink-muted">No applications yet — apply to a matched project above.</p>
          ) : (
            <ul className="divide-y divide-line-light">
              {applications.map((a) => (
                <li key={a.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <Link href={`/opportunities/${a.project.id}`} className="font-medium text-navy-900 hover:text-royal">
                      {a.project.title}
                    </Link>
                    <p className="text-[12.5px] text-ink-faint">
                      {a.project.company} · {formatRange(a.project.from, a.project.to)}
                    </p>
                  </div>
                  <span className="font-mono text-[13px] text-navy-900">{a.score}% match</span>
                  <span className={cn("w-fit rounded-[6px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]", STATUS_STYLE[a.status])}>
                    {a.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
