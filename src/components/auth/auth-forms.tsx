"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { googleAction, loginAction, signupAction } from "@/app/(auth)/actions";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { Arrow, Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { EASE_QUINT } from "@/lib/motion";
import { loginSchema, signupSchema } from "@/lib/validations";

type Role = "STUDENT" | "COMPANY";

function FormError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden rounded-[10px] border border-[#e8bfb3] bg-[#fbeee9] px-4 py-3 text-[13.5px] text-[#9a3b26]"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function GoogleButton({ role, enabled }: { role: Role; enabled: boolean }) {
  const [pending, start] = useTransition();
  if (!enabled) return null;
  return (
    <>
      <Button type="button" variant="ghost-light" size="lg" className="w-full" disabled={pending} onClick={() => start(() => googleAction(role))}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.5c-.1 1-.8 2.6-2.4 3.7l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.5z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5L1.3 17.3C3.3 21.3 7.3 24 12 24z" />
          <path fill="#FBBC05" d="M5.1 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4L1.3 6.7C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l3.8-2.9z" />
          <path fill="#EA4335" d="M12 4.6c2.2 0 3.8 1 4.6 1.8l3.4-3.3C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.7l3.8 2.9c1-2.9 3.7-5 6.9-5z" />
        </svg>
        Continue with Google
      </Button>
      <div className="my-6 flex items-center gap-4 text-[12px] text-ink-faint">
        <span className="h-px flex-1 bg-line-light" />
        or with email
        <span className="h-px flex-1 bg-line-light" />
      </div>
    </>
  );
}

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const params = useSearchParams();
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((v) =>
    start(async () => {
      setError(undefined);
      const res = await loginAction({ ...v, callbackUrl: params.get("callbackUrl") ?? undefined });
      if (res?.error) setError(res.error);
    }),
  );

  return (
    <Reveal stagger={0.07}>
      <RevealItem as="p" className="eyebrow text-royal">
        Welcome back
      </RevealItem>
      <RevealItem as="h1" className="mt-4 font-serif text-[3rem] font-medium leading-[0.95] tracking-[-0.025em] text-navy-900">
        Log in to <em className="italic text-royal">SARASMER</em>
      </RevealItem>
      <RevealItem as="p" className="mt-3 text-ink-muted">
        Pick up where your skills left off.
      </RevealItem>
      <RevealItem className="mt-10">
        <GoogleButton role="STUDENT" enabled={googleEnabled} />
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@college.edu" invalid={!!errors.email} {...form.register("email")} />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" invalid={!!errors.password} {...form.register("password")} />
          </Field>
          <FormError message={error} />
          <Button type="submit" variant="navy" size="lg" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Log in"} {!pending && <Arrow />}
          </Button>
        </form>
      </RevealItem>
      <RevealItem className="mt-8 rounded-[12px] border border-dashed border-line-light bg-warm-white p-4 text-[13px] text-ink-muted">
        <p className="font-medium text-navy-900">Demo accounts</p>
        <p className="mt-1">
          Student: <code className="font-mono text-[12px]">vaibhav@sarasmer.dev</code> · Company: <code className="font-mono text-[12px]">hiring@northwind.dev</code>
        </p>
        <p className="mt-0.5">
          Password: <code className="font-mono text-[12px]">sarasmer2026</code>
        </p>
      </RevealItem>
      <RevealItem as="p" className="mt-8 text-[14px] text-ink-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-royal underline-offset-4 hover:underline">
          Create an account
        </Link>
      </RevealItem>
    </Reveal>
  );
}

export function SignupForm({ googleEnabled }: { googleEnabled: boolean }) {
  const params = useSearchParams();
  const initialRole: Role = params.get("role")?.toLowerCase() === "company" ? "COMPANY" : "STUDENT";
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();
  const form = useForm<z.input<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: initialRole, name: "", email: "", password: "", companyName: "" },
  });
  const role = form.watch("role");
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((v) =>
    start(async () => {
      setError(undefined);
      const res = await signupAction(v);
      if (res?.fieldErrors) {
        for (const [k, m] of Object.entries(res.fieldErrors)) form.setError(k as keyof typeof v, { message: m });
      }
      if (res?.error) setError(res.error);
    }),
  );

  return (
    <Reveal stagger={0.07}>
      <RevealItem as="p" className="eyebrow text-royal">
        Create your account
      </RevealItem>
      <RevealItem as="h1" className="mt-4 font-serif text-[3rem] font-medium leading-[0.95] tracking-[-0.025em] text-navy-900">
        {role === "STUDENT" ? (
          <>
            Prove what you <em className="italic text-royal">can do.</em>
          </>
        ) : (
          <>
            Find people <em className="italic text-royal">ready to work.</em>
          </>
        )}
      </RevealItem>
      <RevealItem className="mt-8">
        <Segmented
          value={role}
          onChange={(v) => form.setValue("role", v, { shouldValidate: false })}
          options={[
            { value: "STUDENT", label: "I’m a student", hint: "Get verified & matched" },
            { value: "COMPANY", label: "I’m hiring", hint: "Post projects" },
          ]}
        />
      </RevealItem>
      <RevealItem className="mt-8">
        <GoogleButton role={role} enabled={googleEnabled} />
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field label="Full name" htmlFor="name" error={errors.name?.message}>
            <Input id="name" autoComplete="name" placeholder="Vaibhav Sharma" invalid={!!errors.name} {...form.register("name")} />
          </Field>
          <AnimatePresence initial={false}>
            {role === "COMPANY" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: EASE_QUINT }} className="overflow-hidden">
                <Field label="Company" htmlFor="companyName" error={errors.companyName?.message}>
                  <Input id="companyName" autoComplete="organization" placeholder="Northwind Capital" invalid={!!errors.companyName} {...form.register("companyName")} />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
          <Field label={role === "COMPANY" ? "Work email" : "Email"} htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" placeholder={role === "COMPANY" ? "you@company.com" : "you@college.edu"} invalid={!!errors.email} {...form.register("email")} />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message} hint="8+ characters, one number">
            <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" invalid={!!errors.password} {...form.register("password")} />
          </Field>
          <FormError message={error} />
          <Button type="submit" variant="navy" size="lg" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : role === "STUDENT" ? "Create student account" : "Create company account"} {!pending && <Arrow />}
          </Button>
        </form>
      </RevealItem>
      <RevealItem as="p" className="mt-8 text-[14px] text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-royal underline-offset-4 hover:underline">
          Log in
        </Link>
      </RevealItem>
    </Reveal>
  );
}
