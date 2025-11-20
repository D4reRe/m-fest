"use client";

import type { Metadata } from "next";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`min-h-screen bg-[url("/landing.webp")] bg-cover bg-center bg-fixed bg-repeat`}
    >
      <Navbar />
      {children}
      <FooterSection />
    </main>
  );
}
