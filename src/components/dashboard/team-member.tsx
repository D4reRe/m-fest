import { auth } from "@/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { Fragment } from "react";

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
                    <Avatar className="w-24 h-24 border-2 border-primary/50 mb-3">
                      <AvatarImage
                        src={user?.image || "/placeholder.svg"}
                        className="object-center"
                        alt={user?.name || "User Image"}
                      />
                      <AvatarFallback className="bg-gradient-accent text-foreground font-bold">
                        {(user?.name as string)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-medium text-foreground text-sm">
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
