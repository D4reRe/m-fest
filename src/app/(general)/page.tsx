import HeroSection from "@/app/(general)/_components/hero-section";
import FAQs from "./_components/faqs";
import EventsSection from "@/components/events";
import Timeline from "@/components/timeline/timeline";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Timeline />
      <FAQs />
    </main>
  );
}
