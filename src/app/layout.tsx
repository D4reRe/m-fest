import { montserrat, onest, roboto } from "@/styles/font";
// @ts-expect-error global.css exist
import "./globals.css";
// @ts-expect-error lenis.css exist
import "lenis/dist/lenis.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import SessionProviders from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
// import StoryblokProvider from "@/components/StoryblokProvider";
import NextTopLoader from "nextjs-toploader";
import { ReactLenis } from "lenis/react";

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
        <ReactLenis root>
          <SessionProviders>
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

              {children}

              <Toaster />
            </ThemeProvider>
          </SessionProviders>
        </ReactLenis>
      </body>
    </html>
  );
}
