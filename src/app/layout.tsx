"use client";
import { montserrat, onest, roboto } from "@/styles/font";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProviders from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { HeroUIProvider } from "@heroui/react";
// import StoryblokProvider from "@/components/StoryblokProvider";
import NextTopLoader from "nextjs-toploader";
import RouteLoader from "@/components/general/RouteLoader";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${roboto.variable} ${onest.className} antialiased`}
      >
        <SessionProviders>
          <HeroUIProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="hsl(var(--primary))"
                height={10}
                showSpinner={true}
              />
              <Suspense>
                <RouteLoader />
              </Suspense>
              {children}

              <Toaster />
            </ThemeProvider>
          </HeroUIProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
