import ExamClient from "@/app/(dashboard)/dashboard/competitions/(exam)/stem-exam/exam";
import { db } from "@/server/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { User } from "../../../../../../../prisma/generated/prisma/client";

export const metadata: Metadata = {
  title: "STEM Exam | Mechanical Festival 2026",
  description: "STEM Exam",
};

export default async function StemExamPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;
  if (!token) {
    console.log("Token not found");
    redirect("entry-exam");
  }

  const examSession = await db.examSession.findUnique({
    where: { token },
  });

  const user = await db.user.findUnique({
    where: {
      id: examSession?.userId,
    },
    include: {
      registration: true,
    },
  });

  if (user?.registration[0]?.competitionName !== "STEM") {
    console.log("User is not registered for STEM");
    redirect("/dashboard");
  }

  if (!examSession || examSession.used || examSession.expiresAt < new Date()) {
    console.log("Exam session not found");
    redirect("entry-exam");
  }

  return <ExamClient user={user as User} />;
}
