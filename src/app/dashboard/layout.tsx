import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/shell";
import { db } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const company = session.user.role === "COMPANY" ? await db.company.findUnique({ where: { userId: session.user.id }, select: { name: true } }) : null;
  return (
    <DashboardShell role={session.user.role} user={{ name: session.user.name ?? "", email: session.user.email ?? "" }} org={company?.name}>
      {children}
    </DashboardShell>
  );
}
