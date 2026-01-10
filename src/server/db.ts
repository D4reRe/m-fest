import { env } from "@/env";
import { Prisma, PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
});
const createPrismaClient = () =>
    new PrismaClient({
        adapter,
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

if (env.NODE_ENV === "development") globalForPrisma.db = db;
