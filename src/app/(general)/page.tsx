import HeroSection from "@/components/general/hero-section";
import FAQs from "../../components/general/faqs";
import Sponsors from "@/components/sponsors";
import ContactSection from "@/components/contact/ContactSection";
import { TimelineTest } from "@/components/timeline/timeline-test";
import AboutSection from "@/components/general/about-section";
import EventSection from "@/components/general/event-section";
import CompetitionSection from "@/components/general/competition-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <EventSection/>
      <CompetitionSection />
      <TimelineTest />
      <Sponsors />
      <FAQs />
      <ContactSection />
    </main>
  );
}
