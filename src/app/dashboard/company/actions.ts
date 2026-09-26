"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { projectSchema, type ProjectInput } from "@/lib/validations";

/** Server Action — create a project from the requirement form. */
export async function createProject(input: ProjectInput) {
  const session = await auth();
  if (!session?.user || session.user.role !== "COMPANY") return { ok: false as const, error: "Only company accounts can post projects." };
  const company = await db.company.findUnique({ where: { userId: session.user.id } });
  if (!company) return { ok: false as const, error: "Company profile not found." };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[i.path.join(".")] ??= i.message;
    return { ok: false as const, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const v = parsed.data;
  const project = await db.project.create({
    data: {
      companyId: company.id,
      title: v.title,
      description: v.description,
      skills: v.skills,
      industry: company.industry ?? v.industry,
      duration: `${v.durationWeeks} ${v.durationWeeks === 1 ? "week" : "weeks"}`,
      durationWeeks: v.durationWeeks,
      availabilityFrom: v.availabilityFrom,
      availabilityTo: v.availabilityTo,
      headcount: v.headcount,
      budget: v.budget && v.budget > 0 ? v.budget : null,
      paid: !!v.budget && v.budget > 0,
    },
  });
  revalidatePath("/dashboard/company");
  revalidatePath("/opportunities");
  return { ok: true as const, id: project.id, title: project.title };
}
