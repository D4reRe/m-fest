import HeroSection from "@/components/general/hero-section";
import FAQs from "../../components/general/faqs";
import Sponsors from "@/components/sponsors";
import ContactSection from "@/components/contact/ContactSection";
import { TimelineTest } from "@/components/timeline/timeline-test";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TimelineTest />
      <Sponsors />
      <FAQs />
      <ContactSection />
    </main>
  );
}
