import React from "react";
import { Metadata } from "next";
import { getUserProfile } from "@/action/user.action";
import { Team, User } from "@prisma/client";
import TeamForm from "./edit-team-form";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Team | Mechanical Festival 2026",
  description: "Edit Team to Mechanical Festival 2026",
};

async function EditTeamPage({ params }: { params: Promise<{ team: string }> }) {
  const user: User = (await getUserProfile()) as User;
  const { team: teamName } = await params;
  const team = await prisma.team.findUnique({
    where: { name: teamName.split("-").join(" ") },
    include: { members: true },
  });
  if (!team) redirect("/dashboard/team");
  if (
    !team.members.find(
      (member) => member.userId === user.id && member.role === "Leader"
    )
  )
    redirect("/dashboard/team");

  return (
    <section className="flex min-h-screen bg-transparent px-4 py-4 md:py-8 dark:bg-transparent">
      <div className="bg-transparent m-auto h-fit w-full max-w-5xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-xl font-semibold text-start">
              Edit Team
            </h1>
            <p className="text-sm text-start">
              Edit your existing team, make sure to properly fill in all the
              details.
            </p>
            <p className="text-sm text-red-500 text-start font-bold mt-2">
              Team must be at least 3 members and maximum of 5 members.
            </p>
            <p className="text-sm text-red-500 text-start font-bold mt-2">
              The first member is the team leader and the representative of the
              team which is the one who create the team and submit the
              registration.
            </p>
            <p className="text-sm text-red-500 text-start font-bold mt-2">
              Please make sure your members have signed up or logged in on our
              website and complete their profile before adding them to your
              team.
            </p>
          </div>
          <TeamForm user={user} team={team as Team} />
        </div>
      </div>
    </section>
  );
}

export default EditTeamPage;
