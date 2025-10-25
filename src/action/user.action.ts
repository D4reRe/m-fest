"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserProfile() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email as string,
      id: session?.user.id as string,
    },
  });

  return user;
}
