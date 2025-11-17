import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { getUserProfile } from "@/action/user.action";
import { User } from "@/types/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../ui/empty";
import { IconListDetails } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "../../ui/skeleton";

export function RegisteredStemCompetition() {
  return (
    <>
      <div className="flex justify-between ">
        <h3 className="text-3xl font-bold text-foreground">STEM Competition</h3>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<Skeleton className="w-full max-w-7xl h-64" />}>
          <FetchUserRegisteredStem />
        </Suspense>
      </div>
    </>
  );
}

async function FetchUserRegisteredStem() {
  const user = (await getUserProfile()) as User;
  const stemComp = await prisma.compRegistration.findMany({
    where: {
      userId: user.id,
      competitionName: "STEM",
      statusOrder: "SUCCESS",
    },
  });
  if (!stemComp.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconListDetails />
          </EmptyMedia>
          <EmptyTitle>No Stem Competition Registration Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t registered stem competition yet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
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
        </EmptyContent>
      </Empty>
    );
  const userStemComp = stemComp[0];

  return (
    <Card className="w-full max-w-7xl bg-transparent">
      <CardHeader>
        <CardTitle>{userStemComp?.name as string}</CardTitle>
        <CardDescription>{userStemComp?.school as string}</CardDescription>
        <CardAction className="relative">
          <Badge className="mt-3 text-xs bg-slate-500 text-primary border-primary/50 absolute top-4 left-4">
            Mentor
          </Badge>
          <Button variant="outline">{userStemComp?.mentor}</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <main>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={userStemComp?.email as string}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Phone Number</Label>
              </div>
              <Input
                type="text"
                defaultValue={userStemComp?.phoneNumber as string}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Educaction</Label>
              </div>
              <Input
                type="text"
                defaultValue={userStemComp?.education as string}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Status</Label>
              </div>
              <Input
                type="text"
                defaultValue={
                  (userStemComp?.statusOrder as string) === "SUCCESS"
                    ? "Paid"
                    : "Waiting for Payment"
                }
                disabled
              />
            </div>
          </div>
        </main>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {userStemComp?.statusOrder === "SUCCESS"
            ? "Stay Tuned!"
            : "Awaiting Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
