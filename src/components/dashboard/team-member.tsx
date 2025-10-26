import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
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
      <h3 className="text-lg font-semibold text-foreground mb-6">Teams</h3>
      {teams.map((team) => {
        return (
          <Fragment key={team.id}>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                {team.name}
              </h3>
              <Badge className="bg-primary/30 text-primary border-primary/50 ml-auto">
                {team.members.length} members
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {team.members.map(async (member) => {
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
                          : "bg-muted/30 text-muted-foreground border-muted/50"
                      } border`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
