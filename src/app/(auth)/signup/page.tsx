import { Suspense } from "react";
import { googleEnabled } from "@/auth";
import { SignupForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
