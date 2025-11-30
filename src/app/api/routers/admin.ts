import { db } from "@/server/db";
import { router, adminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminRouter = router({
  getUsers: adminProcedure.query(async () => {
    const users = await db.user.findMany({
      include: {
        documents: true,
        team_member: true,
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
});
