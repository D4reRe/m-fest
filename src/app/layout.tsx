import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { montserrat, onest, roboto } from "@/styles/font";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProviders from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${roboto.variable} ${onest.className} antialiased min-h-screen bg-[url("/landing.png")] bg-cover bg-center bg-fixed`}
      >
        <SessionProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
