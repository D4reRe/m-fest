"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Countdown from "react-countdown";

export default function CountdownClient({
  date,
  comp,
  description,
  type,
}: {
  date: Date;
  comp: string;
  description: string;
  type: "compOpenCase" | "submissionDeadline";
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
              >
                <Link
                  href={`/dashboard/competitions/${comp.toUpperCase()}`}
                  prefetch
                  className="flex items-center gap-2"
                >
                  <span>View Details</span>
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
            <div className="flex flex-col items-center justify-center gap-5 sm:gap-3">
              <span className="text-center">
                <p>{description}</p>
              </span>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center border rounded-lg p-2">
                  <p>{days}</p>
                  <p>Days</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2">
                  <p>{hours}</p>
                  <p>Hours</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2">
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
