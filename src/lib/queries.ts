import "server-only";
import { db } from "@/lib/db";
import { matchScore, matchedSkills, skillFit, type MatchStudentSkill } from "@/lib/matching";
import type { OpportunityView } from "@/lib/types";

type ProjectWithCompany = Awaited<ReturnType<typeof db.project.findFirstOrThrow<{ include: { company: true } }>>>;

export function toOpportunityView(p: ProjectWithCompany): OpportunityView {
  return {
    id: p.id,
    title: p.title,
    company: p.company.name,
    industry: p.industry,
    description: p.description,
    skills: p.skills,
    duration: p.duration,
    durationWeeks: p.durationWeeks,
    paid: p.paid,
    remote: p.remote,
    budget: p.budget,
    headcount: p.headcount,
    from: p.availabilityFrom.toISOString(),
    to: p.availabilityTo.toISOString(),
  };
}

export function profileCompleteness(s: {
  education: string | null;
  program: string | null;
  bio: string | null;
  location: string | null;
  image: string | null;
  skills: { verified: boolean }[];
  availability: unknown | null;
}) {
  const verifiedRatio = s.skills.length ? s.skills.filter((k) => k.verified).length / s.skills.length : 0;
  const parts: [boolean | number, number][] = [
    [!!s.education, 15],
    [!!s.program, 10],
    [!!s.bio, 10],
    [!!s.location, 5],
    [!!s.image, 10],
    [s.skills.length >= 3, 10],
    [verifiedRatio, 25],
    [!!s.availability, 15],
  ];
  const score = parts.reduce((acc, [v, w]) => acc + (typeof v === "number" ? v * w : v ? w : 0), 0);
  const missing = [
    !s.image && "Add a profile photo",
    verifiedRatio < 1 && "Verify your remaining skills",
    !s.bio && "Write a short bio",
  ].filter(Boolean) as string[];
  return { score: Math.round(score), missing };
}

export async function getStudentDashboard(userId: string) {
  const student = await db.student.findUnique({
    where: { userId },
    include: {
      user: true,
      skills: { include: { skill: true }, orderBy: [{ verified: "desc" }, { score: "desc" }] },
      availability: true,
      projects: { include: { project: { include: { company: true } } }, orderBy: { matchScore: "desc" } },
    },
  });
  if (!student) return null;

  const mySkills: MatchStudentSkill[] = student.skills.map((s) => ({ name: s.skill.name, verified: s.verified, score: s.score }));
  const projects = await db.project.findMany({ include: { company: true }, orderBy: { createdAt: "desc" }, take: 60 });
  const appliedIds = new Set(student.projects.map((a) => a.projectId));
  const recommended = projects
    .map((p) => ({
      o: toOpportunityView(p),
      score: matchScore(p.skills, mySkills, { from: p.availabilityFrom, to: p.availabilityTo }, student.availability),
      matched: matchedSkills(p.skills, mySkills),
      applied: appliedIds.has(p.id),
    }))
    .filter((r) => r.matched.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    student,
    completeness: profileCompleteness({ ...student, image: student.user.image, skills: student.skills }),
    recommended,
    applications: student.projects.map((a) => ({ id: a.id, status: a.status, score: a.matchScore, project: toOpportunityView(a.project) })),
  };
}

export async function rankStudents(required: string[], window: { from: Date; to: Date }, limit = 8) {
  const students = await db.student.findMany({
    include: { user: { select: { name: true } }, skills: { include: { skill: true } }, availability: true },
  });
  return students
    .map((s) => {
      const skills = s.skills.map((k) => ({ name: k.skill.name, verified: k.verified, score: k.score }));
      return {
        id: s.id,
        name: s.user.name,
        program: s.program ?? "Student",
        education: s.education ?? "",
        location: s.location ?? "",
        fit: skillFit(required, skills),
        score: matchScore(required, skills, window, s.availability),
        verified: matchedSkills(required, skills),
        availability: s.availability && s.availability.status === "AVAILABLE" ? { from: s.availability.from.toISOString(), to: s.availability.to.toISOString() } : null,
      };
    })
    .filter((s) => s.fit > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ fit: _fit, ...rest }) => rest);
}

export type RankedStudent = Awaited<ReturnType<typeof rankStudents>>[number];
