import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "@neondatabase/serverless";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    providers: [
      Resend({ from: "Test <onboarding@resend.dev>" }),
      Google,
      Github,
      Credentials({
        name: "Credentials",
        credentials: {
          fullname: { label: "Fullname", type: "text" },
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const user = await prisma.users.findUnique({
            where: {
              email: credentials?.email as string,
            },
          });
          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials?.password as string,
            user.password as string
          );
          if (!isValid) return null;

          return { id: user.id, name: user.name, email: user.email };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
});

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Google, Github],
//   adapter: SupabaseAdapter({
//     url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   }),
//   callbacks: {
//     async session({ session, user }) {
//       const signingSecret = process.env.SUPABASE_JWT_SECRET;
//       if (signingSecret) {
//         const payload = {
//           aud: "authenticated",
//           exp: Math.floor(new Date(session.expires).getTime() / 1000),
//           sub: user.id,
//           email: user.email,
//           role: "authenticated",
//         };
//         session.supabaseAccessToken = jwt.sign(payload, signingSecret);
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
