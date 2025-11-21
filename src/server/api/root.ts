import { router } from "./trpc";
import { adminRouter } from "../../app/api/routers/admin";

export const appRouter = router({
  admin: adminRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
