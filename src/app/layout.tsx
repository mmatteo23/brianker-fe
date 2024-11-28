import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/app/components/navbar";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "frames.js starter",
  description: "...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col w-full h-screen gap-2 mx-auto">
          <Navbar />
          <main className="flex-grow p-4">{children}</main>
          <footer className="p-4 sticky bottom-0 bg-black text-white">
            Naaaaaamo Brian Clanker
          </footer>
        </div>
      </body>
    </html>
  );
}
