import { db } from "@/server/db";
import { router, adminProcedure, superAdminProcedure } from "@/server/api/trpc";
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
  getUserById: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
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
      return user;
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
  approveUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.user.update({
        where: { id: input.userId },
        data: {
          verified: true,
        },
      });
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          status: "ACCEPTED",
        },
      });
    }),
  rejectUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.user.update({
        where: { id: input.userId },
        data: {
          verified: false,
        },
      });
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          status: "PENDING",
        },
      });
    }),
  approveAllDocuments: adminProcedure
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
  rejectAllDocuments: adminProcedure
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
  approveDocumentByType: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum(["identityCard", "twibbon", "followIg"]),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          [`${input.type}Status`]: "VERIFIED",
          [`${input.type}Verified`]: true,
        },
      });
    }),
  rejectDocumentByType: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum(["identityCard", "twibbon", "followIg"]),
      })
    )
    .mutation(async ({ input }) => {
      await db.documents.update({
        where: { userId: input.userId },
        data: {
          [`${input.type}Status`]: "AWAITING_UPLOAD",
          [`${input.type}Verified`]: false,
          status: "PENDING",
        },
      });
    }),
  approveDocumentsByMany: adminProcedure
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
  rejectDocumentsByMany: adminProcedure
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

  approveTeam: adminProcedure
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
  rejectTeam: adminProcedure
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
  approveTeamsByMany: adminProcedure
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
  rejectTeamsByMany: adminProcedure
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
  updateUserRole: superAdminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.id === input.userId) {
        throw new Error("You cannot update your own role");
      }
      await db.user.update({
        where: { id: input.userId },
        data: {
          role: input.role,
        },
      });
    }),
});
