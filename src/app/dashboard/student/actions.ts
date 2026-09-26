"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matchScore } from "@/lib/matching";
import { availabilitySchema } from "@/lib/validations";

async function currentStudent() {
  const session = await auth();
  if (!session?.user || session.user.role !== "STUDENT") throw new Error("Unauthorized");
  const student = await db.student.findUnique({ where: { userId: session.user.id }, include: { skills: { include: { skill: true } }, availability: true } });
  if (!student) throw new Error("Student profile not found");
  return student;
}

/** Server Action — set availability window and status. */
export async function setAvailability(input: { status: "AVAILABLE" | "UNAVAILABLE"; from: string; to: string }) {
  const parsed = availabilitySchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid dates" };
  const student = await currentStudent();
  const saved = await db.availability.upsert({
    where: { studentId: student.id },
    create: { studentId: student.id, ...parsed.data },
    update: parsed.data,
  });
  revalidatePath("/dashboard/student");
  return { ok: true as const, availability: { status: saved.status, from: saved.from.toISOString(), to: saved.to.toISOString() } };
}

/** Server Action — express interest in a project. */
export async function applyToProject(projectId: string) {
  const student = await currentStudent();
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false as const, error: "This project no longer exists" };
  const score = matchScore(
    project.skills,
    student.skills.map((s) => ({ name: s.skill.name, verified: s.verified, score: s.score })),
    { from: project.availabilityFrom, to: project.availabilityTo },
    student.availability,
  );
  await db.application.upsert({
    where: { studentId_projectId: { studentId: student.id, projectId } },
    create: { studentId: student.id, projectId, matchScore: score, status: "APPLIED" },
    update: {},
  });
  revalidatePath("/dashboard/student");
  revalidatePath(`/opportunities/${projectId}`);
  return { ok: true as const };
}
