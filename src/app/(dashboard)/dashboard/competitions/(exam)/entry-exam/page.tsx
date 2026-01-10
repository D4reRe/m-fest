import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { Button } from "@heroui/react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Entry Exam | Mechanical Festival 2026",
  description: "Entry Exam",
};

export default async function EntryExamPage() {
  const sebKey = await headers().then((h) =>
    h.get("x-safeexambrowser-configkeyhash")
  );
  console.log("SEB Key for this client exam: ", sebKey);

  if (!sebKey) {
    console.log("SEB key not found, user is not using SEB");
    redirect("use-seb");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      registration: true,
      team_member: {
        include: {
          user: true,
          team: true,
        },
      },
    },
  });

  // Leader check if registered for STEM
  if (
    user?.registration[0]?.competitionName !== "STEM" &&
    user?.id === user?.team_member[0]?.team.leaderUserId
  ) {
    console.log("User as the leader is not registered for STEM");
    redirect("/dashboard");
  }

  // Member check if their team is accepted and registered
  if (
    user?.team_member[0]?.team.competition !== "STEM" ||
    user?.team_member[0]?.team.teamStatus !== "ACCEPTED" ||
    user?.team_member[0]?.team.status !== "SUCCESS" ||
    !user.team_member[0] ||
    !user.team_member[0].team
  ) {
    console.log("Member's team is not accepted and not registered");
    redirect("/dashboard");
  }

  const token = crypto.randomUUID();

  await db.examSession.create({
    data: {
      userId: session?.user.id as string,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
    },
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Ready to start your exam</h1>
      <p className="text-lg font-bold">
        Closed Book Exam & Cheating is prohibited, you will be disqualified if
        caught.
      </p>
      <Button
        variant="primary"
        className={"rounded-sm bg-white/5 border hover:bg-white/10 mt-2"}
      >
        <Link href={`stem-exam?token=${token}`}>Start Exam</Link>
      </Button>
    </div>
  );
}
