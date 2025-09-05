import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Roboto_Mono } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { MainLayout } from "@/app/_components/main-layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import StoreProvider from "@/store/provider";
import { CustomThemeProvider } from "@/components/custom-theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Investment Tracker",
  description: "Track your investments and portfolio performance",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${inter.variable} ${dmSans.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CustomThemeProvider />
          <StoreProvider>
            <AuthProvider>
              <TRPCReactProvider>
                <MainLayout>{children}</MainLayout>
                <Toaster />
              </TRPCReactProvider>
            </AuthProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
