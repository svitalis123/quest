import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { Inter, Geist_Mono } from "next/font/google";
import { ReadinessProvider } from "@/context/ReadinessContext";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ProfileSwitcher } from "@/components/common/ProfileSwitcher";
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReadinessProvider>
            <header role="banner" className="sticky top-0 z-30 bg-quest-primary px-4 py-3">
              <nav aria-label="Primary" className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                  <Image
                    src="/nova.png"
                    alt="Quest logo"
                    width={32}
                    height={32}
                    className="size-8"
                  />
                  Quest
                </span>
                <div className="flex items-center gap-2">
                  <ProfileSwitcher />
                  <ThemeToggle />
                </div>
              </nav>
            </header>

            <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-6">
              {children}
            </main>
          </ReadinessProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
