'use client';

import type { Metadata } from "next";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";

export const metadata: Metadata = {
  title: "Mechanical Festival 2026",
  description: "Official website of M-Fest for events and competitions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
