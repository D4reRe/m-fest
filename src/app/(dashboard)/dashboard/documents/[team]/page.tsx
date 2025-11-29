import { Suspense } from "react";
import MemberList from "@/components/dashboard/documents/MemberList";
import { type User } from "@/types/types";
import { getUserProfile } from "@/action/user.action";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import MemberListSkeleton from "@/components/dashboard/documents/MemberListSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const team = (await params).team;
  return {
    title: `${team.split("-").join(" ")} | Documents | Mechanical Festival 2026`,
    description: `Documents to Mechanical Festival 2026`,
  };
}

function TeamDocumentPage({ params }: { params: Promise<{ team: string }> }) {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-fit overflow-hidden rounded-[calc(var(--radius)+.125rem)]  shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border sm:p-8 sm:pb-6 max-xs:flex max-xs:flex-col max-xs:justify-center max-xs:items-center">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-4xl font-semibold text-start">
              Upload Team Members Documents
            </h1>
            <p className="text-lg text-start">
              Please upload all your members legal documents to able to
              participate in competition.
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<MemberListSkeleton />}>
              <FetchTeamMembers params={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

async function FetchTeamMembers({
  params,
}: {
  params: Promise<{ team: string }>;
}) {
  const user = (await getUserProfile()) as User; // This user is the leader of the team
  const { team: teamName } = await params;
  let team = await db.team.findUnique({
    where: { name: teamName.split("-").join(" "), leaderUserId: user.id },
    include: {
      members: {
        include: { user: { include: { documents: true } } },
      },
    },
  });
  if (!team) {
    const teamNameWithDash = teamName.split("-").join("-");
    team = await db.team.findUnique({
      where: { name: teamNameWithDash, leaderUserId: user.id },
      include: {
        members: {
          include: {
            user: {
              include: { documents: true },
            },
          },
        },
      },
    });
    if (!teamNameWithDash) redirect("/dashboard/team");
  }
  if (
    !team?.members.find(
      (member) => member.userId === user.id && member.role === "Leader"
    )
  )
    redirect("/dashboard/team");

  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-6">
        {teamName.split("-").join(" ")}
      </h1>
      <MemberList team={team} />
    </>
  );
}

export default TeamDocumentPage;
