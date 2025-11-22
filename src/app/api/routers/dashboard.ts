import { getUserProfile } from "@/action/user.action";
import { db } from "@/server/db";
import { router, protectedProcedure } from "@/server/api/trpc";
import { Document, User } from "@/types/types";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = router({
  getUser: protectedProcedure.query(async () => {
    const user = await getUserProfile();
    return user;
  }),
  getUserDocuments: protectedProcedure
    .output(
      z.object({
        documents: z.array(
          z.object({
            id: z.number(),
            type: z.enum(["identityCard", "twibbon", "followIg"]),
            title: z.string(),
            submissionDetail: z.string(),
            acceptedFiles: z.array(z.string()),
            uploadThingRoute: z.enum(["identityCard", "twibbon", "followIg"]),
            imageUrl: z.string().nullable(),
            imageKey: z.string().nullable(),
            createdAt: z.date().nullable(),
            status: z.string().nullable(),
            verified: z.boolean().nullable(),
          })
        ),
        status: z.string().nullable(),
      })
    ) // @ts-expect-error documents is exist
    .query(async () => {
      const user = await getUserProfile();

      const userDocuments = await db.verification.findUnique({
        where: {
          userId: user?.id,
        },
      });

      if (!userDocuments) {
        const createUserDocuments = await db.verification.create({
          data: {
            userId: user?.id as string,
          },
        });
        console.log(createUserDocuments);
        return createUserDocuments;
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

      return {
        documents,
        status: userDocuments.status,
      };
    }),
  getUserInvoices: protectedProcedure.query(async () => {
    const user = await getUserProfile();
    if (!user) {
      console.log("User not found");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const invoices = await db.payment.findMany({
      where: {
        userId: user?.id,
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
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No invoices found",
      });
    }
    return invoices;
  }),
  getUserRegisteredComp: protectedProcedure
    .input(
      z.object({
        comp: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = (await getUserProfile()) as User;
      const thisRegisteredCompUser = await db.compRegistration.findFirst({
        where: {
          leaderUserId: user.id as string,
          competitionName:
            (input.comp as string) === "BCC"
              ? "BCC"
              : (input.comp as string) === "IPPC"
                ? "IPPC"
                : (input.comp as string) === "PDC"
                  ? "PDC"
                  : undefined,
          statusOrder: "SUCCESS",
        },
      });
      if (!thisRegisteredCompUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not registered for this competition",
        });
      }
      console.log(thisRegisteredCompUser);
      return thisRegisteredCompUser;
    }),
});
