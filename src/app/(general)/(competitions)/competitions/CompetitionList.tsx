import { competitions } from "@/lib/competition";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "@/components/ui/blur-fade";

export default function CompetitionsList() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
      <BlurFade inView delay={0.2}>
        <h1 className="text-center text-6xl font-bold">Competitions</h1>
      </BlurFade>
      {competitions.map((competition, index) => (
        <BlurFade key={index} inView delay={0.2}>
          <div
            id={competition.title.toLowerCase()}
            className="flex flex-col gap-10 mt-32"
          >
            <Image
              className="rounded-(--radius)"
              src={competition.logo}
              alt={competition.title}
              height={2747}
              width={1545}
              loading="lazy"
            />
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <h2 className="text-4xl font-medium flex flex-col gap-3">
                {competition.title}
              </h2>
              <div className="space-y-6">
                <p>{competition.desc}</p>

                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="gap-1 pr-1.5"
                  >
                    <Link href={competition.guideBook} target="_blank">
                      <span>Guidebook</span>
                      <ChevronRight className="size-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="gap-1 pr-1.5"
                  >
                    <Link href={`/dashboard/competitions`} prefetch>
                      <span>Register Now</span>
                      <ChevronRight className="size-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      ))}
    </div>
  );
}
