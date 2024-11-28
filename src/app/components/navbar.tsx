"use client";
import { Button } from "@/app/components/ui/button";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <a href="/">
        <img src="/images/copy.png" alt="Logo" className="h-8" />
      </a>
      <Button
        onClick={() => {
          window.open("https://warpcast.com", "_blank");
        }}
      >
        Brian Clanker
      </Button>
    </header>
  );
};
