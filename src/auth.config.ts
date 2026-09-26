import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config — shared by middleware (no DB, no bcrypt).
 * Providers that need Node APIs are added in src/auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/login", newUser: "/dashboard" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const role = auth?.user?.role;
      const path = nextUrl.pathname;
      const home = role === "COMPANY" ? "/dashboard/company" : "/dashboard/student";

      if (path.startsWith("/dashboard")) {
        if (!auth?.user) return false; // → /login?callbackUrl=…
        if (path === "/dashboard") return Response.redirect(new URL(home, nextUrl));
        if (path.startsWith("/dashboard/company") && role !== "COMPANY") return Response.redirect(new URL(home, nextUrl));
        if (path.startsWith("/dashboard/student") && role !== "STUDENT") return Response.redirect(new URL(home, nextUrl));
        return true;
      }
      if ((path === "/login" || path === "/signup") && auth?.user) {
        return Response.redirect(new URL(home, nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string | undefined) ?? "";
        session.user.role = (token.role as "STUDENT" | "COMPANY" | undefined) ?? "STUDENT";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
