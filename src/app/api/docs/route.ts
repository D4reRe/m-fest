import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { Document, User } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET() {
  const user: User = (await getUserProfile()) as User;

  const userDocuments = await prisma.verification.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (!userDocuments) {
    const createUserDocuments = await prisma.verification.create({
      data: {
        userId: user?.id,
      },
    });
    return NextResponse.json(createUserDocuments, { status: 200 });
  }

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
  ];

  return NextResponse.json(
    { documents, status: userDocuments.status },
    { status: 200 }
  );
}
