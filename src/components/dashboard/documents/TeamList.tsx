import { getUser } from "@/action/user.action";
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
import { cn } from "@/lib/utils";
import { db } from "@/server/db";
import { type User } from "@/types/types";
import { IconUsersGroup } from "@tabler/icons-react";
import { BadgeCheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function TeamList() {
    return (
        <div className="w-full">
            <Suspense
                fallback={
                    <div className="max-w-7xl justify-center items-center flex">
                        <Loader2 className="animate-spin w-12 h-12 mt-12" />
                    </div>
                }
            >
                <FetchUserTeams />
            </Suspense>
        </div>
    );
}

export default TeamList;

async function FetchUserTeams() {
    const user = (await getUser()) as User;
    const teams = await db.team.findMany({
        where: {
            leaderUserId: user.id,
        },
        select: {
            id: true,
            name: true,
            competition: true,
            members: true,
            status: true,
            teamStatus: true,
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
                        You haven&apos;t register any teams yet to verify
                        documents.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className="flex gap-2">
                        <Button className="cursor-pointer" asChild>
                            <Link href="team/" prefetch>
                                Register team
                            </Link>
                        </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 items-stretch my-2">
            {teams.map((team) => (
                <div
                    key={team.id}
                    className={cn(
                        "p-6 border rounded-lg bg-white/5",
                        team.competition ??
                            "opacity-50 pointer-events-none cursor-not-allowed",
                    )}
                >
                    <h3 className="text-xl font-bold">{team.name}</h3>
                    <span>
                        {team.teamStatus === "NOT_REGISTERED" ? (
                            <Badge variant={"default"}>Not Registered</Badge>
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
                    <h1 className="text-lg mt-2">
                        {team.competition ? team.competition : "No competition"}
                    </h1>
                    <p className="text-muted-foreground">
                        {team.members.length} members
                    </p>
                    <Button
                        className="mt-4 text-sm md:text-xs lg:text-sm"
                        size={"sm"}
                        asChild
                    >
                        <Link
                            // href={`/dashboard/documents/${team.name?.split(" ").join("-")}`}
                            href={`/dashboard/documents/${team.id}`}
                        >
                            {team.teamStatus === "ACCEPTED"
                                ? "View Documents"
                                : "Verify Members"}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
