import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Edit, Users } from "lucide-react";
import { Fragment } from "react";
import { UserAvatar } from "../general/UserProfile";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { IconUsers } from "@tabler/icons-react";
import { Button } from "../ui/button";
import Link from "next/link";

export async function TeamMembers() {
  const session = await auth();
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
  if (!teams.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUsers />
          </EmptyMedia>
          <EmptyTitle>No Teams Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t join or create any teams yet. Create your team by
            clicking the button below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Link href="dashboard/team/create-team">
              <Button className="cursor-pointer">Create team</Button>
            </Link>
          </div>
        </EmptyContent>
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        ></Button>
      </Empty>
    );
  }
  return (
    <section className="glass p-6">
      <h3 className="text-3xl font-bold text-foreground mb-6">Teams</h3>
      {teams.map((team) => {
        return (
          <Fragment key={team.id}>
            <div className="p-6 border-2 rounded-lg my-12 ">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <div className="flex flex-col ">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-1">
                    <span>{team.name}</span>
                    {team.members.some(
                      (member) =>
                        member.userId === session?.user.id &&
                        member.role === "Leader"
                    ) &&
                      !team.competition && (
                        <Link
                          href={`/dashboard/team/edit-team/${team?.name
                            ?.split(" ")
                            .join("-")}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 cursor-pointer h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
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
                    const user = await prisma.user.findUnique({
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
                        <h4 className="font-medium text-foreground text-sm mt-3">
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
    </section>
  );
}
