import { protectedProcedure, router } from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { QuizTypes } from "../../../../prisma/generated/prisma/enums";

export const stemRouter = router({
  submit: protectedProcedure
    .input(
        z.object({
            userId: z.string(),
            score: z.number(),
            totalQuestions: z.number(),
            timeSpent: z.number(),
            answers: z.array(z.number().nullable()),
            type: z.enum(QuizTypes)
        })
    )
    .mutation(async ({ ctx, input }) => {
        const newResult = await ctx.db.quizResult.create({
            data: {
                userId: input.userId,
                score: input.score,
                totalQuestions: input.totalQuestions,
                timeSpent: input.timeSpent,
                answers: input.answers,
                type: input.type
            }
                });
                return newResult;
            })
        });