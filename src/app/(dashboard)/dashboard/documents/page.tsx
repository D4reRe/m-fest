import TeamList from "@/components/dashboard/documents/TeamList";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | Mechanical Festival 2026",
  description: "Documents to Mechanical Festival 2026",
};

export default function DocumentsPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-fit overflow-hidden rounded-[calc(var(--radius)+.125rem)]  shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border sm:p-8 sm:pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-4xl font-semibold text-start">
              Documents & Verification
            </h1>
            <p className="text-lg text-start">
              Please upload all your members legal documents as leader of the
              team and other required data below to able to participate in
              competitions .
            </p>
            <p className="text-lg text-start">
              Also make sure the leader is the one to upload all team member
              legal documents (including leader)
            </p>
            <p className="text-lg text-start">
              Do not forget to upload all the required files before submitting
              for each member!
            </p>
          </div>
          <div className="mt-10">
            <h1 className="text-3xl font-bold text-foreground">Your Teams</h1>
            <TeamList />
          </div>
        </div>
      </div>
    </section>
  );
}
