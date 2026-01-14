import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
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
                type: "spring" as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

export default function HeroSection() {
    return (
        <>
            <main className="overflow-hidden">
                <section className="relative min-h-[100dvh] w-full flex flex-col justify-end pb-10 px-6 pt-24 md:pb-20 md:px-12 lg:pt-16">
                    
                    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between w-full max-w-[1600px] mx-auto">
                        
                        {/* --- TEXT SECTION --- */}
                        <div className="flex flex-col gap-2 md:gap-6 z-10">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-left text-5xl md:text-8xl [font-family:var(--font-next-montserrat)] font-bold leading-tight"
                            >
                                Mechanical
                            </TextEffect>

                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-left text-5xl md:text-8xl [font-family:var(--font-next-montserrat)] font-bold leading-tight"
                            >
                                Festival 2026
                            </TextEffect>

                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="max-w-2xl text-left text-lg md:text-xl [font-family:var(--font-next-montserrat)] font-semibold mt-2 md:mt-0"
                            >
                                Transforming Visions. Into Motions
                            </TextEffect>
                        </div>

                        {/* --- BUTTONS SECTION --- */}
                        <div className="flex flex-col gap-4 z-10 w-full md:w-auto">
                            
                            {/* BUTTON 1: Explore Events */}
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
                                className="flex flex-col gap-4"
                            >
                                <div key={1} className="w-full">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="drop-shadow-xl/50 w-full md:w-72 h-auto group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-5 md:py-6 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                    >
                                        <Link
                                            href="/events"
                                            className="flex items-center justify-center gap-3 w-full"
                                            prefetch
                                        >
                                            <span className="text-xl md:text-3xl font-semibold">
                                                Explore Events
                                            </span>
                                            <img
                                                src="/eventbuttonlogo.svg"
                                                alt="Rocket"
                                                className="relative size-6 md:size-7"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>

                            {/* BUTTON 2: Explore Competitions */}
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
                                className="flex flex-col gap-4"
                            >
                                <div key={1} className="w-full">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="drop-shadow-xl/50 w-full md:w-72 h-auto group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-5 md:py-6 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                    >
                                        <Link
                                            href="/competitions"
                                            className="flex items-center text-left gap-3 w-full"
                                            prefetch
                                        >
                                            {/* Two lines logic: added <br/> and leading-none */}
                                            <span className="text-xl md:text-3xl font-semibold text-left leading-none">
                                                Explore <br /> Competitions
                                            </span>
                                            <img
                                                src="/compbuttonlogo.svg"
                                                alt="Rocket"
                                                className="relative size-6 md:size-7"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>

                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}