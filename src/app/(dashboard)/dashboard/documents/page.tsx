import { Metadata } from "next";
import { getUserProfile } from "@/action/user.action";
import { User, Verification } from "@prisma/client";
import DocumentsForm from "./document-form";
import { documents } from "@/lib/documents";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Profile | Mechanical Festival 2026",
  description: "Profile to Mechanical Festival 2026",
};

async function DocumentsPage() {
  const user: User = (await getUserProfile()) as User;
  const userDocuments = await prisma.verification.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      pDDiktiImageKey: true,
      followIgImageKey: true,
      IdentityCardImageKey: true,
      twibbonImageKey: true,
      pDDiktiImageUrl: true,
      followIgImageUrl: true,
      IdentityCardImageUrl: true,
      twibbonImageUrl: true,
      IdentityCardCreatedAt: true,
      twibbonCreatedAt: true,
      pDDiktiCreatedAt: true,
      followIgCreatedAt: true,
    },
  });
  return (
    <section className="flex min-h-screen bg-transparent px-4 py-4 md:py-8 dark:bg-transparent">
      <div className="bg-transparent mx-auto h-fit w-full max-w-5xl overflow-hidden rounded-[calc(var(--radius)+.125rem)]  shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border sm:p-8 sm:pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-4xl font-semibold text-start">
              Documents & Verification
            </h1>
            <p className="text-lg text-start">
              Please upload all your legal documents and other required data
              below to able to register competitions.
            </p>
            <p className="text-lg text-start">
              Also make sure all team member (including you) to upload their own
              legal documents and other required data before registering to any
              competitions.
            </p>
          </div>
          <div className="flex flex-col gap-5 mt-5">
            {documents?.map(
              (
                document: {
                  title: string;
                  submissionDetail: string;
                  acceptedFiles: string[];
                  uploadThingRoute: string;
                },
                index: number
              ) => {
                return (
                  <DocumentsForm
                    key={index}
                    user={user as User}
                    title={document.title}
                    documents={userDocuments as Verification}
                    submissionDetail={document.submissionDetail}
                    acceptedFiles={document.acceptedFiles}
                    uploadThingRoute={document.uploadThingRoute}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocumentsPage;
