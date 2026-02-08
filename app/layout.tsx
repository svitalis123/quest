import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ReadinessProvider } from "@/context/ReadinessContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quest — Learner Readiness",
  description: "Your personalised readiness dashboard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistMono.variable} antialiased bg-background text-quest-primary min-h-dvh`}
      >
        {/* Skip to content — visible on focus for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-quest-btn-bg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-quest-primary"
        >
          Skip to content
        </a>

        <ReadinessProvider>
          <header role="banner" className="sticky top-0 z-30 bg-quest-primary px-4 py-3">
            <nav aria-label="Primary">
              <span className="text-lg font-bold tracking-tight text-white">
                Quest
              </span>
            </nav>
          </header>

          <main id="main-content" className="mx-auto w-full max-w-lg px-4 py-6">
            {children}
          </main>
        </ReadinessProvider>
      </body>
    </html>
  );
}
