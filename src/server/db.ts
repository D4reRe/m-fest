import { env } from "@/env";
import { Prisma, PrismaClient } from "@prisma/client";

const createPrismaClient = () =>
  new PrismaClient({
    // log:
    //   env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    transactionOptions: {
      maxWait: 5000,
      timeout: 20000,
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  });

const globalForPrisma = globalThis as unknown as {
  db: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.db ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.db = db;
