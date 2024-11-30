"use client";

import { usePrivy } from "@privy-io/react-auth";

import Image from "next/image";
import Link from "next/link";
import {
  useAccount,
  // useSwitchChain
} from "wagmi";
// import { baseSepolia, mainnet } from "wagmi/chains";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { user, authenticated, login, logout } = usePrivy();
  const { chain } = useAccount();
  // const { switchChain } = useSwitchChain();
  const address = user?.wallet?.address;

  // const handleSwitchChain = () => {
  //   if (chain?.id !== mainnet.id) {
  //     switchChain({ chainId: mainnet.id });
  //   } else {
  //     switchChain({ chainId: baseSepolia.id });
  //   }
  // };

  return (
    <nav className="flex flex-col justify-between md:flex-row px-4 py-2">
      <div className="flex items-center justify-between gap-2">
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
        <div className="flex md:hidden items-center gap-2">
          {authenticated ? (
            <Button onClick={logout}>Logout</Button>
          ) : (
            <Button onClick={login}>Login</Button>
          )}
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
      </div>
      <div className="flex flex-row justify-between items-center gap-2">
        {authenticated ? (
          <div className="flex items-center my-[1em] md:my-0 justify-between w-full md:w-fit gap-2">
            <code>{`${address?.slice(0, 5)}...${address?.slice(-4)}`}</code>
            <p className="flex gap-2">
              <Image
                src="/images/base.png"
                alt="Base logo"
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
              {chain?.name}
            </p>
            <Button onClick={logout} className="hidden md:flex">
              Logout
            </Button>
            {/* <Button onClick={handleSwitchChain}>Switch Chain</Button> */}
          </div>
        ) : (
          <Button onClick={login} className="hidden md:flex">
            Login
          </Button>
        )}
        <Link
          href="https://warpcast.com/briannah"
          target="_blank"
          className="bg-[#8A63D2] text-white rounded-xl p-2 flex items-center gap-2 hidden md:flex"
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
    </nav>
  );
};
