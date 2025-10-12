import { HeroHeader } from "@/app/(general)/_components/header";
import HeroSection from "@/app/(general)/_components/hero-section";
import FAQs from "./_components/faqs";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <main>
      <HeroHeader />
      <HeroSection />
      <FAQs />
      <FooterSection></FooterSection>
    </main>
  );
}
