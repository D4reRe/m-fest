"use client";
import { montserrat, onest, roboto } from "@/styles/font";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProviders from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { HeroUIProvider } from "@heroui/react";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

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
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}

              <Toaster />
            </ThemeProvider>
          </HeroUIProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
