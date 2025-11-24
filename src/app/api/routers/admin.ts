import { db } from "@/server/db";
import { router, adminProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const adminRouter = router({
  getUsers: adminProcedure.query(async () => {
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
        members: true,
        status: true,
        paymentId: true,
      },
    });
    return teams;
  }),
  getRegistrations: adminProcedure.query(async () => {
    const totalRegistration = await db.compRegistration.findMany();
    return totalRegistration;
  }),
  getEventsRegistration: adminProcedure.query(async () => {
    const totalEventRegistration = await db.eventRegistration.findMany();
    return totalEventRegistration;
  }),
  getInvoices: adminProcedure.query(async () => {
    const invoices = await db.payment.findMany();
    return invoices;
  }),
  getAllVerification: adminProcedure.query(async () => {
    const verifications = await db.verification.findMany();
    return verifications;
  }),
});
