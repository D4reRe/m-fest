import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { prisma } from "./lib/prisma";
// import Credentials from "next-auth/providers/credentials";
// import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Education } from "./types/next-auth";

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password";
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Github,
    Discord,
    // Credentials({
    //   type: "credentials",
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const credentialDetails = {
    //       email: credentials.email,
    //       password: credentials.password,
    //     };
    //     if (!credentialDetails?.email || !credentialDetails?.password)
    //       throw new InvalidLoginError();

    //     // Find user from sign-up instead of auth.js
    //     const user = await prisma.user.findUnique({
    //       where: { email: credentialDetails.email as string },
    //     });

    //     if (!user) throw new InvalidLoginError();

    //     // Verify password
    //     const isValid = await compare(
    //       credentialDetails.password as string,
    //       user.password as string
    //     );
    //     if (!isValid) throw new InvalidLoginError();

    //     // Return a user object compatible with Auth.js
    //     return {
    //       id: user.id.toString(),
    //       name: user.name,
    //       email: user.email,
    //     };
    //   },
    // }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth-error",
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

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string, email: token.email as string },
      });
      if (dbUser) {
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.image = dbUser.image;
        token.phoneNumber = dbUser.phoneNumber;
        token.domicile = dbUser.domicile;
        token.institution = dbUser.institution;
        token.major = dbUser.major;
        token.education = dbUser.education;
        token.semester = dbUser.semester;
        token.birthDate = dbUser.birthDate;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.domicile = token.domicile as string;
        session.user.institution = token.institution as string;
        session.user.major = token.major as string;
        session.user.education = token.education as Education;
        session.user.semester = token.semester as number;
        session.user.birthDate = token.birthDate as Date;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
});
