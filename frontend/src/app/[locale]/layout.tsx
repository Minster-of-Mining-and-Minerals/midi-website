import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import NextTopLoader from 'nextjs-toploader';
import { NextIntlClientProvider } from 'next-intl';
import AuthProvider from "@/providers/AuthProvider";
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
  title: "MIDI - Mineral Industry Development Institute",
  description: "Official Portal of the Mineral Industry Development Institute (MIDI)",
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/favicon.ico', rel: 'icon' }
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/favicon_io/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-primary`}
      >
        <NextTopLoader color="#ba8200" showSpinner={false} />
        <NextIntlClientProvider>
          <AuthProvider>
            <ReduxProvider>
              {children}
              <Toaster richColors position="top-right" closeButton />
            </ReduxProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
