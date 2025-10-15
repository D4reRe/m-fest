import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Google,
    Github,
    Credentials({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const credentialDetails = {
          email: credentials.email,
          password: credentials.password,
        };
        if (!credentialDetails?.email || !credentialDetails?.password)
          throw new InvalidLoginError();

        // Find user from sign-up instead of auth.js
        const user = await prisma.customUser.findUnique({
          where: { email: credentialDetails.email as string },
        });

        if (!user) throw new InvalidLoginError();

        // Verify password
        const isValid = await compare(
          credentialDetails.password as string,
          user.password
        );
        if (!isValid) throw new InvalidLoginError();

        // Return a user object compatible with Auth.js
        return {
          id: user.id.toString(),
          name: user.fullName,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image =
          user.image ??
          "https://api.iconify.design/healthicons/ui-user-profile-outline.svg?color=%23fff";
      }
      console.log("JWT callback:", { token, user });
      return token;
    },
    session: async ({ session, token, user }) => {
      if (token) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
