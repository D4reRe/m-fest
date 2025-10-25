import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Events | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

import { IconConfetti } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
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

function EventsPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconConfetti />
        </EmptyMedia>
        <EmptyTitle>No Events Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t registered any events yet. Get registered by clicking
          the button below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="cursor-pointer">Register Event</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link href="/events">
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

export default EventsPage;
