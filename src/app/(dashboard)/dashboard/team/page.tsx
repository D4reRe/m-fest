import { UserAvatar } from "@/components/general/UserProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/server/db";
import { IconUsersGroup } from "@tabler/icons-react";
import { BadgeCheckIcon, Edit, Trash } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import AlertDialogActionButton from "@/components/dashboard/deleteButton";
import { getUser } from "@/action/user.action";
import { type User } from "@/types/types";
import TeamFallback from "@/components/dashboard/TeamFallback";
import CompetitionListDashboard from "@/components/dashboard/team/CompetitionListDashboard";

export const metadata: Metadata = {
  title: "Team & Register | Mechanical Festival 2026",
  description:
    "Create and register your team to particiapte in Mechanical Festival 2026",
};

async function deleteTeam(teamId: string) {
  "use server";
  await db.teamMember.deleteMany({
    where: { teamId },
  });
  await db.team.delete({
    where: { id: teamId },
  });
}

export default function TeamsPage() {
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-foreground">
        Register Competition
      </h1>
      <CompetitionListDashboard />
      <div className="flex justify-between mt-4">
        <h3 className="text-3xl font-bold text-foreground">Your Teams</h3>
        <Button className="cursor-pointer" asChild>
          <Link href="team/create-team" prefetch>
            Create team
          </Link>
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<TeamFallback />}>
          <FetchTeams />
        </Suspense>
      </div>
    </section>
  );
}

async function FetchTeams() {
  const user = (await getUser()) as User;
  const teams = await db.team.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
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
  if (!teams.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsersGroup />
          </EmptyMedia>
          <EmptyTitle>No Teams Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t join or create any teams yet. Create your team by
            clicking the button below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button className="cursor-pointer" asChild>
              <Link href="team/create-team" prefetch>
                Create team
              </Link>
            </Button>
          </div>
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
                    {team.members.some(
                      (member) =>
                        member.userId === user.id && member.role === "Leader"
                    ) &&
                      !team.competition && (
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 cursor-pointer h-8 w-8"
                            asChild
                          >
                            <Link
                              href={`/dashboard/team/edit-team/${team?.name
                                ?.split(" ")
                                .join("-")}`}
                              prefetch
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="ml-2 cursor-pointer h-8 w-8"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-transparent backdrop-blur-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete {team.name} and remove this
                                  team from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogActionButton
                                  teamId={team.id}
                                  deleteTeam={deleteTeam}
                                />
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                  </h3>
                  <h5 className="text-sm text-muted-foreground">
                    {team.competition && team.status === "SUCCESS"
                      ? team.competition
                      : "No competition"}
                  </h5>
                </div>
                <div className="ml-auto flex flex-col-reverse gap-2 items-center justify-center">
                  <Badge className="bg-primary/30 text-primary border-primary/50">
                    {team.members.length} members
                  </Badge>
                  <span>
                    {team.teamStatus === "NOT_REGISTERED" ? (
                      <Badge variant={"default"}>Unregistered</Badge>
                    ) : team.teamStatus === "PENDING" ? (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-600 text-white"
                      >
                        Pending
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500 text-white dark:bg-blue-600"
                      >
                        <BadgeCheckIcon />
                        Verified
                      </Badge>
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {team.members
                  .sort((a, b) => (a.role === "Leader" ? -1 : 1))
                  .map((member) => {
                    return (
                      <div
                        key={member.user?.id}
                        className="glass-sm p-4 flex flex-col items-center text-center"
                      >
                        <span className="mb-2">
                          {member.user?.documents?.status === "PENDING" ? (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-600 text-white"
                            >
                              Pending
                            </Badge>
                          ) : member.user?.verified &&
                            member.user?.documents?.status === "ACCEPTED" ? (
                            <Badge
                              variant="secondary"
                              className="bg-blue-500 text-white dark:bg-blue-600"
                            >
                              <BadgeCheckIcon />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white">
                              Not Submitted
                            </Badge>
                          )}
                        </span>
                        <UserAvatar
                          src={member.user?.image as string}
                          alt={member.user?.name as string}
                          className="w-24 h-24 border-2 border-primary/50"
                        />
                        <h4 className="font-medium text-foreground text-sm mt-3 line-clamp-1">
                          {member.user?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.user?.institution}
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
