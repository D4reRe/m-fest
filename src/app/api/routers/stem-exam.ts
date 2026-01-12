import { protectedProcedure, router } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { stemExamSubmitSchema } from "@/lib/schema";

export const stemRouter = router({
  getUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          quizResults: true,
          registration: true,
        },
      });
      return user;
    }),
  submitExam: protectedProcedure
    .input(stemExamSubmitSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const newResult = await ctx.db.quizResult.create({
        data: {
          userId: input.userId,
          score: input.score,
          totalQuestions: input.totalQuestions,
          timeSpent: input.timeSpent,
          answers: input.answers,
          type: input.type,
          essayAnswer: input.essayAnswer ?? undefined,
          essayAnswerFileUrl: input.essayAnswerFileUrl ?? undefined,
          essayAnswerFileKey: input.essayAnswerFileKey ?? undefined,
        },
      });
      return newResult;
    }),
});
