"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserProfile() {
  const session = await auth();

  if (!session?.user?.email && !session?.user?.id) {
    console.warn("⚠️ No valid user session found");
    return null;
  }

  const user = await prisma.user.findUnique({
    where: session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! },
    include: {
      team_member: true,
      registration: true,
      eventRegistration: true,
    },
  });

  return user;
}
