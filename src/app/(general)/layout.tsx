import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { montserrat, onest, roboto } from "@/styles/font";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";
import { getUserProfile } from "@/action/user.action";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mechanical Festival 2026",
  description: "official website of M-Fest for events and competitions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserProfile();
  return (
    <main
      className={`min-h-screen bg-[url("/landing.png")] bg-cover bg-center bg-fixed bg-repeat`}
    >
      <Navbar user={user} />
      {children}
      <FooterSection />
    </main>
  );
}
