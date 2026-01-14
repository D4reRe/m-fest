import SponsorItem from "./sponsor-item";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Sponsors() {
  return (
    <section className="py-16 bg-[url('/sponsslice.png')]">
      <BlurFade inView delay={0.2}>
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-6xl font-bold text-center mt-8">Our Sponsors</h2>
          <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            <SponsorItem
              icon="octicon"
              iconName="logo-github-16"
              alt="Github"
              height={8}
            />
            <SponsorItem
              icon="logos"
              iconName="nextjs"
              alt="Next.js"
              height={6}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="supabase"
              alt="Supabase"
              height={8}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="neon"
              alt="Neon DB"
              height={8}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="amd"
              alt="AMD"
              height={8}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="astro"
              alt="Astro"
              height={10}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="nuxt"
              alt="Nuxt"
              height={8}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="gitlab"
              alt="Gitlab"
              height={8}
              invert
            />
            <SponsorItem
              icon="logos"
              iconName="express"
              alt="Express"
              height={8}
              invert
            />
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
