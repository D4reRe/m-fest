import SubmitForm from "@/components/dashboard/competitions/SubmitForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  submissionDeadlineBCC,
  submissionDeadlineIPPC,
  submissionDeadlinePDC,
  submissionOpenDate,
} from "@/constants/constants";
import { competitions } from "@/lib/competition";
import Link from "next/link";

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
  return (
    <section className="min-h-screen bg-transparent w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="p-6 flex flex-col sm:flex-row">
        <div className="border-r">
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
            <p className="mt-3">
              Good luck!
              <br />
              If there is any question you can contact our contact person by
              press &quot;Get Help&quot; button.
              <br />
              You can submit your submission by press &quot;Submit&quot; button
              on the right
            </p>
            <p className="mt-3">Guidelines and Infos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <Button asChild>
                <Link
                  href={
                    competitions.find(
                      (competition) =>
                        competition.abbreviation === comp.toUpperCase()
                    )?.guideBook as string
                  }
                  className="font-bold"
                  target="_blank"
                >
                  Guidebook
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6 bg-transparent ">
          <SubmitForm comp={comp} />
        </div>
      </div>
    </section>
  );
}
