import { montserrat, onest, roboto } from "@/styles/font";
import "./globals.css";
import "lenis/dist/lenis.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { ReactLenis } from "lenis/react";
import QueryTanstackProvider from "@/components/providers/query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${roboto.variable} ${onest.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="themed-bg-layer" />
          <ReactLenis root>
            <QueryTanstackProvider>
              <NextTopLoader showSpinner={false} height={3} />
              {children}
              <Toaster />
            </QueryTanstackProvider>
          </ReactLenis>
        </ThemeProvider>
      </body>
    </html>
  );
}
