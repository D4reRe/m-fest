import { competitions } from "@/lib/competition";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CompetitionsDesc() {
    return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <h1 className="text-center text-6xl font-bold">Competitions</h1>
        {competitions.map((competition, index) => (
          <div
            id={competition.title.toLowerCase()}
            key={index}
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
              <h2 className="text-4xl font-medium">{competition.title}</h2>
              <div className="space-y-6">
                <p>{competition.desc}</p>

                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="gap-1 pr-1.5"
                >
                  <Link href={competition.guideBook}>
                    <span>Learn More</span>
                    <ChevronRight className="size-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};