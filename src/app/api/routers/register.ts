import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { CompetitionName } from "../../../../prisma/generated/prisma/enums";

export const registerRouter = router({
  registerTeam: protectedProcedure
    .input(
      z.object({
        teamName: z.string(),
        competitionName: z.enum(["BCC", "IPPC", "PDC", "STEM"]),
        userId: z.string(),
        teamId: z.string(),
        paymentId: z.string(),
        paymentFee: z.number(),
        paymentProofUrl: z.url(),
        leaderUserId: z.string(),
        leaderName: z.string(),
        leaderEmail: z.string(),
        leaderPhoneNumber: z.string(),
        teamInstitution: z.string(),
        mentor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.competitionName !== CompetitionName.STEM) {
        const existingRegistration = await ctx.db.compRegistration.findUnique({
          where: {
            teamId: input.teamId,
          },
        });

        if (!existingRegistration) {
          await ctx.db.compRegistration.create({
            data: {
              teamName: input.teamName as string,
              competitionName: input.competitionName as CompetitionName,
              userId: input.userId as string,
              teamId: input.teamId as string,
              paymentId: input.paymentId as string,
              paymentFee: input.paymentFee as number,
              paymentProofUrl: input.paymentProofUrl as string,
              leaderUserId: input.leaderUserId as string,
              leaderName: input.leaderName as string,
              leaderEmail: input.leaderEmail as string,
              leaderPhoneNumber: input.leaderPhoneNumber as string,
              teamInstitution: input.teamInstitution as string,
              statusOrder: "SUCCESS",
              teamStatus: "PENDING",
            },
          });
        }

        await ctx.db.team.update({
          where: {
            id: input.teamId,
          },
          data: {
            paymentId: input.paymentId as string,
            paymentProofUrl: input.paymentProofUrl as string,
            competition: input.competitionName as CompetitionName,
            status: "SUCCESS",
            teamStatus: "PENDING",
            verificationDeadlineAt: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
            ),
          },
        });
      }
      if (input.competitionName === CompetitionName.STEM) {
        const existingRegistration = await ctx.db.compRegistration.findUnique({
          where: {
            teamId: input.teamId,
          },
        });

        if (!existingRegistration) {
          await ctx.db.compRegistration.create({
            data: {
              teamName: input.teamName as string,
              competitionName: input.competitionName as CompetitionName,
              userId: input.userId as string,
              teamId: input.teamId as string,
              paymentId: input.paymentId as string,
              paymentFee: input.paymentFee as number,
              paymentProofUrl: input.paymentProofUrl as string,
              leaderUserId: input.leaderUserId as string,
              leaderName: input.leaderName as string,
              leaderEmail: input.leaderEmail as string,
              leaderPhoneNumber: input.leaderPhoneNumber as string,
              teamInstitution: input.teamInstitution as string,
              mentor: input.mentor as string,
              statusOrder: "SUCCESS",
              teamStatus: "PENDING",
            },
          });
        }
        await ctx.db.team.update({
          where: {
            id: input.teamId,
          },
          data: {
            paymentId: input.paymentId as string,
            paymentProofUrl: input.paymentProofUrl as string,
            competition: input.competitionName as CompetitionName,
            status: "SUCCESS",
            teamStatus: "PENDING",
            verificationDeadlineAt: new Date(
              Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days in milliseconds
            ),
          },
        });
      }
    }),
});
