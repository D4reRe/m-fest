import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  const { fileUrl, userId, leaderUserId, comp } = payload;

  const thisRegisteredCompUser = await prisma.compRegistration.findFirst({
    where: {
      leaderUserId: leaderUserId as string,
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

  await prisma.compRegistration.update({
    where: {
      teamId: thisRegisteredCompUser?.teamId as string,
    },
    data: {
      submissionFileUrl: fileUrl,
      submissionFileUploaded: true,
      submissionFileCreatedAt: new Date(),
      submissionFileSubmitted: true,
    },
  });

  return NextResponse.json(
    { message: "File submitted successfully!" },
    { status: 200 }
  );
}
