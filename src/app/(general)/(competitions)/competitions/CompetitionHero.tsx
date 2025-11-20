import { Cpu, Lock, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { competitions } from "@/lib/competition";
import { BlurFade } from "@/components/ui/blur-fade";

export default function CompetitionsHero() {
  return (
    <section className="overflow-hidden py-16 md:py-32">
      <BlurFade inView delay={1.2}>
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-semibold lg:text-5xl">
              Quickstart to parcticipate in our competitions
            </h2>
            <p className="mt-6 text-lg">
              Empower your team with workflows that adapt to your needs, whether
              you prefer git synchronization or a AI Agents interface.
            </p>
          </div>
          <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
            <div className="perspective-midrange">
              <div className="rotate-x-6 -skew-2">
                <div className="aspect-88/36 relative">
                  <Image
                    src="/competitions.png"
                    className="absolute inset-0 z-10"
                    alt="payments illustration dark"
                    width={2797}
                    height={1137}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
            {competitions.map((comp) => (
              <div
                key={comp.title}
                className="space-y-3 hover:scale-105 transition-all"
              >
                <div className="flex items-center gap-2">
                  {comp.icon === "Zap" ? (
                    <Zap className="size-4" />
                  ) : comp.icon === "Cpu" ? (
                    <Cpu className="size-4" />
                  ) : comp.icon === "Lock" ? (
                    <Lock className="size-4" />
                  ) : comp.icon === "Sparkles" ? (
                    <Sparkles className="size-4" />
                  ) : null}
                  <h3 className="text-sm font-medium">{comp.abbreviation}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{comp.title}</p>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
