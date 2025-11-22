/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth/auth";
import { db } from "../db";
import { adminRoles } from "@/constants/constants";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth();

  return {
    session,
    db,
    ...opts,
  };
}
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      message: "Unauthorized to access this resource",
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user || !adminRoles.includes(ctx.session.user.role)) {
    throw new TRPCError({
      message:
        "Unauthorized to access this resource, only admin can access this resource",
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const superAdminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== "SUPERADMIN") {
    throw new TRPCError({
      message:
        "Unauthorized to access this resource, only SUPERADMIN access this resource",
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
