"use server";

import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";

export async function getUserProfile() {
  const session = await auth();

  if (!session) {
    console.warn("⚠️ No valid user session found");
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  return user;
}
