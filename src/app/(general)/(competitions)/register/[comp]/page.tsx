import { auth } from "@/auth";
import RegisterForm from "./register-form";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { Team, User, CompRegistration, TeamMember } from "@/types/types";

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

const competitionsName = ["BCC", "IPPC", "PDC", "STEM"];

async function CompPage({ params }: { params: Promise<{ comp: string }> }) {
  const session = await auth();
  const { comp } = await params;
  if (!session) redirect("/login");
  if (comp) {
    if (!competitionsName.includes(comp.toUpperCase())) {
      redirect("/competitions");
    }
  }
  const user = await getUserProfile();
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
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id,
        },
      },
    },
    include: {
      members: true,
    },
  });
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      team: true,
      user: true,
    },
  });
  const registeredCompetitions = await prisma.compRegistration.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      team: true,
    },
  });
  const allRegisteredTeams = await prisma.compRegistration.findMany();
  const allTeams = await prisma.team.findMany();
  const allTeamMembers = await prisma.teamMember.findMany();
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-xl verflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <RegisterForm
          comp={comp}
          user={user as User}
          teams={teams as Team[]}
          registeredCompetitions={registeredCompetitions as CompRegistration[]}
          teamMembers={teamMembers as TeamMember[]}
          allTeams={allTeams as Team[]}
          allRegisteredTeams={allRegisteredTeams as CompRegistration[]}
          allTeamMembers={allTeamMembers as TeamMember[]}
        />
      </div>
    </section>
  );
}

export default CompPage;
