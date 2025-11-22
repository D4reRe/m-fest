import RegisterForm from "./register-form";
import { redirect } from "next/navigation";
import { Team, CompRegistration, TeamMember } from "@/types/types";
import { competitionsName } from "@/constants/constants";
import { Suspense } from "react";
import { CompRegisterFormSkeleton } from "@/components/register/CompFormSkeleton";
import Link from "next/link";
import Image from "next/image";
import { competitions } from "@/lib/competition";
import { getRegisteredTeams } from "@/action/register.action";

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
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <Suspense fallback={<CompRegisterFormSkeleton />}>
            <FetchCompForm params={params} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function FetchCompForm({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  let { comp } = await params;
  if (comp) {
    if (!competitionsName.includes(comp.toUpperCase())) {
      redirect("/competitions");
    }
  }
  comp = comp.toLowerCase();
  const {
    allRegisteredTeamDatas,
    allTeamsDatas,
    allTeamMembersDatas,
    userTeams,
    userRegisteredCompetitions,
    userAsLeaderTeams,
    teamNames,
  } = await getRegisteredTeams();

  return (
    <>
      <div className="text-center">
        <Link
          href="/"
          aria-label="go home"
          className="flex items-center gap-4 justify-center"
        >
          <Image
            src={`/competitions/logo/${comp}.png`}
            alt="Mechanical Festival 2026"
            width={150}
            height={150}
            loading="lazy"
          />
        </Link>
        <h1 className="mb-1 mt-4 text-xl font-semibold">
          Register{" "}
          {
            competitions.find((c) => c.abbreviation === comp.toUpperCase())
              ?.title
          }
        </h1>
        <p className="text-sm">
          Please fill in the form below to register for {comp.toUpperCase()}
        </p>
        <h2 className="text-lg text-center mt-2">
          Fee:{" "}
          <span className="font-bold italic">
            Rp. {""}
            {
              competitions.find((c) => c.abbreviation === comp.toUpperCase())
                ?.fee1
            }
          </span>
        </h2>
      </div>
      <RegisterForm
        comp={comp}
        userTeams={userTeams as Team[]}
        userRegisteredCompetitions={
          userRegisteredCompetitions as CompRegistration[]
        }
        allTeamsDatas={allTeamsDatas as Team[]}
        allRegisteredTeamDatas={allRegisteredTeamDatas as CompRegistration[]}
        allTeamMembersDatas={allTeamMembersDatas as TeamMember[]}
        userAsLeaderTeams={userAsLeaderTeams as Team[]}
        teamNames={teamNames as (string | null)[]}
      />
    </>
  );
}
