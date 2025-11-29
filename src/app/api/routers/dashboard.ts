import { getUserProfile } from "@/action/user.action";
import { router, protectedProcedure } from "@/server/api/trpc";
import { type Document, type User } from "@/types/types";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { documentsSchema, profileSchema, submitFileSchema } from "@/lib/schema";

export const dashboardRouter = router({
  getUser: protectedProcedure.query(async () => {
    const user = await getUserProfile();
    return user;
  }),
  getUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });
      return user;
    }),
  getDocumentsByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
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
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
      });

      const userDocuments = await ctx.db.documents.findUnique({
        where: {
          userId: user?.id,
        },
      });

      if (!userDocuments) {
        const createUserDocuments = await ctx.db.documents.create({
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
    .query(async ({ ctx }) => {
      const user = await getUserProfile();

      const userDocuments = await ctx.db.documents.findUnique({
        where: {
          userId: user?.id,
        },
      });

      if (!userDocuments) {
        const createUserDocuments = await ctx.db.documents.create({
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
  getUserInvoices: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserProfile();
    if (!user) {
      console.log("User not found");
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    const invoices = await ctx.db.payment.findMany({
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
    .query(async ({ input, ctx }) => {
      const user = (await getUserProfile()) as User;
      const thisRegisteredCompUser = await ctx.db.compRegistration.findFirst({
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
  updateProfile: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id as string },
        data: {
          ...input,
        },
      });
    }),
  submitCompetitionFile: protectedProcedure
    .input(submitFileSchema)
    .mutation(async ({ input, ctx }) => {
      const thisRegisteredCompUser = await ctx.db.compRegistration.findFirst({
        where: {
          leaderUserId: input.leaderUserId as string,
          competitionName:
            (input.competitionName as string) === "BCC"
              ? "BCC"
              : (input.competitionName as string) === "IPPC"
                ? "IPPC"
                : (input.competitionName as string) === "PDC"
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

      await ctx.db.compRegistration.update({
        where: {
          teamId: thisRegisteredCompUser?.teamId as string,
        },
        data: {
          submissionFileUrl: input.fileUrl,
          submissionFileUploaded: true,
          submissionFileCreatedAt: new Date(),
          submissionFileSubmitted: true,
        },
      });
    }),
  submitDocuments: protectedProcedure
    .input(documentsSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const userId = input.userId;
      const requestedUser = await ctx.db.user.findUnique({
        where: { id: userId },
      });
      if (!requestedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const [userVerification, userDocuments] = await Promise.all([
        ctx.db.documents.findUnique({
          where: { userId },
          select: { status: true },
        }),
        ctx.db.documents.findUnique({
          where: {
            userId,
          },
        }),
      ]);
      if (!userVerification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User documents not found",
        });
      }
      if (!userDocuments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User documents not found",
        });
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

      console.log("Documents: ", documents);
      console.log("User documents: ", userVerification);
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
              await ctx.db.documents.update({
                where: { userId },
                data: {
                  status: "ACCEPTED",
                },
              });
              return { message: "Your documents have been verified" };
            }
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Your ${documentsNotVerified?.length} documents (${documentsNotVerified
                ?.map((document) => document.title)
                .join(", ")}) is waiting to be verified`,
            });
          }
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Your documents are being verified, please wait",
          });
        }

        if (isDocumentsStillPendingExist) {
          const documentsStillPending = documents?.filter(
            (document) => document.status === "AWAITING_UPLOAD"
          );
          console.log("Documents still pending: ", documentsStillPending);
          documentsStillPending?.map(async (document) => {
            if (document.status === "AWAITING_UPLOAD") {
              await ctx.db.documents.update({
                where: { userId },
                data: {
                  [`${document.type}Status`]: "PENDING",
                },
              });
            }
          });
          return {
            message: `Your pending ${documentsStillPending?.length} documents (${documentsStillPending
              ?.map((document) => document.title)
              .join(", ")}) have been submitted`,
          };
        }
      }

      if (userVerification?.status === "ACCEPTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Your documents have been verified, you can register for competitions",
        });
      }

      // If user verifaction status is NOT_SUBMITTED run the rest of the code

      await ctx.db.documents.update({
        where: {
          userId,
        },
        data: {
          identityCardStatus: "PENDING",
          twibbonStatus: "PENDING",
          followIgStatus: "PENDING",
          status: "PENDING",
        },
      });

      return { message: "Your documents have been submitted" };
    }),
});
