import * as z from "zod";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { deleteFiles } from "@/action/uploadthing.action";
import { headers } from "next/headers";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  updateProfilePicture: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      // This code runs on your server before upload

      // If you throw, the user will not be able to upload
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        imageUrl: session.user.image,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
        imageUrl: metadata.imageUrl,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const previousImage = await db.user.findUnique({
          where: { email: metadata.email as string },
          select: { imageKey: true },
        });
        if (previousImage?.imageKey) {
          await deleteFiles(previousImage.imageKey);
        }
        await db.user.update({
          where: { email: metadata.email as string },
          data: { image: file.ufsUrl, imageKey: file.key },
        });

        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    }),

  identityCard: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        targetUserId: z.string(),
      })
    )
    .middleware(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = await db.user.findUnique({
        where: { id: input.targetUserId },
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      if (!user) {
        console.log("User not found");
        throw new UploadThingError("User not found");
      }
      return {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        leaderUserId: session.user.id,
        leaderName: session.user.name,
        leaderEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const previousImage = await db.documents.findUnique({
          where: { userId: metadata.userId },
          select: { identityCardImageKey: true },
        });
        if (previousImage?.identityCardImageKey) {
          await deleteFiles(previousImage.identityCardImageKey);
        }
        await db.documents.update({
          where: { userId: metadata.userId as string },
          data: {
            identityCardImageUrl: file.ufsUrl,
            identityCardImageKey: file.key,
            identityCardCreatedAt: new Date(),
          },
        });

        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  twibbon: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        targetUserId: z.string(),
      })
    )
    .middleware(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = await db.user.findUnique({
        where: { id: input.targetUserId },
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      if (!user) {
        console.log("User not found");
        throw new UploadThingError("User not found");
      }
      return {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        leaderUserId: session.user.id,
        leaderName: session.user.name,
        leaderEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const previousImage = await db.documents.findUnique({
          where: { userId: metadata.userId },
          select: { twibbonImageKey: true },
        });
        if (previousImage?.twibbonImageKey) {
          await deleteFiles(previousImage.twibbonImageKey);
        }
        await db.documents.update({
          where: { userId: metadata.userId as string },
          data: {
            twibbonImageUrl: file.ufsUrl,
            twibbonImageKey: file.key,
            twibbonCreatedAt: new Date(),
          },
        });

        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  followIg: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        targetUserId: z.string(),
      })
    )
    .middleware(async ({ input }) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      const user = await db.user.findUnique({
        where: { id: input.targetUserId },
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      if (!user) {
        console.log("User not found");
        throw new UploadThingError("User not found");
      }
      return {
        userId: user?.id,
        name: user?.name,
        email: user?.email,
        leaderUserId: session.user.id,
        leaderName: session.user.name,
        leaderEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const previousImage = await db.documents.findUnique({
          where: { userId: metadata.userId },
          select: { followIgImageKey: true },
        });
        if (previousImage?.followIgImageKey) {
          await deleteFiles(previousImage.followIgImageKey);
        }
        await db.documents.update({
          where: { userId: metadata.userId as string },
          data: {
            followIgImageUrl: file.ufsUrl,
            followIgImageKey: file.key,
            followIgCreatedAt: new Date(),
          },
        });

        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  submitFileBCC: f({
    "application/zip": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/pdf": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const comp = "BCC";
        const thisRegisteredCompUser = await db.compRegistration.findFirst({
          where: {
            leaderUserId: metadata.userId,
            competitionName: comp,
            statusOrder: "SUCCESS",
          },
        });

        console.log(thisRegisteredCompUser);

        const previousFile = await db.compRegistration.findFirst({
          where: {
            leaderUserId: thisRegisteredCompUser?.leaderUserId as string,
            competitionName: comp,
          },
          select: { submissionFileKey: true },
        });
        if (previousFile?.submissionFileKey) {
          await deleteFiles(previousFile?.submissionFileKey);
        }

        await db.compRegistration.update({
          where: {
            teamId: thisRegisteredCompUser?.teamId as string,
          },
          data: {
            submissionFileUrl: file.ufsUrl,
            submissionFileKey: file.key,
            submissionFileCreatedAt: new Date(),
            submissionFileUploaded: true,
          },
        });

        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  submitFileIPPC: f({
    "application/zip": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/pdf": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const comp = "IPPC";
        const thisRegisteredCompUser = await db.compRegistration.findFirst({
          where: {
            leaderUserId: metadata.userId,
            competitionName: comp,
            statusOrder: "SUCCESS",
          },
        });

        console.log(thisRegisteredCompUser);

        const previousFile = await db.compRegistration.findFirst({
          where: {
            leaderUserId: thisRegisteredCompUser?.leaderUserId as string,
            competitionName: comp,
          },
          select: { submissionFileKey: true },
        });
        if (previousFile?.submissionFileKey) {
          await deleteFiles(previousFile?.submissionFileKey);
        }

        await db.compRegistration.update({
          where: {
            teamId: thisRegisteredCompUser?.teamId as string,
          },
          data: {
            submissionFileUrl: file.ufsUrl,
            submissionFileKey: file.key,
            submissionFileCreatedAt: new Date(),
            submissionFileUploaded: true,
          },
        });
        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  submitFilePDC: f({
    "application/zip": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    "application/pdf": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        const comp = "PDC";
        const thisRegisteredCompUser = await db.compRegistration.findFirst({
          where: {
            leaderUserId: metadata.userId,
            competitionName: comp,
            statusOrder: "SUCCESS",
          },
        });

        console.log(thisRegisteredCompUser);

        const previousFile = await db.compRegistration.findFirst({
          where: {
            leaderUserId: thisRegisteredCompUser?.leaderUserId as string,
            competitionName: comp,
          },
          select: { submissionFileKey: true },
        });
        if (previousFile?.submissionFileKey) {
          await deleteFiles(previousFile?.submissionFileKey);
        }

        await db.compRegistration.update({
          where: {
            teamId: thisRegisteredCompUser?.teamId as string,
          },
          data: {
            submissionFileUrl: file.ufsUrl,
            submissionFileKey: file.key,
            submissionFileCreatedAt: new Date(),
            submissionFileUploaded: true,
          },
        });
        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
  submitExam: f({
    "application/pdf": {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) {
        console.log("Unauthorized user tried to upload");
        throw new UploadThingError("Unauthorized");
      }
      return {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", {
        userId: metadata.userId,
        name: metadata.name,
        email: metadata.email,
      });
      console.log("file url", {
        ufsUrl: file.ufsUrl,
        fileKey: file.key,
      });
      try {
        return { fileUrl: file.ufsUrl, uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
