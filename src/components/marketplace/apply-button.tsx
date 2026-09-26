"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { applyToProject } from "@/app/dashboard/student/actions";
import { Arrow, Button } from "@/components/ui/button";

export function ApplyButton({ projectId, role, applied }: { projectId: string; role: "STUDENT" | "COMPANY" | null; applied: boolean }) {
  const [done, setDone] = useState(applied);
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  if (!role)
    return (
      <Button asChild variant="gold" size="lg" className="w-full">
        <Link href={`/signup?role=student`}>
          Sign up to apply <Arrow />
        </Link>
      </Button>
    );
  if (role === "COMPANY")
    return (
      <Button asChild variant="ghost-dark" size="lg" className="w-full">
        <Link href="/dashboard/company">Back to your dashboard</Link>
      </Button>
    );
  return (
    <>
      <Button
        variant={done ? "ghost-dark" : "gold"}
        size="lg"
        className="w-full"
        disabled={done || pending}
        onClick={() =>
          start(async () => {
            const r = await applyToProject(projectId);
            if (r.ok) setDone(true);
            else setError(r.error);
          })
        }
      >
        {done ? "Application sent ✓" : pending ? "Sending…" : "Apply with verified profile"} {!done && !pending && <Arrow />}
      </Button>
      {error && <p className="mt-2 text-[13px] text-peach">{error}</p>}
    </>
  );
}
