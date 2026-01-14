import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import EventCard from "./eventcard";
import { events } from "@/lib/event";
import type { Variants } from "framer-motion";

const transitionVariants: { item: Variants } = {
    item: {
        hidden: {
            opacity: 0,
            filter: "blur(12px)",
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export default function EventSection() {
    return (
        <section className="py-24 px-6 md:py-40 md:px-12 lg:px-24">
            <div>
                <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    // Scaled text: 5xl on mobile, 7xl on desktop
                    className="text-left text-5xl md:text-7xl lg:mt-16 [font-family:var(--font-next-montserrat)] font-bold mb-5 leading-tight"
                >
                    {`What's the big deal?`}
                </TextEffect>
                {/* Subtitle width adjusted to full on mobile, 4/5 on desktop */}
                <span className="mt-6 md:mt-10 text-lg md:text-xl font-bold w-full md:w-4/5 leading-relaxed text-white [font-family:var(--font-next-montserrat)] block">
                    We got plenty of events, go paint the town red!
                </span>
            </div>

            <div className="flex justify-center">
                {/* Scaled "Events" text: 6xl on mobile, 9xl on desktop */}
                <h1 className="text-6xl md:text-9xl font-bold mt-10 md:mt-20 text-white [font-family:var(--font-next-montserrat)] text-center">
                    Events
                </h1>
            </div>

            {/* Layout Switch: Column on mobile, Row on desktop */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-10 md:mt-20 w-full">
                {events.map((event, index) => (
                    <EventCard
                        key={index}
                        href={event.href}
                        title={event.title}
                        imageSrc={event.img}
                        Icon={event.logo}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-12 md:mt-20 w-full">
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.75,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}
                    className="w-full md:w-auto flex justify-center"
                >
                    <div key={1} className="w-full md:w-auto">
                        <Button
                            asChild
                            size="lg"
                            // Button is full width on mobile (w-full), fixed width on desktop (md:w-72)
                            className="drop-shadow-xl/50 w-full md:w-72 group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                        >
                            <Link
                                href="/events"
                                className="flex items-center justify-center gap-3"
                                prefetch
                            >
                                <span className="text-nowrap text-2xl md:text-3xl">
                                    Explore Events
                                </span>
                            </Link>
                        </Button>
                    </div>
                </AnimatedGroup>
            </div>
        </section>
    );
}