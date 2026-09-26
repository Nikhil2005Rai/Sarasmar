import { Suspense } from "react";
import { googleEnabled } from "@/auth";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
