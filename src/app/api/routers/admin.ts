import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminRouter = router({
  getUser: protectedProcedure.query(async () => {
    const user = await getUserProfile();
    return user;
  }),
  getUsers: protectedProcedure.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        gender: true,
        email: true,
        institution: true,
        semester: true,
        image: true,
        birthDate: true,
        domicile: true,
        education: true,
        major: true,
        role: true,
        verified: true,
      },
    });
    return users;
  }),
  getTeams: protectedProcedure.query(async () => {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        competition: true,
        leaderUserId: true,
        leaderName: true,
        leaderEmail: true,
        leaderPhoneNumber: true,
        teamInstitution: true,
        members: true,
        status: true,
        paymentId: true,
      },
    });
    return teams;
  }),
  getRegistrations: protectedProcedure.query(async () => {
    const totalRegistration = await prisma.compRegistration.findMany();
    return totalRegistration;
  }),
  getEventsRegistration: protectedProcedure.query(async () => {
    const totalEventRegistration = await prisma.eventRegistration.findMany();
    return totalEventRegistration;
  }),

  approveTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(({ input }) => {
      // call prisma or your existing REST API logic
      return { success: true };
    }),
});
