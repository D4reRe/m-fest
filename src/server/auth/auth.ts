import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";
import { env } from "@/env";
const options = {
  appName: "Mechanical Festival 2026",
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
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
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
      //   strategy: "compact"  // compact is the default stratergy in better-auth
    },
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
