import { Prisma } from "@prisma/client";
import { UserAvatar } from "@/components/general/UserProfile";
import Link from "next/link";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: { include: { user: { include: { verification: true } } } };
  };
}>;

async function MemberList({ team }: { team: TeamWithMembers }) {
  return (
    <div className="w-full">
      <div className="grid max-xs:grid-cols-1 xs:grid-cols-2 max-xxl:grid-cols-2 xxl:grid-cols-3 gap-16 items-stretch my-2">
        {team.members.map((member) => (
          <div
            className="p-6 border rounded-lg bg-white/5 w-fit h-fit"
            key={member.userId}
          >
            {/* Desktop */}
            <div className="flex w-fit gap-6 items-center max-[1160px]:hidden min-[1160px]:flex-row">
              <div className="max-[1160px]:text-center flex flex-col">
                <p className="text-muted-foreground">{member.role}</p>
                <h3 className="text-xl font-bold truncate w-40">
                  {member.user?.name}
                </h3>
                <Tooltip delayDuration={700}>
                  <TooltipTrigger>
                    <p className="truncate w-40">{member.email}</p>
                  </TooltipTrigger>
                  <TooltipContent className="z-10">
                    <div className="bg-muted rounded-lg p-2">
                      <p>{member.email}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <button className="px-4 py-0.5 bg-foreground hover:bg-foreground/80 text-black rounded-md text-sm transition-all mt-4 max-xxl:self-center w-fit">
                  <Link
                    href={`/dashboard/documents/${team.name
                      ?.split(" ")
                      .join("-")}/${member.userId}`}
                  >
                    <span className="flex items-center gap-2">
                      <p>Verify Member</p>
                    </span>
                  </Link>
                </button>
              </div>

              <div className="flex flex-col items-center">
                <UserAvatar
                  src={member.user?.image || ""}
                  alt={member.user?.name || ""}
                  className="w-24 h-24 border-2 border-primary/50 mb-2"
                />
                <span>
                  {member.user?.verification?.status === "PENDING" ? (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-600 text-white"
                    >
                      Pending
                    </Badge>
                  ) : member.user?.verified &&
                    member.user?.verification?.status === "ACCEPTED" ? (
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
              </div>
            </div>
            {/* Mobile */}
            <div className="flex w-fit gap-6 items-center max-[1160px]:flex-col-reverse min-[1160px]:hidden">
              <div className="max-[1160px]:text-center flex flex-col">
                <p className="text-muted-foreground">{member.role}</p>
                <h3 className="text-xl font-bold truncate w-40">
                  {member.user?.name}
                </h3>
                <Tooltip delayDuration={700}>
                  <TooltipTrigger>
                    <p className="truncate w-40">{member.email}</p>
                  </TooltipTrigger>
                  <TooltipContent className="z-10">
                    <div className="bg-muted rounded-lg p-2">
                      <p>{member.email}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <button className="px-4 py-0.5 bg-foreground hover:bg-foreground/80 text-black rounded-md text-sm transition-all mt-4 max-xxl:self-center w-fit">
                  <Link
                    href={`/dashboard/documents/${team.name
                      ?.split(" ")
                      .join("-")}/${member.userId}`}
                  >
                    <span className="flex items-center gap-2">
                      <p>Verify Member</p>
                    </span>
                  </Link>
                </button>
              </div>

              <div className="flex flex-col items-center">
                <UserAvatar
                  src={member.user?.image || ""}
                  alt={member.user?.name || ""}
                  className="w-24 h-24 border-2 border-primary/50 mb-2"
                />
                <span>
                  {member.user?.verification?.status === "PENDING" ? (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-600 text-white"
                    >
                      Pending
                    </Badge>
                  ) : member.user?.verified &&
                    member.user?.verification?.status === "ACCEPTED" ? (
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;
