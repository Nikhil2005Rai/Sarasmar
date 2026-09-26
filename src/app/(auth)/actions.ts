"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { ROLE_COOKIE, signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { loginSchema, signupSchema } from "@/lib/validations";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

const home = (role: "STUDENT" | "COMPANY") => (role === "COMPANY" ? "/dashboard/company" : "/dashboard/student");

/** Only ever redirect to a same-site path (absolute URLs are reduced to their path). */
function safeCallback(url: unknown) {
  if (typeof url !== "string" || !url) return null;
  try {
    const u = new URL(url, "http://local.invalid");
    const path = u.pathname + u.search;
    return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/login") && !path.startsWith("/signup") ? path : null;
  } catch {
    return null;
  }
}

export async function loginAction(input: { email: string; password: string; callbackUrl?: string }): Promise<AuthState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: "Check your email and password." };
  const email = parsed.data.email.toLowerCase();
  const user = await db.user.findUnique({ where: { email }, select: { role: true } });
  const role = user?.role ?? "STUDENT";
  let target = safeCallback(input.callbackUrl);
  // never bounce a user into the other role's workspace
  if (target?.startsWith("/dashboard") && !target.startsWith(home(role))) target = null;
  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: target ?? home(role),
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "That email and password don’t match an account." };
    throw e; // NEXT_REDIRECT
  }
}

export async function signupAction(input: unknown): Promise<AuthState> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[i.path.join(".")] ??= i.message;
    return { error: "A few details need attention.", fieldErrors };
  }
  const { role, name, password, companyName } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const exists = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) return { fieldErrors: { email: "An account with this email already exists" }, error: "Try logging in instead." };

  const passwordHash = await bcrypt.hash(password, 11);
  await db.user.create({
    data: {
      email,
      name,
      role,
      passwordHash,
      ...(role === "COMPANY"
        ? { company: { create: { name: companyName!, industry: "Finance" } } }
        : {
            student: {
              create: {
                availability: {
                  create: { from: new Date(), to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21), status: "AVAILABLE" },
                },
              },
            },
          }),
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: home(role) });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Account created — please log in." };
    throw e;
  }
}

export async function googleAction(role: "STUDENT" | "COMPANY") {
  cookies().set(ROLE_COOKIE, role, { httpOnly: true, sameSite: "lax", maxAge: 600, path: "/" });
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
