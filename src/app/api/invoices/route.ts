import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET() {
  const user = (await getUserProfile()) as User;
  if (!user) {
    console.log("User not found");
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const invoices = await prisma.payment.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      team: true,
      registration: true,
      user: true,
    },
  });
  if (!invoices) {
    return NextResponse.json({ message: "No invoices found" }, { status: 404 });
  }

  return NextResponse.json(invoices, { status: 200 });
}
