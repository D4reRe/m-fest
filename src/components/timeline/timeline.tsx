import { InfiniteSlider } from "@/components/ui/infinite-slider";
import TimelineItem from "./timeline-item";

export default function Timeline() {
  return (
    <section className="bg-background/0 overflow-hidden py-16" id="timeline">
      <h1 className="text-6xl font-bold text-center mt-8">Timeline</h1>
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-20 md:border-r md:pr-6">
            <p className="text-end text-base">See our timelines</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)] mt-12">
            <InfiniteSlider speed={40} gap={112}>
              <TimelineItem
                icon="octicon"
                iconName="logo-github-16"
                alt="Github"
                height={8}
              />
              <TimelineItem
                icon="logos"
                iconName="nextjs"
                alt="Next.js"
                height={6}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="supabase"
                alt="Supabase"
                height={8}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="neon"
                alt="Neon DB"
                height={8}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="amd"
                alt="AMD"
                height={8}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="astro"
                alt="Astro"
                height={10}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="nuxt"
                alt="Nuxt"
                height={8}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="gitlab"
                alt="Gitlab"
                height={8}
                invert
              />
              <TimelineItem
                icon="logos"
                iconName="express"
                alt="Express"
                height={8}
                invert
              />
            </InfiniteSlider>
            {/* <div className="bg-linear-to-r from-background/0 absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background/0 absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            /> */}
          </div>
        </div>
      </div>
    </section>
  );
}
