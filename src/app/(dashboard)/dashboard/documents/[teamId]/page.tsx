import { Suspense } from "react";
import MemberList from "@/components/dashboard/documents/MemberList";
import { type User } from "@/types/types";
import { getUser } from "@/action/user.action";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import MemberListSkeleton from "@/components/dashboard/documents/MemberListSkeleton";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, Calendar } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string }>;
}): Promise<Metadata> {
  const teamId = (await params).teamId;
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { name: true },
  });
  return {
    title: `${team?.name} | Documents | Mechanical Festival 2026`,
    description: `Documents to Mechanical Festival 2026`,
  };
}

function TeamDocumentPage({ params }: { params: Promise<{ teamId: string }> }) {
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
              participate in competition before deadline date.
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
  params: Promise<{ teamId: string }>;
}) {
  const user = (await getUser()) as User; // This user is the leader of the team
  const { teamId } = await params;
  const team = await db.team.findUnique({
    where: { id: teamId, leaderUserId: user.id },
    include: {
      members: {
        include: { user: { include: { documents: true } } },
      },
    },
  });
  if (!team) {
    redirect("/dashboard/team");
  }
  if (
    !team?.members.find(
      (member) => member.userId === user.id && member.role === "Leader"
    )
  )
    redirect("/dashboard/team");

  const isDeadlinePassed = team.verificationDeadlineAt
    ? new Date(team.verificationDeadlineAt).getTime() < new Date().getTime()
    : false;
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground text-center sm:text-start">
        {team.name}
      </h1>
      {!isDeadlinePassed && team.teamStatus === "PENDING" && (
        <>
          <Badge
            variant={"secondary"}
            className="mt-1 mb-6 text-xs text-red-500 sm:text-lg px-4 hidden sm:block"
          >
            {team.verificationDeadlineAt ? (
              <span className="flex items-center gap-2">
                <Calendar className="hidden sm:block" />
                {`Verification Deadline: ${new Date(
                  team.verificationDeadlineAt
                ).toLocaleString()}`}
              </span>
            ) : (
              "Verification Deadline: TBD"
            )}
          </Badge>
          <div className="flex flex-col items-center justify-center justify-self-center text-center text-sm rounded-full px-4 py-1 bg-muted text-red-500 sm:hidden mt-1 mb-6">
            {team.verificationDeadlineAt ? (
              <span className="flex items-center gap-2">
                <Calendar className="hidden sm:block" />
                {`Due: ${new Date(
                  team.verificationDeadlineAt
                ).toLocaleString()}`}
              </span>
            ) : (
              "Verification Deadline: TBD"
            )}
          </div>
        </>
      )}
      {isDeadlinePassed && team.teamStatus === "PENDING" && (
        <>
          <Badge
            variant={"secondary"}
            className="mt-1 mb-6 text-xs text-red-500 sm:text-lg px-4 hidden sm:block"
          >
            {team.verificationDeadlineAt ? (
              <span className="flex items-center gap-2">
                <Calendar className="hidden sm:block" />
                {`Deadline Passed: ${new Date(
                  team.verificationDeadlineAt
                ).toLocaleString()}`}
              </span>
            ) : (
              "Verification Deadline: TBD"
            )}
          </Badge>
          <div className="flex flex-col items-center justify-center justify-self-center text-center text-sm rounded-full px-4 py-1 text-red-500 sm:hidden bg-muted mt-1 mb-6 w-full max-w-xs ">
            {team.verificationDeadlineAt ? (
              <span className="flex items-center gap-2">
                <Calendar className="hidden sm:block" />
                {`Due is passed: ${new Date(
                  team.verificationDeadlineAt
                ).toLocaleString()}`}
              </span>
            ) : (
              "Verification Deadline: TBD"
            )}
          </div>
        </>
      )}
      {team.teamStatus === "ACCEPTED" && (
        <Badge
          variant={"secondary"}
          className="mt-1 mb-6 text-xs text-green-500 sm:text-lg px-4 hidden sm:block"
        >
          <span className="flex items-center gap-2">
            <BadgeCheckIcon />
            Verified
          </span>
        </Badge>
      )}
      <MemberList team={team} />
    </>
  );
}

export default TeamDocumentPage;
