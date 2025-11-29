"use server";

import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";

export async function getUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.warn("⚠️ No valid user session found");
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session?.user.id as string },
  });

  return user;
}
