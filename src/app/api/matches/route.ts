import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { rankStudents } from "@/lib/queries";

export const dynamic = "force-dynamic";

const query = z.object({
  skills: z.string().transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
  from: z.coerce.date(),
  to: z.coerce.date(),
});

/** GET /api/matches?skills=Excel,Power%20BI&from=2026-10-12&to=2026-10-28 — ranked students for a requirement. */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "COMPANY") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = query.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  const { skills, from, to } = parsed.data;
  if (skills.length === 0) return NextResponse.json({ students: [] });
  const students = await rankStudents(skills, { from, to }, 8);
  return NextResponse.json({ students });
}
