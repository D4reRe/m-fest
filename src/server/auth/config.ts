import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { db } from "../db";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { Education, Gender, Role } from "@/types/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      // --- user default data from Auth.js
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // --- user default data from Auth.js
      role: Role;
      emailVerified: Date | null;
      password: string | null;
      imageKey: string | null;
      gender: Gender | null;
      phoneNumber: string | null;
      domicile: string | null;
      institution: string | null;
      major: string | null;
      education: Education | null;
      semester: number | null;
      birthDate: Date | null;
      verified: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [Google, Github, Discord],
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Default Data from Auth.js
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image =
          user.image ??
          "https://api.iconify.design/healthicons/ui-user-profile-outline.svg?color=%23fff";
      }

      const userData = await db.user.findUnique({
        where: { id: token.id as string },
      });

      if (!userData) return token;

      return {
        ...token,
        ...userData,
      };
    },
    session: async ({ session, token }) => {
      // Default Data from Auth.js
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.image as string;

      // Data from DB
      session.user.role = token.role as Role;
      session.user.emailVerified = token.emailVerified as Date | null;
      session.user.password = token.password as string;
      session.user.imageKey = token.imageKey as string;
      session.user.gender = token.gender as Gender;
      session.user.phoneNumber = token.phoneNumber as string;
      session.user.domicile = token.domicile as string;
      session.user.institution = token.institution as string;
      session.user.major = token.major as string;
      session.user.education = (token.education as Education) || null;
      session.user.semester = token.semester as number;
      session.user.birthDate = token.birthDate as Date | null;
      session.user.verified = token.verified as boolean;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: env.AUTH_SECRET,
} satisfies NextAuthConfig;
