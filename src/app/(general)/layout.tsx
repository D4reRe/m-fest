import type { Metadata } from "next";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";
import HelpButton from "../help-button";

export const metadata: Metadata = {
  title: "Mechanical Festival 2026",
  description: "Official website of M-Fest for events and competitions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={`min-h-screen bg-black bg-cover`}
    >
      <Navbar />
      {children}
      <HelpButton />
      <FooterSection />
    </main>
  );
}
