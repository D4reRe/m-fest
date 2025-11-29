import { betterAuth, type BetterAuthOptions } from "better-auth";
import { customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { env } from "@/env";
const options = {
  appName: "Mechanical Festival 2026",
  // Prisma integration
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  // Replaces providers: [Google, Github]
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:3000",
    "https://m-fest-xi.vercel.app",
    "https://mfest2026-jg5xl.ondigitalocean.app",
  ],
  plugins: [
    //...plugins
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const userData = await db.user.findUnique({
        where: { id: user.id },
      });
      return {
        user: {
          ...userData,
        },
        session,
      };
    }, options),
  ],
});
