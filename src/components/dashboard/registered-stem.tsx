import { auth } from "@/auth";
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
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getUserProfile } from "@/action/user.action";
import { User } from "@/types/types";

export async function RegisteredStemCompetition() {
  const user = (await getUserProfile()) as User;
  const stemComp = await prisma.compRegistration.findMany({
    where: {
      userId: user.id,
      competitionName: "STEM",
    },
  });
  const userStemComp = stemComp[0];

  return (
    <section className="glass p-6">
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
    </section>
  );
}
