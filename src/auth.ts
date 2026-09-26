import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
export const ROLE_COOKIE = "sarasmer_role";

class InvalidLogin extends CredentialsSignin {
  code = "invalid_credentials";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) throw new InvalidLogin();
        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user?.passwordHash) throw new InvalidLogin();
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) throw new InvalidLogin();
        return { id: user.id, email: user.email, name: user.name, image: user.image, role: user.role };
      },
    }),
    ...(googleEnabled ? [Google({ allowDangerousEmailAccountLinking: true })] : []),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /** OAuth: find-or-create the SARASMER user, honouring the role picked on /signup. */
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;
      const email = user.email.toLowerCase();
      let existing = await db.user.findUnique({ where: { email } });
      if (!existing) {
        const jar = cookies();
        const role = jar.get(ROLE_COOKIE)?.value === "COMPANY" ? "COMPANY" : "STUDENT";
        existing = await db.user.create({
          data: {
            email,
            name: user.name ?? email.split("@")[0],
            image: user.image,
            role,
            ...(role === "COMPANY"
              ? { company: { create: { name: `${user.name ?? "New"}’s company` } } }
              : { student: { create: {} } }),
          },
        });
      }
      user.id = existing.id;
      user.role = existing.role;
      return true;
    },
  },
});
