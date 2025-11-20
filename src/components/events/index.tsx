import { Button } from "@/components/ui/button";
import { events } from "@/lib/event";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlurFade } from "../ui/blur-fade";

export default function EventsSection() {
  return (
    <section className="py-16 md:py-32" id="events">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <BlurFade inView delay={0.2}>
          <h1 className="text-center text-6xl font-bold">Events</h1>
        </BlurFade>
        {events.map((event, index) => (
          <BlurFade key={index} delay={0.2} inView>
            <div
              id={event.title.toLowerCase()}
              className="flex flex-col gap-10 mt-32"
            >
              <Image
                className="rounded-(--radius) grayscale"
                src={event.img}
                alt={event.title}
                height={2747}
                width={1545}
                loading="lazy"
              />
              <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                <h2 className="text-4xl font-medium">{event.title}</h2>
                <div className="space-y-6">
                  <p>{event.desc}</p>

                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="gap-1 pr-1.5"
                  >
                    <Link
                      href={`/events/${event.title
                        .toLowerCase()
                        .split(" ")
                        .join("-")}`}
                    >
                      <span>Learn More</span>
                      <ChevronRight className="size-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
