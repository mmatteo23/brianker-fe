import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { Navbar } from "@/components/navbar";

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
      <body className="antialiased light">
        <div className="flex flex-col w-full h-screen gap-2 mx-auto">
          <Navbar />
          <main className="min-h-screen items-center justify-center font-['Laachir_Deeper'] text-zinc-950">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
