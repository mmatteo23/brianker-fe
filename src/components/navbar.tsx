"use client";

import { usePrivy } from "@privy-io/react-auth";

import Image from "next/image";
import Link from "next/link";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { user, authenticated, login, logout } = usePrivy();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const address = user?.wallet?.address;

  const handleSwitchChain = () => {
    if (chain?.id !== mainnet.id) {
      switchChain({ chainId: mainnet.id });
    } else {
      switchChain({ chainId: baseSepolia.id });
    }
  };

  return (
    <nav className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
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
            className="size-[24px]"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {authenticated ? (
          <div className="flex items-center gap-2">
            <span>{`${address?.slice(0, 4)}...${address?.slice(-4)}`}</span>
            <span>{chain?.name}</span>
            <Button onClick={logout}>Logout</Button>
            <Button onClick={handleSwitchChain}>Switch Chain</Button>
          </div>
        ) : (
          <Button onClick={login}>Login</Button>
        )}
      </div>
    </nav>
  );
};
