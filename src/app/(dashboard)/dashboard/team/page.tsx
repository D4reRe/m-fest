import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Team | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};

import { IconUsers } from "@tabler/icons-react";
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

function TeamPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUsers />
        </EmptyMedia>
        <EmptyTitle>No Teams Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t join or create any teams yet. Get registered by
          clicking the button below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="cursor-pointer">Create team</Button>
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

export default TeamPage;
