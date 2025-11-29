import { type Metadata } from "next";
import DocumentsForm from "./document-form";
import { Suspense } from "react";
import DocumentFormSkeleton from "@/components/document/DocumentFormSkeleton";

export const metadata: Metadata = {
  title: "Documents | Mechanical Festival 2026",
  description: "Documents to Mechanical Festival 2026",
};

export default function MemberDocumentsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-fit overflow-hidden rounded-[calc(var(--radius)+.125rem)]  shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border sm:p-8 sm:pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-4xl font-semibold text-start">
              Documents & Verification
            </h1>
            <p className="text-lg text-start">
              Please upload all legal documents to able to participate in
              competition.
            </p>

            <p className="text-lg text-start">
              Do not forget to upload all the required files before submitting!
            </p>
          </div>

          <div>
            <Suspense fallback={<DocumentFormSkeleton />}>
              <RenderDocumentsForm params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

async function RenderDocumentsForm({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <DocumentsForm userId={userId} />;
}
