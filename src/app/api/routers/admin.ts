import { db } from "@/server/db";
import { router, adminProcedure, superAdminProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { deleteFiles } from "@/action/uploadthing.action";
import { TRPCError } from "@trpc/server";

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
    getAccounts: adminProcedure.query(async () => {
        const accounts = await db.account.findMany({
            include: {
                user: true,
            },
        });
        return accounts;
    }),
    getSessions: adminProcedure.query(async () => {
        const sessions = await db.session.findMany({
            include: {
                user: true,
            },
        });
        return sessions;
    }),
    getUserById: adminProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
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
                createdAt: true,
                verificationDeadlineAt: true,
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
            }),
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
            }),
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
            }),
        )
        .mutation(async ({ input }) => {
            const document = await db.documents.findFirst({
                where: { userId: input.userId },
                select: {
                    status: true,
                },
            });
            if (document?.status === "NOT_SUBMITTED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "You cannot approve documents that are not submitted",
                });
            }
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
            }),
        )
        .mutation(async ({ input }) => {
            const document = await db.documents.findFirst({
                where: { userId: input.userId },
                select: {
                    status: true,
                },
            });
            if (document?.status === "NOT_SUBMITTED") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "You cannot reject documents that are not submitted",
                });
            }
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
            const imageKeys = await db.documents.findUnique({
                where: {
                    userId: input.userId,
                },
                select: {
                    identityCardImageKey: true,
                    twibbonImageKey: true,
                    followIgImageKey: true,
                },
            });
            const values = imageKeys
                ? Object.values(imageKeys).filter(
                      (value): value is string => value !== null,
                  )
                : [];
            await deleteFiles(values);
            await db.documents.update({
                where: { userId: input.userId },
                data: {
                    identityCardImageKey: null,
                    twibbonImageKey: null,
                    followIgImageKey: null,
                    identityCardImageUrl: null,
                    twibbonImageUrl: null,
                    followIgImageUrl: null,
                },
            });
        }),
    approveDocumentByType: adminProcedure
        .input(
            z.object({
                userId: z.string(),
                type: z.enum(["identityCard", "twibbon", "followIg"]),
            }),
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
            }),
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
            const imageKey = await db.documents.findUnique({
                where: {
                    userId: input.userId,
                },
                select: {
                    [`${input.type}ImageKey`]: true,
                },
            });
            const values: string[] = imageKey
                ? Object.values(imageKey).filter((value) => value !== null)
                : [];
            await deleteFiles(values);
            await db.documents.update({
                where: { userId: input.userId },
                data: {
                    [`${input.type}ImageUrl`]: null,
                    [`${input.type}ImageKey`]: null,
                },
            });
        }),
    approveDocumentsByMany: adminProcedure
        .input(
            z.object({
                userIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            const documents = await db.documents.findMany({
                where: { userId: { in: input.userIds } },
                select: {
                    status: true,
                },
            });
            if (
                documents.some(
                    (document) => document.status === "NOT_SUBMITTED",
                )
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "You cannot approve documents that are not submitted",
                });
            }
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
                identityCardImageKeys: z.array(z.string().nullable()),
                twibbonImageKeys: z.array(z.string().nullable()),
                followIgImageKeys: z.array(z.string().nullable()),
            }),
        )
        .mutation(async ({ input }) => {
            await deleteFiles(input.identityCardImageKeys);
            await deleteFiles(input.twibbonImageKeys);
            await deleteFiles(input.followIgImageKeys);
            const documents = await db.documents.findMany({
                where: { userId: { in: input.userIds } },
                select: {
                    status: true,
                },
            });
            if (
                documents.some(
                    (document) => document.status === "NOT_SUBMITTED",
                )
            ) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "You cannot reject documents that are not submitted",
                });
            }
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
                    identityCardImageUrl: null,
                    twibbonImageUrl: null,
                    followIgImageUrl: null,
                    identityCardImageKey: null,
                    twibbonImageKey: null,
                    followIgImageKey: null,
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
            // const selectedImageKeys = await db.documents.findMany({
            //     where: {
            //         userId: {
            //             in: input.userIds,
            //         },
            //     },
            //     select: {
            //         identityCardImageKey: true,
            //         twibbonImageKey: true,
            //         followIgImageKey: true,
            //     },
            // });

            // const arrayValues: string[] = [];
            // selectedImageKeys.map((imageKeys) => {
            //     const values = Object.values(imageKeys).filter(
            //         (value): value is string => value !== null,
            //     );
            //     values.map((value) => {
            //         arrayValues.push(value);
            //     });
            // });
            // console.log(arrayValues);
            // await deleteFiles(arrayValues);
        }),
    approveTeam: adminProcedure
        .input(
            z.object({
                teamId: z.string(),
            }),
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
            }),
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
                paymentId: z.string().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.teamMember.deleteMany({
                where: { teamId: input.teamId },
            });
            await db.team.delete({
                where: { id: input.teamId },
            });
            const isTeamRegistered = await db.compRegistration.findFirst({
                where: { teamId: input.teamId },
                select: {
                    id: true,
                },
            });
            if (isTeamRegistered) {
                await db.compRegistration.delete({
                    where: { teamId: input.teamId },
                });
            }
            if (input.paymentId) {
                await db.payment.delete({
                    where: { orderId: input.paymentId },
                });
            }
        }),
    approveTeamsByMany: adminProcedure
        .input(
            z.object({
                teamIds: z.array(z.string()),
            }),
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
            }),
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
                paymentIds: z.array(z.string().nullable()),
            }),
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
            await db.compRegistration.deleteMany({
                where: {
                    teamId: {
                        in: input.teamIds,
                    },
                },
            });
            // Only delete payments that are not null
            const validPaymentIds = input.paymentIds.filter(
                (paymentId) => paymentId !== null,
            );
            await db.payment.deleteMany({
                where: {
                    orderId: {
                        in: validPaymentIds,
                    },
                },
            });
        }),
    updateUserRole: superAdminProcedure
        .input(
            z.object({
                userId: z.string(),
                role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
            }),
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
    deleteCompRegistration: adminProcedure
        .input(
            z.object({
                compRegistrationId: z.string(),
                teamId: z.string(),
                paymentId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.compRegistration.delete({
                where: { id: input.compRegistrationId },
            });
            await db.team.update({
                where: { id: input.teamId },
                data: {
                    paymentId: null,
                    competition: null,
                    teamStatus: "NOT_REGISTERED",
                    status: "PENDING",
                },
            });
            await db.payment.delete({
                where: { orderId: input.paymentId },
            });
        }),
    deleteCompRegistrationByMany: adminProcedure
        .input(
            z.object({
                compRegistrationIds: z.array(z.string()),
                teamIds: z.array(z.string()),
                paymentIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            await db.compRegistration.deleteMany({
                where: {
                    id: {
                        in: input.compRegistrationIds,
                    },
                },
            });
            await db.team.updateMany({
                where: {
                    id: {
                        in: input.teamIds,
                    },
                },
                data: {
                    paymentId: null,
                    competition: null,
                    teamStatus: "NOT_REGISTERED",
                    status: "PENDING",
                },
            });
            await db.payment.deleteMany({
                where: {
                    orderId: {
                        in: input.paymentIds,
                    },
                },
            });
        }),
    deleteUser: adminProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            if (input.userId === ctx.session.user.id) {
                throw new Error("You cannot delete yourself");
            }
            await db.user.delete({
                where: { id: input.userId },
            });
            await db.account.deleteMany({
                where: { userId: input.userId },
            });
            await db.session.deleteMany({
                where: { userId: input.userId },
            });
        }),
    deleteUsersByMany: adminProcedure
        .input(
            z.object({
                userIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            if (input.userIds.includes(ctx.session.user.id as string)) {
                throw new Error("You cannot delete yourself");
            }
            await db.user.deleteMany({
                where: {
                    id: {
                        in: input.userIds,
                    },
                },
            });
            await db.account.deleteMany({
                where: {
                    userId: {
                        in: input.userIds,
                    },
                },
            });
            await db.session.deleteMany({
                where: {
                    userId: {
                        in: input.userIds,
                    },
                },
            });
        }),
    resetUserDocuments: adminProcedure
        .input(
            z.object({
                userId: z.string(),
                identityCardImageKey: z.string().nullable(),
                twibbonImageKey: z.string().nullable(),
                followIgImageKey: z.string().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            await deleteFiles(input.identityCardImageKey);
            await deleteFiles(input.twibbonImageKey);
            await deleteFiles(input.followIgImageKey);
            await db.documents.update({
                where: { userId: input.userId },
                data: {
                    identityCardImageUrl: null,
                    twibbonImageUrl: null,
                    followIgImageUrl: null,
                    identityCardImageKey: null,
                    twibbonImageKey: null,
                    followIgImageKey: null,
                    identityCardCreatedAt: null,
                    twibbonCreatedAt: null,
                    followIgCreatedAt: null,
                    identityCardStatus: "AWAITING_UPLOAD",
                    twibbonStatus: "AWAITING_UPLOAD",
                    followIgStatus: "AWAITING_UPLOAD",
                    twibbonVerified: false,
                    identityCardVerified: false,
                    followIgVerified: false,
                    status: "NOT_SUBMITTED",
                },
            });
            await db.user.update({
                where: { id: input.userId },
                data: {
                    verified: false,
                },
            });
        }),
    resetDocumentsByMany: adminProcedure
        .input(
            z.object({
                userIds: z.array(z.string()),
                identityCardImageKeys: z.array(z.string().nullable()),
                twibbonImageKeys: z.array(z.string().nullable()),
                followIgImageKeys: z.array(z.string().nullable()),
            }),
        )
        .mutation(async ({ input }) => {
            await deleteFiles(input.identityCardImageKeys);
            await deleteFiles(input.twibbonImageKeys);
            await deleteFiles(input.followIgImageKeys);
            await db.documents.updateMany({
                where: { userId: { in: input.userIds } },
                data: {
                    identityCardImageUrl: null,
                    twibbonImageUrl: null,
                    followIgImageUrl: null,
                    identityCardImageKey: null,
                    twibbonImageKey: null,
                    followIgImageKey: null,
                    identityCardCreatedAt: null,
                    twibbonCreatedAt: null,
                    followIgCreatedAt: null,
                    identityCardStatus: "AWAITING_UPLOAD",
                    twibbonStatus: "AWAITING_UPLOAD",
                    followIgStatus: "AWAITING_UPLOAD",
                    twibbonVerified: false,
                    identityCardVerified: false,
                    followIgVerified: false,
                    status: "NOT_SUBMITTED",
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
    deleteUserDocuments: adminProcedure
        .input(
            z.object({
                userId: z.string(),
                identityCardImageKey: z.string().nullable(),
                twibbonImageKey: z.string().nullable(),
                followIgImageKey: z.string().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            await deleteFiles(input.identityCardImageKey);
            await deleteFiles(input.twibbonImageKey);
            await deleteFiles(input.followIgImageKey);
            await db.documents.delete({
                where: { userId: input.userId },
            });
            await db.user.update({
                where: { id: input.userId },
                data: {
                    verified: false,
                },
            });
        }),
    deleteDocumentsByMany: adminProcedure
        .input(
            z.object({
                userIds: z.array(z.string()),
                identityCardImageKeys: z.array(z.string().nullable()),
                twibbonImageKeys: z.array(z.string().nullable()),
                followIgImageKeys: z.array(z.string().nullable()),
            }),
        )
        .mutation(async ({ input }) => {
            await deleteFiles(input.identityCardImageKeys);
            await deleteFiles(input.twibbonImageKeys);
            await deleteFiles(input.followIgImageKeys);
            await db.documents.deleteMany({
                where: {
                    userId: {
                        in: input.userIds,
                    },
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
    deleteInvoice: adminProcedure
        .input(
            z.object({
                invoiceId: z.string(),
                orderId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.compRegistration.delete({
                where: { paymentId: input.orderId },
            });
            const isAnyTeamRegistered = await db.team.findFirst({
                where: { paymentId: input.orderId },
                select: {
                    id: true,
                },
            });
            if (isAnyTeamRegistered) {
                await db.team.update({
                    where: { paymentId: input.orderId },
                    data: {
                        paymentId: null,
                        competition: null,
                        teamStatus: "NOT_REGISTERED",
                        status: "PENDING",
                    },
                });
            }
            await db.payment.delete({
                where: { id: input.invoiceId },
            });
        }),
    deleteInvoicesByMany: adminProcedure
        .input(
            z.object({
                invoiceIds: z.array(z.string()),
                orderIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            await db.compRegistration.deleteMany({
                where: {
                    paymentId: {
                        in: input.orderIds,
                    },
                },
            });
            await db.team.updateMany({
                where: {
                    paymentId: {
                        in: input.orderIds,
                    },
                },
                data: {
                    paymentId: null,
                    competition: null,
                    teamStatus: "NOT_REGISTERED",
                    status: "PENDING",
                },
            });
            await db.payment.deleteMany({
                where: {
                    id: {
                        in: input.invoiceIds,
                    },
                },
            });
        }),
    deleteSession: adminProcedure
        .input(
            z.object({
                sessionId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.session.delete({
                where: { id: input.sessionId },
            });
        }),
    deleteSessionsByMany: adminProcedure
        .input(
            z.object({
                sessionIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            await db.session.deleteMany({
                where: {
                    id: {
                        in: input.sessionIds,
                    },
                },
            });
        }),
    deleteAccount: adminProcedure
        .input(
            z.object({
                accountId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            await db.account.deleteMany({
                where: { id: input.accountId },
            });
        }),
    deleteAccountsByMany: adminProcedure
        .input(
            z.object({
                accountIds: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            await db.account.deleteMany({
                where: {
                    id: {
                        in: input.accountIds,
                    },
                },
            });
        }),
});
