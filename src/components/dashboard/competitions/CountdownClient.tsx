"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Countdown from "react-countdown";
import type { Team } from "../../../../prisma/generated/prisma/client";
import type { Competition } from "@/types/types";

export default function CountdownClient({
  date,
  comp,
  description,
  type,
  team,
}: {
  date: Date;
  comp: Competition;
  description: string;
  type: "compOpenCase" | "submissionDeadline";
  team: Team;
}) {
  return (
    <Countdown
      date={date}
      renderer={({ days, hours, minutes, completed }) => {
        if (completed && type === "compOpenCase") {
          return (
            <>
              <Button
                variant="default"
                size="sm"
                className="gap-1 pr-1.5 cursor-pointer"
                disabled={team?.teamStatus === "ACCEPTED" ? false : true}
              >
                <Link
                  href={`/dashboard/competitions/${comp.abbreviation.toUpperCase()}`}
                  prefetch
                  className="flex items-center gap-2"
                >
                  <span>
                    {team?.teamStatus === "ACCEPTED"
                      ? "View Details"
                      : "Team in Pending"}
                  </span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </>
          );
        } else if (completed && type === "submissionDeadline") {
          return (
            <>
              <p className="text-red-600 text-center">
                Submission Deadline Passed
              </p>
            </>
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center gap-5 sm:gap-3 text-sm md:text-xs lg:text-sm">
              <span className="text-center">
                <p>{description}</p>
              </span>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center border rounded-lg p-2 md:p-1">
                  <p>{days}</p>
                  <p>Days</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2 md:p-1">
                  <p>{hours}</p>
                  <p>Hours</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2 md:p-1">
                  <p>{minutes}</p>
                  <p>Minutes</p>
                </div>
              </div>
              <span className="text-center">
                remaining on {date.toDateString()}
              </span>
            </div>
          );
        }
      }}
    />
  );
}
