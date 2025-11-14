import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  console.log(payload);
  const { userId } = payload;
  const requestedUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  const isSubmitted = await prisma.verification.findUnique({
    where: { userId },
    select: { status: true },
  });

  if (isSubmitted?.status === "PENDING") {
    // TODO : Check every awaited to upload document and accepted/verified document from user
    return NextResponse.json(
      { message: "Your documents are being verified" },
      { status: 400 }
    );
  }

  if (isSubmitted?.status === "ACCEPTED") {
    return NextResponse.json(
      {
        message:
          "Your documents have been verified, you can register for competitions",
      },
      { status: 400 }
    );
  }

  await prisma.verification.update({
    where: {
      userId: requestedUser?.id as string,
    },
    data: {
      IdentityCardStatus: "UPLOADED",
      twibbonStatus: "UPLOADED",
      followIgStatus: "UPLOADED",
      pDDiktiStatus: "UPLOADED",
      status: "PENDING",
    },
  });

  return NextResponse.json(
    { message: "Your documents have been submitted" },
    { status: 200 }
  );
}
