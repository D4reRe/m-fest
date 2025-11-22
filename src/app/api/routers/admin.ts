import { getUserProfile } from "@/action/user.action";
import { db } from "@/server/db";
import { router, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminRouter = router({
  getUsers: protectedProcedure.query(async () => {
    const users = await db.user.findMany({
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
        members: true,
        status: true,
        paymentId: true,
      },
    });
    return teams;
  }),
  getRegistrations: protectedProcedure.query(async () => {
    const totalRegistration = await db.compRegistration.findMany();
    return totalRegistration;
  }),
  getEventsRegistration: protectedProcedure.query(async () => {
    const totalEventRegistration = await db.eventRegistration.findMany();
    return totalEventRegistration;
  }),
  getInvoices: protectedProcedure.query(async () => {
    const invoices = await db.payment.findMany();
    return invoices;
  }),
});
