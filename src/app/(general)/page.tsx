import HeroSection from "@/app/(general)/_components/hero-section";
import FAQs from "./_components/faqs";
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
