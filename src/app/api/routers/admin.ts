import { db } from "@/server/db";
import { router, adminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminRouter = router({
  getUsers: adminProcedure.query(async () => {
    const users = await db.user.findMany({
      include: {
        documents: true,
        team_member: {
          include: {
            team: true,
          },
        },
        registration: true,
      },
    });
    return users;
  }),
  getTeams: adminProcedure.query(async () => {
    const teams = await db.team.findMany({
      select: {
        id: true,
        name: true,
        competition: true,
        leaderUserId: true,
        leaderName: true,
        leaderEmail: true,
        leaderPhoneNumber: true,
        teamInstitution: true,
        members: {
          include: {
            user: {
              include: {
                documents: true,
              },
            },
          },
        },
        status: true,
        teamStatus: true,
        paymentId: true,
      },
    });
    return teams;
  }),
  getAllTeamMembers: adminProcedure.query(async () => {
    const teamMembers = await db.teamMember.findMany();
    return teamMembers;
  }),
  getRegistrations: adminProcedure.query(async () => {
    const totalRegistration = await db.compRegistration.findMany({
      include: {
        user: true,
        team: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
        payment: true,
      },
    });
    return totalRegistration;
  }),
  getEventsRegistration: adminProcedure.query(async () => {
    const totalEventRegistration = await db.eventRegistration.findMany();
    return totalEventRegistration;
  }),
  getInvoices: adminProcedure.query(async () => {
    const invoices = await db.payment.findMany({
      include: {
        user: true,
        team: true,
        registration: true,
      },
    });
    return invoices;
  }),
  getAllDocuments: adminProcedure.query(async () => {
    const verifications = await db.documents.findMany();
    return verifications;
  }),
  verifyAllDocuments: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          status: "ACCEPTED",
          followIgStatus: "VERIFIED",
          identityCardStatus: "VERIFIED",
          twibbonStatus: "VERIFIED",
          followIgVerified: true,
          identityCardVerified: true,
          twibbonVerified: true,
        },
      });
      await db.user.update({
        where: { id: input.userId },
        data: {
          verified: true,
        },
      });
    }),
  unVerifyAllDocuments: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          status: "PENDING",
          followIgStatus: "AWAITING_UPLOAD",
          identityCardStatus: "AWAITING_UPLOAD",
          twibbonStatus: "AWAITING_UPLOAD",
          followIgVerified: false,
          identityCardVerified: false,
          twibbonVerified: false,
        },
      });
      await db.user.update({
        where: { id: input.userId },
        data: {
          verified: false,
        },
      });
    }),
  verifyDocumentsByMany: adminProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.updateMany({
        where: {
          userId: {
            in: input.userIds,
          },
        },
        data: {
          status: "ACCEPTED",
          followIgStatus: "VERIFIED",
          identityCardStatus: "VERIFIED",
          twibbonStatus: "VERIFIED",
          followIgVerified: true,
          identityCardVerified: true,
          twibbonVerified: true,
        },
      });
      await db.user.updateMany({
        where: {
          id: {
            in: input.userIds,
          },
        },
        data: {
          verified: true,
        },
      });
    }),
  unVerifyDocumentsByMany: adminProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.updateMany({
        where: {
          userId: {
            in: input.userIds,
          },
        },
        data: {
          status: "PENDING",
          followIgStatus: "AWAITING_UPLOAD",
          identityCardStatus: "AWAITING_UPLOAD",
          twibbonStatus: "AWAITING_UPLOAD",
          followIgVerified: false,
          identityCardVerified: false,
          twibbonVerified: false,
        },
      });
      await db.user.updateMany({
        where: {
          id: {
            in: input.userIds,
          },
        },
        data: {
          verified: false,
        },
      });
    }),
  verifyTeam: adminProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.team.update({
        where: { id: input.teamId },
        data: {
          teamStatus: "ACCEPTED",
        },
      });
      await db.compRegistration.update({
        where: { teamId: input.teamId },
        data: {
          teamStatus: "ACCEPTED",
        },
      });
    }),
  unVerifyTeam: adminProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.team.update({
        where: { id: input.teamId },
        data: {
          teamStatus: "PENDING",
        },
      });
      await db.compRegistration.update({
        where: { teamId: input.teamId },
        data: {
          teamStatus: "PENDING",
        },
      });
    }),
  deleteTeam: adminProcedure
    .input(
      z.object({
        teamId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.teamMember.deleteMany({
        where: { teamId: input.teamId },
      });
      await db.team.delete({
        where: { id: input.teamId },
      });
    }),
  verifyTeamsByMany: adminProcedure
    .input(
      z.object({
        teamIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await db.team.updateMany({
        where: {
          id: {
            in: input.teamIds,
          },
        },
        data: {
          teamStatus: "ACCEPTED",
        },
      });
      await db.compRegistration.updateMany({
        where: {
          teamId: {
            in: input.teamIds,
          },
        },
        data: {
          teamStatus: "ACCEPTED",
        },
      });
    }),
  unVerifyTeamsByMany: adminProcedure
    .input(
      z.object({
        teamIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await db.team.updateMany({
        where: {
          id: {
            in: input.teamIds,
          },
        },
        data: {
          teamStatus: "PENDING",
        },
      });
      await db.compRegistration.updateMany({
        where: {
          teamId: {
            in: input.teamIds,
          },
        },
        data: {
          teamStatus: "PENDING",
        },
      });
    }),
  deleteTeamByMany: adminProcedure
    .input(
      z.object({
        teamIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      await db.teamMember.deleteMany({
        where: {
          teamId: {
            in: input.teamIds,
          },
        },
      });
      await db.team.deleteMany({
        where: {
          id: {
            in: input.teamIds,
          },
        },
      });
    }),
});
