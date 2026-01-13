import { Timeline } from "@/components/ui/timeline";
import { BlurFade } from "../ui/blur-fade";

export function TimelineTest() {
  const timelineData = [
    {
      title: "February 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Pre-Program</p>
          <p className="text-2xl font-semibold">M-Care: Klinik Mesin</p>
        </div>
      ),
    },
    {
      title: "February 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Pre-Program</p>
          <p className="text-2xl font-semibold">
            M-Care: Hari Bermain Bersama (HMB)
          </p>
        </div>
      ),
    },
    {
      title: "February - April 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Starting Phase</p>
          <p className="text-2xl font-semibold">
            Competitions Registration and Submission
          </p>
        </div>
      ),
    },
    {
      title: "13 April 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Acceleration Phase</p>
          <p className="text-2xl font-semibold">M-Run and Engine Tune-Up</p>
        </div>
      ),
    },
    {
      title: "2 May 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Final Phase</p>
          <p className="text-2xl font-semibold">
            Competitions Final, M-Expo, and Solidarity Forever Summit
          </p>
        </div>
      ),
    },
    {
      title: "3 May 2026",
      content: (
        <div className="flex flex-col gap-2">
          <p className="text-4xl font-semibold">Ending Phase</p>
          <p className="text-2xl font-semibold">
            M-Talks, M-Expo, Solidarity Forever Summit, and Ceremony
          </p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 bg-[url('/timeslice.png')]">
      <div className="relative w-full mx-auto max-w-5xl" id="Timeline">
        <BlurFade inView delay={0.2}>
          <Timeline data={timelineData} />
        </BlurFade>
      </div>
    </section>
  );
}
