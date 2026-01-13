import RegisterForm from "./register-form";
import { redirect } from "next/navigation";
import {
    type Team,
    type CompRegistration,
    type TeamMember,
    type Competition,
} from "@/types/types";
import { competitionsName } from "@/constants/constants";
import { Suspense } from "react";
import { CompRegisterFormSkeleton } from "@/components/register/CompFormSkeleton";
import Link from "next/link";
import Image from "next/image";
import { competitions } from "@/lib/competition";
import { getRegisteredTeams } from "@/action/register.action";
import { currentDate, getCompFee } from "@/lib/utils";
import type { Metadata } from "next";
import { getUser } from "@/action/user.action";
import type { User } from "../../../../../../../prisma/generated/prisma/client";
import { db } from "@/server/db";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ comp: string }>;
}): Promise<Metadata> {
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
    if (!comp) {
        redirect("/dashboard/team");
    }
    if (comp) {
        if (!competitionsName.includes(comp.toUpperCase())) {
            redirect("/dashboard/team");
        }
        const thisComp = competitions.find(
            (c) => c.abbreviation === comp.toUpperCase(),
        ) as Competition;
        if (
            currentDate < thisComp?.startRegDate1 ||
            currentDate > thisComp?.endRegDate3
        ) {
            redirect("/dashboard/team");
        }
        const user = (await getUser()) as User;
        const registeredCompetitions = await db.compRegistration.findMany({
            where: {
                team: {
                    members: {
                        some: {
                            userId: user.id,
                        },
                    },
                },
                statusOrder: "SUCCESS",
            },
            include: {
                team: true,
            },
        });
        if (registeredCompetitions.length) {
            redirect("/dashboard/team");
        }
    }
    comp = comp.toLowerCase();
    const compFee = getCompFee(comp);
    const {
        allRegisteredTeamDatas,
        allTeamsDatas,
        allTeamMembersDatas,
        userTeams,
        userRegisteredCompetitions,
        userAsLeaderTeams,
        teamNames,
        stemTeamNames,
    } = await getRegisteredTeams();

    return (
        <>
            <div className="text-center">
                <Link
                    href={`/dashboard/team/register/${comp}`}
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
                <h1 className="mb-1 mt-4 text-2xl font-semibold">
                    Register{" "}
                    {
                        competitions.find(
                            (c) => c.abbreviation === comp.toUpperCase(),
                        )?.title
                    }
                </h1>
                {comp.toUpperCase() === "STEM" && (
                    <p className="text-xl mb-2 text-red-500">
                        For STEM, team must consist of 3 members only.
                    </p>
                )}
                <h3 className="text-lg">
                    Before you register, please read this competition{" "}
                    <Link
                        className="underline italic font-bold"
                        href={
                            competitions.find(
                                (c) => c.abbreviation === comp.toUpperCase(),
                            )?.guideBook as string
                        }
                        target="_blank"
                    >
                        Guidebook
                    </Link>
                </h3>
                <h2 className="text-lg text-center mb-3">
                    Fee:{" "}
                    <span className="font-bold italic">
                        Rp. {""}
                        {compFee}
                    </span>
                </h2>
                <p className="text-sm mb-2">
                    Please fill in the form below to register for{" "}
                    {comp.toUpperCase()}
                </p>
            </div>
            <RegisterForm
                comp={comp}
                userTeams={userTeams as Team[]}
                userRegisteredCompetitions={
                    userRegisteredCompetitions as CompRegistration[]
                }
                allTeamsDatas={allTeamsDatas as Team[]}
                allRegisteredTeamDatas={
                    allRegisteredTeamDatas as CompRegistration[]
                }
                allTeamMembersDatas={allTeamMembersDatas as TeamMember[]}
                userAsLeaderTeams={userAsLeaderTeams as Team[]}
                teamNames={teamNames as (string | null)[]}
                stemTeamNames={stemTeamNames as (string | null)[]}
            />
        </>
    );
}
