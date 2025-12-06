import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { env as envConfig } from "./src/env";

// in development, use Supabase's direct URL, in staging (vercel) use DATABASE_URL (Neon Postgres)

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      envConfig.NODE_ENV === "development"
        ? env("DIRECT_URL")
        : env("DATABASE_URL"),
  },
});
