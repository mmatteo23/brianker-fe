"use client";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type TokenWithRequestor = {
  id: number;
  name: string;
  ticker: string;
  image: string;
  requestedBy: {
    fid: number;
    username: string;
    displayName: string;
    profileImage: string;
  };
  address: string;
  dateTime: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export const TokenDetails = ({
  token,
}: {
  token: TokenWithRequestor | undefined;
}) => {
  const { authenticated, user, login } = usePrivy();
  console.log({
    authenticated,
    user,
  });

  return (
    <>
      {token && (
        <div className="flex flex-col-reverse md:flex-row w-full gap-2 text-white">
          <div className="flex flex-col gap-2 bg-gray-900 p-2 rounded-xl w-full md:w-[60%]">
            <div className="flex flex-row gap-2">
              <Image
                src={token.image || `/images/copy.png`}
                alt={`${token.name} logo`}
                className="w-[60px] h-[60px] rounded-lg object-contain"
                width={60}
                height={60}
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold">{token.ticker}</p>
                <p className="text-lg">{token.name}</p>
              </div>
            </div>
            <div className="w-full bg-slate-300 rounded-xl h-[80vh] md:h-[60vh]">
              <iframe
                src="https://dexscreener.com/base/0xc1a6fbedae68e1472dbb91fe29b51f7a0bd44f97?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
                width="100%"
                height="100%"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
                loading="lazy"
                style={{ border: 0 }}
                aria-hidden="false"
                allow="fullscreen"
                z-index="0"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-[40%] flex-col-reverse md:flex-col">
            <div className="flex flex-col bg-gray-900 rounded-xl p-2 h-48">
              {authenticated ? (
                <>
                  <div className="flex flex-row gap-2 justify-between">
                    <Button className="w-1/2 bg-indigo-600">Buy</Button>
                    <Button className="w-1/2 bg-indigo-600">Sell</Button>
                  </div>
                </>
              ) : (
                <Button onClick={login} className="w-full bg-indigo-600">
                  Connect Wallet
                </Button>
              )}
            </div>
            <div className="flex flex-col bg-gray-900 rounded-xl p-2">
              <p className="text-2xl font-bold my-2 text-center">Token Info</p>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-row gap-4 justify-between my-4">
                <div className="flex flex-col w-1/2">
                  <p className="text-lg text-indigo-400 font-bold">Created</p>
                  {token.createdAt ? (
                    <div className="flex flex-col">
                      {`${formatDistanceToNow(new Date(token.createdAt))} ago`}
                      <span className="text-xs">
                        {`(${new Date(token.createdAt).toLocaleString()})`}
                      </span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-lg text-indigo-400 font-bold">Chain</p>
                  <p className="text-lg flex flex-row gap-2 items-center">
                    <Image
                      src="/images/base.png"
                      alt="Base logo"
                      width={24}
                      height={24}
                      className="w-[24px] h-[24px]"
                    />
                    Base Sepolia
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-between my-4">
                <div className="flex flex-col w-1/2">
                  <p className="text-lg text-indigo-400 font-bold">
                    Requested By
                  </p>
                  {token.requestedBy ? (
                    <Link
                      href={`https://warpcast.com/${token.requestedBy.username}`}
                      target="_blank"
                    >
                      <div className="flex flex-row">
                        <Image
                          src={token.requestedBy.profileImage}
                          alt={token.requestedBy.username}
                          width={24}
                          height={24}
                          className="w-[24px] h-[24px] rounded-full"
                        />
                        <span className="ml-2">
                          {token.requestedBy.displayName}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-lg text-indigo-400 font-bold">
                    Total Supply
                  </p>
                  <p className="text-lg">{"$1M"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
