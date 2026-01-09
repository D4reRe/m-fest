import CountdownClient from "@/components/dashboard/competitions/CountdownClient";
import SubmitForm from "@/components/dashboard/competitions/SubmitForm";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";
import {
  submissionDeadlineBCC,
  submissionDeadlineIPPC,
  submissionDeadlinePDC,
  submissionOpenDate,
} from "@/constants/constants";
import { competitions } from "@/lib/competition";
import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button as HeroButton } from "@heroui/react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  const comp = (await params).comp;
  return {
    title: `${comp.toUpperCase()} Submission | Mechanical Festival 2026`,
    description: `Dashboard ${comp.toUpperCase()} Competition`,
  };
}

export default function CompPage({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  return (
    <>
      <FetchCompForm params={params} />
    </>
  );
}

async function FetchCompForm({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  const { comp } = await params;
  const submissionDeadline = competitions.find(
    (competition) => competition.abbreviation === comp.toUpperCase()
  )?.submissionDeadline;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const team = await db.team.findFirst({
    where: {
      leaderUserId: session?.user.id,
    },
  });

  if (team?.teamStatus !== "ACCEPTED") {
    redirect("/dashboard/competitions");
  }

  if (comp === "STEM") {
    return (
      // Tryout Exam Here
      <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="p-6 flex flex-col sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              EXAM DETAILS FOR {comp.toUpperCase()}
            </h1>
            <div className="flex gap-6 text-muted-foreground mb-2 flex-col sm:flex-row">
              <span>
                {comp.toUpperCase() === "BCC"
                  ? "Business Case Competition"
                  : comp.toUpperCase() === "IPPC"
                  ? "Innovative Poster and Paper Competition"
                  : comp.toUpperCase() === "PDC"
                  ? "Pipeline Design Competition"
                  : comp.toUpperCase() === "STEM"
                  ? "Science, Technology, Engineering, and Mathematics (STEM) Competition"
                  : null}{" "}
                2026
              </span>
              <span>
                {comp.toUpperCase() === "BCC"
                  ? submissionOpenDate
                  : comp.toUpperCase() === "IPPC"
                  ? new Date().toDateString()
                  : comp.toUpperCase() === "PDC"
                  ? submissionOpenDate
                  : comp.toUpperCase() === "STEM"
                  ? "1 Ferbuary 2026"
                  : null}
              </span>
            </div>
            <Separator orientation="horizontal" />
            <div className="mt-6 mb-6 text-white w-full">
              <p>
                Hello participant of {comp.toUpperCase()} !!
                <br />
                Here is the submission details for {comp.toUpperCase()} 2026.
                Also there are attached files you need to see.
              </p>
              <p className="mt-3">
                Good luck!
                <br />
                If there is any question you can contact our contact person by
                press &quot;Get Help&quot; button.
                <br />
                You can submit your exam by press &quot;Submit&quot; after you
                finish your work.
              </p>
              <p className="mt-3">Guidelines and Information:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                <Button asChild>
                  <LinkPreview
                    url={
                      competitions.find(
                        (competition) =>
                          competition.abbreviation === comp.toUpperCase()
                      )?.guideBook as string
                    }
                    className="font-bold bg-transparent border-3 hover:bg-white/20"
                  >
                    Guidebook
                  </LinkPreview>
                </Button>
              </div>
              <p className="mt-3">
                Stay tuned for more information. We will notify you if the exam
                is available.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <Button className="" variant={"outline"} asChild>
                  <Link href={"entry-exam"}>Start Exam</Link>
                </Button>
                <HeroButton
                  variant="primary"
                  className={
                    "rounded-sm bg-white/5 border-1 hover:bg-white/10 "
                  }
                >
                  <Link href={`/api/exam-config`} download>
                    Download SEB Config
                  </Link>
                </HeroButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-6 flex flex-col sm:flex-row">
        <div className="border-r-0 sm:border-r p-4">
          <h1 className="text-3xl font-bold text-foreground">
            SUBMISSION DETAILS FOR {comp.toUpperCase()}
          </h1>
          <div className="flex gap-6 text-muted-foreground mb-2 flex-col sm:flex-row">
            <span>
              {comp.toUpperCase() === "BCC"
                ? "Business Case Competition"
                : comp.toUpperCase() === "IPPC"
                ? "Innovative Poster and Paper Competition"
                : comp.toUpperCase() === "PDC"
                ? "Pipeline Design Competition"
                : comp.toUpperCase() === "STEM"
                ? "Science, Technology, Engineering, and Mathematics (STEM) Competition"
                : null}{" "}
              2026
            </span>
            <span>
              {comp.toUpperCase() === "BCC"
                ? submissionOpenDate
                : comp.toUpperCase() === "IPPC"
                ? new Date().toDateString()
                : comp.toUpperCase() === "PDC"
                ? submissionOpenDate
                : comp.toUpperCase() === "STEM"
                ? "1 Ferbuary 2026"
                : null}
            </span>
          </div>
          <Separator orientation="horizontal" />
          <div className="mt-6 mb-6 text-white w-full">
            <p>
              Hello participant of {comp.toUpperCase()} !!
              <br />
              Here is the submission details for {comp.toUpperCase()} 2026. Also
              there are attached files you need to see.
            </p>

            <p className="mt-3">
              Good luck!
              <br />
              If there is any question you can contact our contact person by
              press &quot;Get Help&quot; button.
              <br />
              You can submit your submission by press &quot;Submit&quot; button
              on the right
            </p>
            <p className="mt-3">Guidelines and Information:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <Button asChild>
                <LinkPreview
                  url={
                    competitions.find(
                      (competition) =>
                        competition.abbreviation === comp.toUpperCase()
                    )?.guideBook as string
                  }
                  className="font-bold bg-transparent border-3 hover:bg-white/20"
                >
                  Guidebook
                </LinkPreview>
              </Button>
            </div>
            <p className="mt-3 text-red-600">
              <span className="font-semibold">DEADLINE :</span>{" "}
              {comp.toUpperCase() === "BCC"
                ? submissionDeadlineBCC
                : comp.toUpperCase() === "IPPC"
                ? submissionDeadlineIPPC
                : comp.toUpperCase() === "PDC"
                ? submissionDeadlinePDC
                : comp.toUpperCase() === "STEM"
                ? ""
                : null}{" "}
              at 23.59
            </p>
            <div className="mt-6">
              <CountdownClient
                date={
                  competitions.find(
                    (competition) =>
                      competition.abbreviation === comp.toUpperCase()
                  )?.submissionDeadline as Date
                }
                description="Submission Deadline"
                type="submissionDeadline"
              />
            </div>
          </div>
        </div>
        {submissionDeadline && new Date() < submissionDeadline && (
          <div className="p-6 bg-transparent ">
            <SubmitForm comp={comp} />
          </div>
        )}
      </div>
    </section>
  );
}
