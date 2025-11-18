import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  console.log(payload);
  const { comp } = payload;
  const user = (await getUserProfile()) as User;
  const thisRegisteredCompUser = await prisma.compRegistration.findFirst({
    where: {
      leaderUserId: user.id as string,
      competitionName:
        (comp as string) === "BCC"
          ? "BCC"
          : (comp as string) === "IPPC"
            ? "IPPC"
            : (comp as string) === "PDC"
              ? "PDC"
              : undefined,
      statusOrder: "SUCCESS",
    },
  });
  if (!thisRegisteredCompUser) {
    return NextResponse.json(
      { message: "You are not registered for this competition" },
      { status: 400 }
    );
  }
  console.log(thisRegisteredCompUser);

  return NextResponse.json(thisRegisteredCompUser, { status: 200 });
}
