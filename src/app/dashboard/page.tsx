import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardIndex() {
  const session = await auth();
  redirect(session?.user.role === "COMPANY" ? "/dashboard/company" : "/dashboard/student");
}
