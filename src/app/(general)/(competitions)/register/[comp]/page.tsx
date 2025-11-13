import RegisterForm from "./register-form";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { Team, User, CompRegistration, TeamMember } from "@/types/types";
import { competitionsName } from "@/constants/constants";
import { Suspense } from "react";
import { CompRegisterFormSkeleton } from "@/components/register/CompFormSkeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  const comp = (await params).comp;
  return {
    title: `Register ${comp.toUpperCase()} | Mechanical Festival 2026`,
    description: `Register for ${comp.toUpperCase()} Competition`,
  };
}

export default function CompPage({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-xl verflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <Suspense fallback={<CompRegisterFormSkeleton />}>
          <FetchCompForm params={params} />
        </Suspense>
      </div>
    </section>
  );
}

async function FetchCompForm({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  const user = (await getUserProfile()) as User;
  const { comp } = await params;
  if (comp) {
    if (!competitionsName.includes(comp.toUpperCase())) {
      redirect("/competitions");
    }
  }
  if (
    !user?.institution ||
    !user?.major ||
    !user?.education ||
    !user?.semester ||
    !user?.phoneNumber ||
    !user?.domicile ||
    !user?.birthDate ||
    !user?.gender
  ) {
    redirect("/dashboard/profile?notif=incomplete_profile");
  }
  const [
    teams,
    teamMembers,
    registeredCompetitions,
    allRegisteredTeamDatas,
    allTeamsDatas,
    allTeamMembersDatas,
  ] = await Promise.all([
    prisma.team.findMany({
      where: { members: { some: { userId: user.id } } },
      include: { members: true },
    }),
    prisma.teamMember.findMany({
      where: { userId: user.id },
      include: { team: true, user: true },
    }),
    prisma.compRegistration.findMany({
      where: { userId: user.id },
      include: { team: true },
    }),
    prisma.compRegistration.findMany({
      select: { teamId: true },
    }),
    prisma.team.findMany({
      select: {
        id: true,
        competition: true,
      },
    }),
    prisma.teamMember.findMany({
      select: {
        email: true,
        teamId: true,
        userId: true,
        role: true,
      },
    }),
  ]);
  return (
    <RegisterForm
      comp={comp}
      user={user as User}
      teams={teams as Team[]}
      registeredCompetitions={registeredCompetitions as CompRegistration[]}
      teamMembers={teamMembers as TeamMember[]}
      allTeamsDatas={allTeamsDatas as Team[]}
      allRegisteredTeamDatas={allRegisteredTeamDatas as CompRegistration[]}
      allTeamMembersDatas={allTeamMembersDatas as TeamMember[]}
    />
  );
}
