import type { Metadata } from "next";
// import { Navbar } from "@/components/general/Navbar";
// import FooterSection from "@/components/general/footer";
// import HelpButton from "../help-button";

export const metadata: Metadata = {
  title: "STEM Exam | Mechanical Festival 2026",
  description: "STEM Exam | Mechanical Festival 2026",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`min-h-screen bg-[url("/landing.webp")] bg-cover bg-center bg-fixed bg-repeat`}
    >
      {children}
    </main>
  );
}
