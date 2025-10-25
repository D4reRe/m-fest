import type { Metadata } from "next";
import { Navbar } from "@/components/general/Navbar";
import FooterSection from "@/components/general/footer";
import { getUserProfile } from "@/action/user.action";
import { User } from "@prisma/client";

export const metadata: Metadata = {
  title: "Mechanical Festival 2026",
  description: "official website of M-Fest for events and competitions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: User = (await getUserProfile()) as User;
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
