import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Google,
    Github,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user from sign-up instead of auth.js
        const user = await prisma.customUser.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // Verify password
        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        // Return a user object compatible with Auth.js
        return {
          id: user.id.toString(),
          name: user.fullName,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
