import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteFiles } from "@/action/uploadthing.action";

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
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth();
      // This code runs on your server before upload

      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

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
      // console.log("Upload complete for user:", {
      //   userId: metadata.userId,
      //   name: metadata.name,
      //   email: metadata.email,
      //   imageUrl: metadata.imageUrl,
      // });
      // console.log("file url", {
      //   ufsUrl: file.ufsUrl,
      //   fileKey: file.key,
      // });
      try {
        const previousImage = await prisma.user.findUnique({
          where: { email: metadata.email as string },
          select: { imageKey: true },
        });
        if (previousImage?.imageKey) {
          await deleteFiles(previousImage.imageKey);
        }
        await prisma.user.update({
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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
