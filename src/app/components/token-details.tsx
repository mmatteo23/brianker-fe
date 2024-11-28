"use client";

import { Token } from "@/utils/schemas/db.schema";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const TokenDetails = () => {
  const pathname = usePathname();
  const tokenAddress = pathname.split("/").pop();

  const [token, setToken] = useState<Token | undefined>(undefined);

  if (!tokenAddress) {
    return <div>Token not found</div>;
  }

  useEffect(() => {
    async function getTokenFromDb(tokenAddress: string) {
      const tokenResult = await fetch(`/api/token?address=${tokenAddress}`);
      const { data: token } = await tokenResult.json();
      setToken(token);
    }
    if (tokenAddress) {
      getTokenFromDb(tokenAddress);
    }
  }, [tokenAddress]);

  return (
    <>
      {token && (
        <div className="flex flex-col-reverse md:flex-row w-full gap-2">
          <div className="flex flex-col gap-2 bg-slate-400 p-2 rounded-xl w-full md:w-[60%]">
            <div className="flex flex-row gap-2">
              <img
                src={`/images/copy.png`}
                alt={token.name}
                className="w-[60px] h-[60px] rounded-lg"
              />
              <div className="flex flex-col">
                <p className="text-xl font-bold">{token.ticker}</p>
                <p className="text-lg">{token.name}</p>
              </div>
            </div>
            <div className="h-96 w-full bg-slate-300 rounded-lg"></div>
          </div>
          <div className="flex gap-2 w-full md:w-[40%] flex-col-reverse md:flex-col">
            <div className="flex flex-row gap-2 justify-between bg-slate-400 rounded-xl p-2 h-48">
              <Button className="w-1/2">Buy</Button>
              <Button className="w-1/2">Sell</Button>
            </div>
            <div className="flex flex-col bg-slate-400 rounded-xl p-2">
              <p className="text-2xl font-bold mb-4">Token Info</p>
              <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-col w-1/2">
                  <p className="text-lg">Created at</p>
                  <p className="text-lg font-bold">{token.createdAt}</p>
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-lg">Market Cap</p>
                  <p className="text-lg font-bold">{"$10.89M"}</p>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-between">
                <div className="flex flex-col w-1/2">
                  <p className="text-lg">Chain</p>
                  <p className="text-lg font-bold">Base</p>
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-lg">24H VOLUME</p>
                  <p className="text-lg font-bold">{"$6.76M"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};