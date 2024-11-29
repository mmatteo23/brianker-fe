import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/providers";
import { Navbar } from "@/components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Briannah is tha best clanker",
  description: "Clanker but better",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased light`}
      >
        <div className="flex flex-col w-full h-screen gap-2 mx-auto">
          <Navbar />
          <main className="min-h-screen items-center justify-center text-zinc-950">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
