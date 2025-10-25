import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Competitions | Mechanical Festival 2026",
  description: "Mechanical Festival 2026",
};
import { IconListDetails } from "@tabler/icons-react";
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

function CompPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconListDetails />
        </EmptyMedia>
        <EmptyTitle>No Competitions Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t registered any competitions yet. Get registered by
          clicking the button below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="cursor-pointer">Register Competition</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link href="/competitions">
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

export default CompPage;
