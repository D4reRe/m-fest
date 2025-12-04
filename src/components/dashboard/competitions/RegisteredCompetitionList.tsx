import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { competitions } from "@/lib/competition";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { type Competition, type User } from "@/types/types";
import { getUser } from "@/action/user.action";
import { db } from "@/server/db";
import { Suspense } from "react";
import CompetitionListSkeleton from "../CompetitionListSkeleton";
import { IconListDetails } from "@tabler/icons-react";
import CountdownClient from "./CountdownClient";
import type { Team } from "../../../../prisma/generated/prisma/client";

export default function RegisteredCompetitionList() {
  return (
    <Suspense fallback={<CompetitionListSkeleton />}>
      <FetchUserRegisteredCompetitions />
    </Suspense>
  );
}

async function FetchUserRegisteredCompetitions() {
  const user = (await getUser()) as User;
  const registeredCompetitions = await db.compRegistration.findMany({
    where: {
      userId: user.id,
      statusOrder: "SUCCESS",
    },
  });
  const team = await db.team.findFirst({
    where: {
      leaderUserId: user.id,
    },
  });
  // console.log("Registered competitions: ", registeredCompetitions);
  const registeredCompetitionNames = registeredCompetitions.map(
    (competition) => competition.competitionName
  );
  if (!registeredCompetitionNames.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconListDetails />
            </EmptyMedia>
            <EmptyTitle>No Registered Competitions Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t registered any competitions yet. Get registered
              by clicking the button below.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button className="cursor-pointer" asChild>
              <Link href="/dashboard/team" prefetch>
                Register Competition
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
  // console.log("Registered competition names: ", registeredCompetitionNames);
  const registeredCompetitionsList = competitions.filter((comp) =>
    registeredCompetitionNames.includes(comp.abbreviation)
  );
  // console.log("Registered competitions: ", registeredCompetitionsList);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 items-stretch my-2">
      {registeredCompetitionsList.map((comp) => (
        <Card
          key={comp.abbreviation}
          className="w-full max-w-sm bg-white/5 flex flex-col"
        >
          <CardHeader className="flex flex-col justify-center items-center mb-auto">
            <CardTitle>{comp.abbreviation}</CardTitle>
            <CardDescription className="text-center">
              {comp.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center grow my-auto">
            <div className="">
              <Image
                src={comp.logo}
                alt={comp.title}
                width={200}
                height={200}
                loading="lazy"
                className="object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-auto">
            {comp.compOpenCase ? (
              <CountdownClient
                date={comp.compOpenCase}
                comp={comp as Competition}
                description="Case opened in"
                type="compOpenCase"
                team={team as Team}
              />
            ) : (
              <Button
                variant="default"
                size="sm"
                className="gap-1 pr-1.5 cursor-pointer"
                disabled={team?.teamStatus === "ACCEPTED" ? false : true}
              >
                <Link
                  href={`/dashboard/competitions/${comp.abbreviation.toUpperCase()}`}
                  prefetch
                  className="flex items-center gap-2"
                >
                  <span>
                    {team?.teamStatus === "ACCEPTED"
                      ? "View Details"
                      : "Team status is pending"}
                  </span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
