import { events } from "@/lib/event";
import {
  ScanHeart,
  Activity,
  Wrench,
  MicVocal,
  Zap,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function ContentSection() {
  return (
    <section className="pt-16 pb-8 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Participate in our events!
          </h2>
          <p>
            Join us in our events to experience world of mechanical engineering,
            and learn from the best.
          </p>
        </div>
        <img
          className="rounded-(--radius) grayscale"
          src="/events/events-hero.jpg"
          alt="team image"
          height=""
          width=""
          loading="lazy"
        />

        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-6 items-center">
          {events.map((event) => (
            <Link
              href={`events/#${event.title.toLowerCase()}`}
              className="space-y-3 hover:scale-105 transition-all cursor-pointer"
              key={event.title}
            >
              <div className="flex items-center gap-2">
                {event.logo === "ScanHeart" ? (
                  <ScanHeart className="size-4" />
                ) : event.logo === "Activity" ? (
                  <Activity className="size-4" />
                ) : event.logo === "Wrench" ? (
                  <Wrench className="size-4" />
                ) : event.logo === "MicVocal" ? (
                  <MicVocal className="size-4" />
                ) : event.logo === "Zap" ? (
                  <Zap className="size-4" />
                ) : event.logo === "MapPin" ? (
                  <MapPin className="size-4" />
                ) : null}
                <h3 className="text-sm font-medium">{event.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
