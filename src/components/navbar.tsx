"use client";

import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <a href="/" className="flex items-center gap-2">
        <Image
          src="/images/briannah.png"
          alt="Logo"
          width={32}
          height={32}
          className="size-[32px] rounded-xl"
        />
        <span className="text-2xl font-bold">Briannah</span>
      </a>
      <Link
        href="https://warpcast.com/briannah"
        target="_blank"
        className="bg-[#8A63D2] text-white rounded-xl p-2 flex items-center gap-2"
      >
        <Image
          src="/images/farcaster.png"
          alt="Farcaster"
          width={24}
          height={24}
          className="size-[24px] sm:size-[32px]"
        />
        <span className="text-sm sm:text-base">Follow me ;)</span>
      </Link>
    </header>
  );
};
