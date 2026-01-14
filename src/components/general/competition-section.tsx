import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import CompetitionCard from "./competition-card";
import { Competitions } from "@/components/general/competition-card";
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

export default function CompetitionSection() {
    return (
        <section className="py-24 px-6 md:py-40 md:px-12 lg:px-24">
            <div>
                <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    // Responsive text size: 5xl on mobile, 7xl on desktop
                    className="text-left text-5xl md:text-7xl lg:mt-16 [font-family:var(--font-next-montserrat)] font-bold mb-5 leading-tight"
                >
                    Surely that’s not all of it?
                </TextEffect>
                {/* Responsive width: w-full on mobile, w-4/5 on desktop */}
                <span className="mt-6 md:mt-10 text-lg md:text-xl font-bold w-full md:w-4/5 leading-relaxed text-white [font-family:var(--font-next-montserrat)] block">
                    We also got plenty of competitions, no strings attached...
                </span>
            </div>

            <div className="flex justify-center">
                {/* Responsive text size: 6xl on mobile, 9xl on desktop */}
                <h1 className="text-6xl md:text-9xl font-bold mt-12 md:mt-20 text-white [font-family:var(--font-next-montserrat)] text-center">
                    Competitions
                </h1>
            </div>

            {/* Layout Switch: flex-col (vertical) on mobile, flex-row (horizontal) on desktop */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-10 md:mt-20 w-full">
                {Competitions.map((Competition, index) => (
                    <CompetitionCard
                        key={index}
                        href={Competition.href}
                        title={Competition.title}
                        card={Competition.card}
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
                            // Button: w-full on mobile, fixed w-72 on desktop
                            className="drop-shadow-xl/50 w-full md:w-72 h-auto group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] rounded-xl px-6 py-8 md:py-12 text-lg transition-all duration-300"
                        >
                            <Link
                                href="/competitions"
                                className="flex items-center justify-center gap-3"
                                prefetch
                            >
                                <span className="text-wrap text-center text-2xl md:text-3xl mx-auto leading-none">
                                    Explore Competitions
                                </span>
                            </Link>
                        </Button>
                    </div>
                </AnimatedGroup>
            </div>
        </section>
    );
}