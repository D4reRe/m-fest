import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { Button } from "@heroui/react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EntryExamPage() {
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
    },
  });

  if (user?.registration[0]?.competitionName !== "STEM") {
    console.log("User is not registered for STEM");
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
      <p className="text-lg">
        Open the exam using Safe Exam Browser{" "}
        <a
          href="https://www.safeexambrowser.org/download"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          here
        </a>
        .
      </p>
      <Button
        variant="primary"
        className={"rounded-sm bg-white/5 border-1 hover:bg-white/10 mt-2"}
      >
        <Link href={`/api/exam-config?token=${token}`} download>
          Download SEB Config
        </Link>
      </Button>
    </div>
  );
}
