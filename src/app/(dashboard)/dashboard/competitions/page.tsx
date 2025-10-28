import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};
import { IconListDetails } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RegisteredCompetitions } from "@/components/dashboard/registered-teams";
import { RegisteredStemCompetition } from "@/components/dashboard/registered-stem";

async function CompPage() {
  const session = await auth();
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      userId: session?.user.id,
    },
  });
  const teamIds = teamMembers.map((member) => member.teamId);
  const registeredCompetitions = await prisma.compRegistration.findMany({
    where: {
      teamId: {
        in: teamIds,
      },
      statusOrder: "settlement",
    },
  });

  const stemComp = await prisma.compRegistration.findMany({
    where: {
      userId: session?.user.id,
      competitionName: "STEM",
      statusOrder: "settlement",
    },
  });

  return (
    <section className="min-h-screen bg-transparent">
      <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h3 className="text-3xl font-bold text-foreground">
          {registeredCompetitions.length ? "Your Competitions" : "Competitions"}
        </h3>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {registeredCompetitions.length ? (
          <RegisteredCompetitions />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconListDetails />
              </EmptyMedia>
              <EmptyTitle>No Competitions Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t registered any competitions yet. Get registered
                by clicking the button below.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button className="cursor-pointer">
                  <Link href="/competitions">Register Competition</Link>
                </Button>
              </div>
            </EmptyContent>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground"
              size="sm"
            >
              <Link href="/competitions">
                Learn More <ArrowUpRightIcon />
              </Link>
            </Button>
          </Empty>
        )}
      </div>
      {stemComp.length ? (
        <>
          <div className="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-3xl font-bold text-foreground">
              STEM Competition
            </h3>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <RegisteredStemCompetition />
          </div>
        </>
      ) : null}
    </section>
  );
}

export default CompPage;
