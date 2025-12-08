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
import { type User } from "@/types/types";
import { getUser } from "@/action/user.action";
import { db } from "@/server/db";
import { Suspense } from "react";
import CompetitionListSkeleton from "../CompetitionListSkeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconListDetails } from "@tabler/icons-react";

export default function RegisteredCompetitionList() {
  return (
    <Suspense fallback={<CompetitionListSkeleton />}>
      <FetchUserAvailableCompetitions />
    </Suspense>
  );
}

async function FetchUserAvailableCompetitions() {
  const user = (await getUser()) as User;
  const registeredCompetitions = await db.compRegistration.findMany({
    where: {
      userId: user.id,
      statusOrder: "SUCCESS",
    },
  });
  // console.log("Registered competitions: ", registeredCompetitions);
  const registeredCompetitionNames = registeredCompetitions.map(
    (competition) => competition.competitionName,
  );
  // console.log("Registered competition names: ", registeredCompetitionNames);
  const competitionsList = competitions.filter(
    (comp) => !registeredCompetitionNames.includes(comp.abbreviation),
  );
  if (!competitionsList.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconListDetails />
            </EmptyMedia>
            <EmptyTitle>No Available Competitions</EmptyTitle>
            <EmptyDescription>
              You have registered for all available competitions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button className="cursor-pointer" asChild>
              <Link href="/dashboard/competitions" prefetch>
                View Registered Competitions
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  // console.log("Registered competitions: ", competitionsList);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 items-stretch my-2">
      {competitionsList.map((comp) => (
        <Card
          key={comp.abbreviation}
          className="w-full max-w-sm bg-white/5 flex flex-col backdrop-blur-sm"
        >
          <CardHeader className="flex flex-col justify-center items-center mb-auto">
            <CardTitle>{comp.abbreviation}</CardTitle>
            <CardDescription className="text-center">
              {comp.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center grow my-auto">
            <Image
              src={comp.logo}
              alt={comp.title}
              width={200}
              height={200}
              loading="lazy"
              className="object-cover"
            />
          </CardContent>
          <CardFooter className="flex justify-center mt-auto">
            <Button
              variant="default"
              size="sm"
              className="gap-1 pr-1.5 cursor-pointer"
            >
              <Link
                href={`/dashboard/team/register/${comp.abbreviation}`}
                prefetch
                className="flex items-center gap-2"
              >
                <span>Register</span>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
