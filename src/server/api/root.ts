import { createCallerFactory, router } from "./trpc";
import { adminRouter } from "../../app/api/routers/admin";
import { dashboardRouter } from "@/app/api/routers/dashboard";
import { stemRouter } from "@/app/api/routers/stem-exam";
import { registerRouter } from "@/app/api/routers/register";

export const appRouter = router({
  admin: adminRouter,
  dashboard: dashboardRouter,
  stemExam: stemRouter,
  register: registerRouter,
});

export const createCaller = createCallerFactory(appRouter);

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
