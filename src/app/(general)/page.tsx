import HeroSection from "@/components/general/hero-section";
import FAQs from "../../components/general/faqs";
import Timeline from "@/components/timeline/timeline";
import Sponsors from "@/components/sponsors";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Timeline />
      <Sponsors />
      <FAQs />
      <ContactSection />
    </main>
  );
}
