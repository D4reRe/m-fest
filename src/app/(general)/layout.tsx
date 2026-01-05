import type { Metadata } from "next";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";
import HelpButton from "../help-button";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Mechanical Festival 2026",
  description: "Official website of M-Fest for events and competitions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`min-h-screen bg-[url('/darkbg.png')] bg-cover bg-center bg-fixed bg-repeat`}
    >
      <Navbar />
      {children}
      <HelpButton />
      <FooterSection />
    </main>
  );
}
