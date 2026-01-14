"use client";

import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { CompetitionName } from "../../../prisma/generated/prisma/enums";
import { IconListDetails, IconUsersGroup } from "@tabler/icons-react";
import { Avatar, Skeleton } from "@heroui/react";
import { competitions } from "@/lib/competition";
import { EmptyMedia } from "../ui/empty";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

export function Competitions() {
    const trpc = useTRPC();
    const { data: comp, isLoading: isLoadingComp } = useQuery({
        ...trpc.dashboard.getUserComp.queryOptions(),
    });

    const {
        data: totalCompPartcitipants,
        isLoading: isLoadingTotalCompPartcitipants,
    } = useQuery({
        ...trpc.dashboard.getTotalParticipantsComp.queryOptions({
            comp: comp?.competitionName as CompetitionName,
        }),
        enabled: comp ? true : false,
    });

    const { data: team, isLoading: isLoadingTeam } = useQuery({
        ...trpc.dashboard.getTeamById.queryOptions({
            teamId: comp?.teamId as string,
        }),
        enabled: comp ? true : false,
    });

    const getStatusColor = (status: boolean) => {
        return status
            ? "bg-green-600 text-white border-muted/50"
            : "bg-yellow-500 text-accent border-accent/50";
    };

    if (isLoadingComp || isLoadingTotalCompPartcitipants || isLoadingTeam) {
        return (
            <div className="glass p-6">
                <Skeleton className="h-7 w-32 mb-6" />

                <div className="space-y-4 border-2 rounded-lg bg-transparent backdrop-blur-lg">
                    <div className="glass-sm p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-start gap-3 flex-1">
                                <Skeleton className="w-5 h-5 mt-0.5 shrink-0 rounded-md" />

                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-5 w-[70%]" />
                                    <Skeleton className="h-3 w-[40%]" />
                                </div>
                            </div>

                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-5 h-5 rounded-md" />
                                <Skeleton className="h-5 w-24" />
                            </div>

                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-10 w-10 rounded-full ring-2 ring-card"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!comp) {
        return (
            <div className="glass p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                    Competition
                </h3>
                <div
                    className={cn("space-y-4", {
                        " border-2 rounded-lg bg-transparent backdrop-blur-lg":
                            comp,
                    })}
                >
                    <div className="glass-sm p-4 transition-colors flex flex-col justify-center items-center">
                        <EmptyMedia variant={"icon"}>
                            <IconListDetails />
                        </EmptyMedia>
                        <h1>No Registered Competition</h1>
                        <Button className={"mt-2"} asChild>
                            <Link href={"/dashboard/team"}>Register Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
                Competition
            </h3>
            <div className="space-y-4 border-2 rounded-lg bg-transparent backdrop-blur-lg">
                <div className="glass-sm p-4 hover:bg-card/50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                            <Trophy className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <div>
                                <h4 className="font-medium text-foreground">
                                    {
                                        competitions.find(
                                            (c) =>
                                                c.abbreviation ===
                                                comp?.competitionName,
                                        )?.title
                                    }
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {totalCompPartcitipants} participants
                                </p>
                            </div>
                        </div>
                        <Badge
                            className={`${getStatusColor(comp?.isVerified as boolean)} border`}
                        >
                            {comp?.isVerified ? "Verified" : "Pending"}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                        <div className="flex items-center gap-2">
                            <IconUsersGroup className="w-5 h-5 text-primary" />
                            <span className="text-base font-semibold text-foreground">
                                {comp?.teamName}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                            <div className="flex -space-x-2">
                                {team?.members.map((member) => (
                                    <Avatar
                                        key={member.user.id}
                                        className="ring-2 ring-card"
                                    >
                                        <Avatar.Image
                                            alt={member.user.name}
                                            src={member.user.image as string}
                                        />
                                        <Avatar.Fallback>
                                            {member.user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </Avatar.Fallback>
                                    </Avatar>
                                ))}
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
