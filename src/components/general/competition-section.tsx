import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import EventCard from "./eventcard";
import { events } from "@/lib/event";
import CompetitionCard from "./competition-card";
import { Competitions } from "@/components/general/competition-card";

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

export default function EventSection() {
    return(
        <section className="mask-b-from-90% mask-b-to-100% mask-t-from-80% mask-t-to-100% py-40 px-6 md:px-12 lg:px-24 bg-[url('/compeslice.png')] bg-cover bg-center">
            <div>
                <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="text-left text-7xl lg:mt-16[font-family:var(--font-next-montserrat)] font-bold mb-5"
                    >
                    Surely that’s not all of it?
                </TextEffect>
                <span className="mt-10 text-xl font-bold w-4/5 leading-relaxed text-white [font-family:var(--font-next-montserrat)]">
                    We also got plenty of competitons, no strings attached...
                </span>
            </div>

            <div className="flex justify-center">
                <h1 className="text-9xl font-bold mt-20 text-white [font-family:var(--font-next-montserrat)]">
                    Competitions
                </h1>
            </div>

            <div className="flex flex-row justify-center items-center gap-10 mt-20">
                {Competitions.map((Competition, index) => (
                    <CompetitionCard 
                        key={index}
                        href={Competition.href}
                        title={Competition.title}
                        card={Competition.card}
                    />
                ))}
            </div>

            <div className="flex justify-center mt-20">
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
                    <div
                      key={1}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="drop-shadow-xl/50 w-72 h-18 group relative overflow-hidden bg-slate-900/30 hover:bg-slate-800/50 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] rounded-xl px-6 py-6 text-lg transition-all duration-300shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      >
                        <Link
                          href="/competitions"
                          className="flex items-center justify-center gap-3"
                          prefetch
                        >
                          <span className="text-wrap text-center text-3xl mx-auto">Explore Competitions</span>
                        </Link>
                      </Button>
                    </div>
                  </AnimatedGroup>
            </div>
        </section>
    )
}