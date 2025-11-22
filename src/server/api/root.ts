import { router } from "./trpc";
import { adminRouter } from "../../app/api/routers/admin";
import { dashboardRouter } from "@/app/api/routers/dashboard";

export const appRouter = router({
  admin: adminRouter,
  dashboard: dashboardRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
