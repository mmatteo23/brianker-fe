"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <a href="/">
        <Image
          src="/images/copy.png"
          alt="Logo"
          className="h-8"
          width={32}
          height={32}
        />
      </a>
      <Button
        onClick={() => {
          window.open("https://warpcast.com/briannah", "_blank");
        }}
      >
        Brian Clanker
      </Button>
    </header>
  );
};
