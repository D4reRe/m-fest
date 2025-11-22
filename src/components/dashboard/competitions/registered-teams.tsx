import { Badge } from "@/components/ui/badge";
import { db } from "@/server/db";
import { ArrowRight } from "lucide-react";
import { Fragment, Suspense } from "react";
import { UserAvatar } from "../../general/UserProfile";
import { getUserProfile } from "@/action/user.action";
import { User } from "@/types/types";
import { IconUsersGroup } from "@tabler/icons-react";
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
import TeamFallback from "./../TeamFallback";

export function RegisteredCompetitionsTeams() {
  return (
    <section className="glass my-2">
      <h3 className="text-3xl font-semibold text-foreground mb-6">Teams</h3>
      <Suspense fallback={<TeamFallback />}>
        <RegisteredTeams />
      </Suspense>
    </section>
  );
}

async function RegisteredTeams() {
  const user = (await getUserProfile()) as User;
  const teams = await db.team.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
      status: "SUCCESS",
    },
    include: {
      members: true,
    },
  });
  const teamMembers = await db.teamMember.findMany({
    where: {
      userId: user.id,
    },
  });
  const teamIds = teamMembers.map((member) => member.teamId);
  const registeredCompetitions = await db.compRegistration.findMany({
    where: {
      teamId: {
        in: teamIds,
      },
      statusOrder: "SUCCESS",
    },
  });

  if (!registeredCompetitions.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsersGroup />
          </EmptyMedia>
          <EmptyTitle>No Registered Teams Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t registered any competitions yet. Get registered by
            clicking the button below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="default" asChild className="text-black" size="sm">
            <Link href="/dashboard/team">
              Register <ArrowRight />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <>
      {teams.map((team) => {
        return (
          <Fragment key={team.id}>
            <div className="p-6 border-2 rounded-lg my-12 ">
              <div className="flex items-center gap-3 mb-6">
                <IconUsersGroup className="w-6 h-6 text-primary" />
                <div className="flex flex-col ">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-1">
                    <span>{team.name}</span>
                  </h3>
                  <h5 className="text-sm text-muted-foreground">
                    {team.competition && team.status === "SUCCESS"
                      ? team.competition
                      : "No competition"}
                  </h5>
                </div>
                <Badge className="bg-primary/30 text-primary border-primary/50 ml-auto">
                  {team.members.length} members
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {team.members
                  .sort((a, b) => (a.role === "Leader" ? -1 : 1))
                  .map(async (member) => {
                    const user = await db.user.findUnique({
                      where: { id: member.userId },
                    });

                    return (
                      <div
                        key={user?.id}
                        className="glass-sm p-4 flex flex-col items-center text-center"
                      >
                        <UserAvatar
                          src={user?.image as string}
                          alt={user?.name as string}
                          className="w-24 h-24 border-2 border-primary/50"
                        />
                        <h4 className="font-medium text-foreground text-sm mt-3 line-clamp-1">
                          {user?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user?.institution}
                        </p>
                        <Badge
                          className={`mt-3 text-xs ${
                            member.role === "Leader"
                              ? "bg-primary/30 text-primary border-primary/50"
                              : "bg-primary/15 text-foreground border-muted/50"
                          } border`}
                        >
                          {member.role}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
