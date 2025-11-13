import { Metadata } from "next";
import { getUserProfile } from "@/action/user.action";
import DocumentsForm from "./document-form";
import { documents } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Verification } from "@/types/types";
import { Suspense } from "react";
import DocumentFormSkeleton from "@/components/document/DocumentFormSkeleton";

export const metadata: Metadata = {
  title: "Documents | Mechanical Festival 2026",
  description: "Documents to Mechanical Festival 2026",
};

export default function DocumentsPage() {
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
            <p className="text-lg text-start">
              Do not forget to upload all the required files before submitting!
            </p>
          </div>

          <div>
            <Suspense fallback={<DocumentFormSkeleton />}>
              <FetchUserDocuments />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

async function FetchUserDocuments() {
  const user: User = (await getUserProfile()) as User;
  if (
    !user.gender ||
    !user.phoneNumber ||
    !user.domicile ||
    !user.birthDate ||
    !user.major ||
    !user.institution ||
    !user.education ||
    !user.major ||
    !user.semester
  ) {
    redirect("/dashboard/profile?notif=incomplete_profile");
  }
  const userDocuments = await prisma.verification.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <DocumentsForm
      user={user as User}
      userDocuments={userDocuments as Verification}
      documents={documents}
    />
  );
}
