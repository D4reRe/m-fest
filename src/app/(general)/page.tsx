import HeroSection from "@/app/(general)/_components/hero-section";
import FAQs from "./_components/faqs";
import EventsSection from "@/components/events";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <EventsSection />
      <FAQs />
    </main>
  );
}
