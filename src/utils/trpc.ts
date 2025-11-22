"use client";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/api/root";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
