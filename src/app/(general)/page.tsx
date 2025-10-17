import HeroSection from "@/app/(general)/_components/hero-section";
import FAQs from "./_components/faqs";
import Timeline from "@/components/timeline/timeline";
import Sponsors from "@/components/sponsors";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Timeline />
      <Sponsors />
      <FAQs />
    </main>
  );
}
