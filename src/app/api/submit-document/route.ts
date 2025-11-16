import { prisma } from "@/lib/prisma";
import { Document } from "@/types/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  const { userId } = payload;
  const requestedUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!requestedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const [userVerification, userDocuments] = await Promise.all([
    prisma.verification.findUnique({
      where: { userId },
      select: { status: true },
    }),
    prisma.verification.findUnique({
      where: {
        userId,
      },
    }),
  ]);

  const documents: Document[] = [
    {
      id: 0,
      type: "identityCard",
      title: "Identity Card",
      submissionDetail:
        "Every participant must upload identity card scan file either KTM/KTP/KK/SIM or Student Card",
      acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
      uploadThingRoute: "identityCard",
      imageUrl: userDocuments?.identityCardImageUrl ?? null,
      imageKey: userDocuments?.identityCardImageKey ?? null,
      createdAt: userDocuments?.identityCardCreatedAt ?? null,
      status: userDocuments?.identityCardStatus ?? null,
      verified: userDocuments?.identityCardVerified ?? null,
    },
    {
      id: 1,
      type: "twibbon",
      title: "Twibbon",
      submissionDetail: ` Twibbon is uploaded to the Instagram account of each team participant in the form of an Instagram post by tagging the official M-FEST 2026 account @mfestitb. Instagram accounts must not be in private mode. Participants may not delete Instagram posts until the competition series is finished. Captions on Instagram posts follow the template format. 
        `,
      acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
      uploadThingRoute: "twibbon",
      imageUrl: userDocuments?.twibbonImageUrl ?? null,
      imageKey: userDocuments?.twibbonImageKey ?? null,
      createdAt: userDocuments?.twibbonCreatedAt ?? null,
      status: userDocuments?.twibbonStatus ?? null,
      verified: userDocuments?.twibbonVerified ?? null,
    },
    {
      id: 2,
      type: "followIg",
      title: "Follow Ig",
      submissionDetail:
        "Participants are required to have an Instagram account and must follow social media @mfestitb and upload proof on the registration form provided.",
      acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
      uploadThingRoute: "followIg",
      imageUrl: userDocuments?.followIgImageUrl ?? null,
      imageKey: userDocuments?.followIgImageKey ?? null,
      createdAt: userDocuments?.followIgCreatedAt ?? null,
      status: userDocuments?.followIgStatus ?? null,
      verified: userDocuments?.followIgVerified ?? null,
    },
    {
      id: 3,
      type: "pDDikti",
      title: "PDDikti",
      submissionDetail:
        "Participants are required to take a screenshot of their data as an active college student in PDDikti and upload it on the registration form provided for IPPC, BCC, and PDC competitions.",
      acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
      uploadThingRoute: "pDDikti",
      imageUrl: userDocuments?.pDDiktiImageUrl ?? null,
      imageKey: userDocuments?.pDDiktiImageKey ?? null,
      createdAt: userDocuments?.pDDiktiCreatedAt ?? null,

      status: userDocuments?.pDDiktiStatus ?? null,
      verified: userDocuments?.pDDiktiVerified ?? null,
    },
  ];

  console.log("Documents: ", documents);
  console.log("User verification: ", userVerification);

  if (userVerification?.status === "PENDING") {
    // AWAITING_UPLOAD means user has not submitted any pending documents
    // PENDING means user has submitted documents but not verified yet
    const documentsStatus = documents?.map((document) => document.status);
    const isDocumentsStillPendingExist =
      documentsStatus.includes("AWAITING_UPLOAD");
    console.log(
      "Is all documents still pending: ",
      isDocumentsStillPendingExist
    );
    if (!isDocumentsStillPendingExist) {
      if (documentsStatus.includes("VERIFIED")) {
        const documentsNotVerified = documents?.filter(
          (document) => document.status === "PENDING"
        );
        if (!documentsNotVerified.length) {
          await prisma.verification.update({
            where: { userId },
            data: {
              status: "ACCEPTED",
            },
          });
          return NextResponse.json(
            { message: "Your documents have been verified" },
            { status: 200 }
          );
        }
        return NextResponse.json(
          {
            message: `Your ${documentsNotVerified?.length} documents (${documentsNotVerified
              ?.map((document) => document.title)
              .join(", ")}) is waiting to be verified`,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: "Your documents are being verified, please wait" },
        { status: 400 }
      );
    }

    if (isDocumentsStillPendingExist) {
      const documentsStillPending = documents?.filter(
        (document) => document.status === "AWAITING_UPLOAD"
      );
      console.log("Documents still pending: ", documentsStillPending);
      documentsStillPending?.map(async (document) => {
        if (document.status === "AWAITING_UPLOAD") {
          await prisma.verification.update({
            where: { userId },
            data: {
              [`${document.type}Status`]: "PENDING",
            },
          });
        }
      });
      return NextResponse.json(
        {
          message: `Your pending ${documentsStillPending?.length} documents (${documentsStillPending
            ?.map((document) => document.title)
            .join(", ")}) have been submitted`,
        },
        { status: 200 }
      );
    }
  }

  if (userVerification?.status === "ACCEPTED") {
    return NextResponse.json(
      {
        message:
          "Your documents have been verified, you can register for competitions",
      },
      { status: 400 }
    );
  }

  // If user verifaction status is NOT_SUBMITTED run the rest of the code

  await prisma.verification.update({
    where: {
      userId: requestedUser?.id as string,
    },
    data: {
      identityCardStatus: "PENDING",
      twibbonStatus: "PENDING",
      followIgStatus: "PENDING",
      pDDiktiStatus: "PENDING",
      status: "PENDING",
    },
  });

  return NextResponse.json(
    { message: "Your documents have been submitted" },
    { status: 200 }
  );
}
