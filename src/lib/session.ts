import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function getNavUser() {
  try {
    const session = await auth();
    if (!session?.user) return null;
    return { name: session.user.name ?? "", role: session.user.role };
  } catch {
    return null;
  }
}

export async function requireRole(role: "STUDENT" | "COMPANY") {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== role) redirect(session.user.role === "COMPANY" ? "/dashboard/company" : "/dashboard/student");
  return session.user;
}
