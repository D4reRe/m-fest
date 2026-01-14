import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";

const transitionVariants = {
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
                <section className=" relative min-h-[100vh] pb-16 pt-45 md:pb-32 lg:pt-16">
                    <span className="absolute bottom-20 left-10">
                        <TextEffect
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            as="h1"
                            className="text-left text-9xl lg:mt-16[font-family:var(--font-next-montserrat)] font-bold"
                        >
                            Mechanical
                        </TextEffect>

                        <TextEffect
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            as="h1"
                            className="text-left text-9xl [font-family:var(--font-next-montserrat)] font-bold"
                        >
                            Festival 2026
                        </TextEffect>

                        <TextEffect
                            per="line"
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            delay={0.5}
                            as="p"
                            className="max-w-2xl text-left text-xl [font-family:var(--font-next-montserrat)] font-semibold"
                        >
                            Transforming Visions. Into Motions
                        </TextEffect>
                    </span>

                    <span className="absolute right-10 bottom-10 flex flex-col gap-4 md:flex-row pb-20 pr-20">
                        <div className="flex flex-col gap-4">
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
                            >
                                <div key={1}>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="drop-shadow-xl/50 w-72 group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]  duration-300shadow-[0_0_20px_rgba(0,0,0,0.1)] "
                                    >
                                        <Link
                                            href="/events"
                                            className="flex items-center gap-3"
                                            prefetch
                                        >
                                            <span className="text-nowrap text-3xl">
                                                Explore Events
                                            </span>
                                            <img
                                                src="/eventbuttonlogo.svg"
                                                alt="Rocket"
                                                className="relative size-7"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>

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
                            >
                                <div key={1}>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="drop-shadow-xl/50 w-72 h-18 group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]  duration-300shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                                    >
                                        <Link
                                            href="/competitions"
                                            className="flex items-center gap-3"
                                            prefetch
                                        >
                                            <span className="text-wrap text-3xl">
                                                Explore Competitions
                                            </span>
                                            <img
                                                src="/compbuttonlogo.svg"
                                                alt="Rocket"
                                                className="relative size-7"
                                            />
                                        </Link>
                                    </Button>
                                </div>
                            </AnimatedGroup>
                        </div>
                    </span>
                </section>
            </main>
        </>
    );
}
