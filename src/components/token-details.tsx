"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import { formatUnits, getAddress, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";

import { SwapRouterABI, SwapRouterAddress } from "@/abis/SwapRouter";
import { ierc20ABI } from "@/abis/ierc20ABI";

interface SwapParams {
  zeroForOne: boolean;
  amountSpecified: bigint;
  sqrtPriceLimitX96: bigint;
}

interface TestSettings {
  takeClaims: boolean;
  settleUsingBurn: boolean;
}

type TransactionStatus = "awaiting" | "processing" | "success" | "error" | null;

const MIN_PRICE_LIMIT = BigInt(4295128740);
const MAX_PRICE_LIMIT =
  BigInt(146144670348521010328727305220398882237872397034);

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { TokenWithRequestor } from "@/utils/db";
import { Badge } from "./ui/badge";

export const TokenDetails = ({
  token,
}: {
  token: TokenWithRequestor | undefined;
}) => {
  const { authenticated, login } = usePrivy();
  const { address } = useAccount();
  const [zeroForOne, setZeroForOne] = useState<boolean>(true);
  const [inputPrice, setInputPrice] = useState<string>("0");
  const [parsedInput, setParsedInput] = useState<string>("0");
  const [displayPrice, setDisplayPrice] = useState<string>("0");
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [allowance, setAllowance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(null);

  console.log({
    token,
  });

  const {
    data: swapTxHash,
    writeContract: swap,
    isPending: isSwapPending,
  } = useWriteContract();
  const {
    data: approveTxHash,
    writeContract: approve,
    isPending: isApprovePending,
  } = useWriteContract();

  const {
    isLoading: isApproveConfirming,
    isSuccess: isApproveConfirmed,
    isError: isApproveErrored,
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const {
    isLoading: isSwapConfirming,
    isSuccess: isSwapConfirmed,
    isError: isSwapErrored,
  } = useWaitForTransactionReceipt({
    hash: swapTxHash,
  });

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { data: tokenBalance } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ierc20ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  const { data: allowanceResult } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ierc20ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, SwapRouterAddress as `0x${string}`],
  });

  console.log({
    ethBalance,
    tokenBalance,
    allowanceResult,
  });

  // Handle transaction status updates
  useEffect(() => {
    if (isApprovePending || isSwapPending) {
      setTxStatus("awaiting");
    } else if (isApproveConfirming || isSwapConfirming) {
      setTxStatus("processing");
    } else if (isApproveConfirmed || isSwapConfirmed) {
      setTxStatus("success");
      setTimeout(() => setTxStatus(null), 3000);
    } else if (isApproveErrored || isSwapErrored) {
      setTxStatus("error");
      setTimeout(() => setTxStatus(null), 3000);
    }
  }, [
    isApprovePending,
    isSwapPending,
    isApproveConfirming,
    isSwapConfirming,
    isApproveConfirmed,
    isSwapConfirmed,
    isApproveErrored,
    isSwapErrored,
  ]);

  // Handle automatic swap after approval
  useEffect(() => {
    if (isApproveConfirmed && token) {
      const params: SwapParams = {
        zeroForOne: false,
        amountSpecified: BigInt(-parsedInput),
        sqrtPriceLimitX96: MAX_PRICE_LIMIT,
      };

      const testSettings: TestSettings = {
        takeClaims: false,
        settleUsingBurn: false,
      };

      swap({
        address: SwapRouterAddress as `0x${string}`,
        abi: SwapRouterABI,
        functionName: "swap",
        args: [
          {
            currency0: "0x0000000000000000000000000000000000000000",
            currency1: token.address as `0x${string}`,
            fee: 3000,
            tickSpacing: 60,
            hooks: "0x50e8CED6ca2FA2840827b7DcC748C775277a48C0",
          },
          params,
          testSettings,
          "0x",
        ],
        chain: baseSepolia,
        account: address,
      });
    }
  }, [address, isApproveConfirmed, parsedInput, swap, token]);

  // Update allowance when result changes
  useEffect(() => {
    if (allowanceResult) {
      setAllowance(allowanceResult.toString());
    }
  }, [allowanceResult]);

  // Update current balance based on selected token
  useEffect(() => {
    console.log("getting new balance for", zeroForOne ? "ETH" : token?.ticker);
    if (zeroForOne) {
      setCurrentBalance(
        formatUnits(ethBalance ? ethBalance.value : BigInt(0), 18),
      );
    } else {
      setCurrentBalance(
        formatUnits(tokenBalance ? BigInt(tokenBalance) : BigInt(0), 18),
      );
    }
  }, [zeroForOne, ethBalance, tokenBalance]);

  const handleBuy = () => {
    setZeroForOne(true);
    setDisplayPrice("0");
    setInputPrice("0");
  };

  const handleSell = () => {
    setZeroForOne(false);
    setDisplayPrice("0");
    setInputPrice("0");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setInputPrice(value);
    setParsedInput(parseEther(value).toString());
  };

  const handleSwap = async () => {
    if (!address || !token) return;
    setIsLoading(true);

    try {
      const poolKey = {
        currency0:
          "0x0000000000000000000000000000000000000000" as `0x${string}`,
        currency1: getAddress(token.address),
        fee: 3000,
        tickSpacing: 60,
        hooks: "0x50e8CED6ca2FA2840827b7DcC748C775277a48C0" as `0x${string}`,
      };
      const testSettings: TestSettings = {
        takeClaims: false,
        settleUsingBurn: false,
      };
      if (zeroForOne) {
        const params: SwapParams = {
          zeroForOne,
          amountSpecified: BigInt(-parsedInput),
          sqrtPriceLimitX96: MIN_PRICE_LIMIT,
        };

        swap({
          address: SwapRouterAddress as `0x${string}`,
          abi: SwapRouterABI,
          functionName: "swap",
          args: [poolKey, params, testSettings, "0x"],
          chain: baseSepolia,
          account: address,
          value: BigInt(parsedInput),
        });
      } else {
        if (BigInt(allowance) < parseEther(inputPrice)) {
          approve({
            address: token.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [SwapRouterAddress, parseEther(inputPrice)],
          });
        } else {
          const params: SwapParams = {
            zeroForOne: false,
            amountSpecified: BigInt(-parsedInput),
            sqrtPriceLimitX96: MAX_PRICE_LIMIT,
          };

          swap({
            address: SwapRouterAddress as `0x${string}`,
            abi: SwapRouterABI,
            functionName: "swap",
            args: [poolKey, params, testSettings, "0x"],
            chain: baseSepolia,
            account: address,
          });
        }
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setTxStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const isSwapDisabled =
    isLoading ||
    isSwapPending ||
    isSwapConfirming ||
    isApprovePending ||
    isApproveConfirming ||
    !authenticated;

  const isTradingAvailable = token
    ? new Date(token.dateTime) > new Date(new Date().toUTCString())
    : false;

  return (
    <>
      {token && (
        <div className="flex flex-col-reverse md:flex-row w-full gap-2 text-white">
          <div className="flex flex-col gap-2 bg-gray-900 p-2 rounded-xl w-full md:w-[60%]">
            <div className="flex flex-row gap-2">
              <Image
                src={token.image || `/images/default-token.jpg`}
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
            {authenticated ? (
              <>
                {token?.dateTime && isTradingAvailable && (
                  <div className="bg-red-500 text-red-200 p-4 rounded-xl mb-2 text-center">
                    Trading not yet available - opens at{" "}
                    {new Date(token.dateTime).toLocaleString()}
                  </div>
                )}
                <div
                  className={`flex flex-col gap-2 bg-gray-900 rounded-xl p-2 ${isTradingAvailable ? "opacity-30" : ""}`}
                >
                  <div className="flex flex-row gap-2 justify-between h-12">
                    <Button
                      className={`w-1/2 ${zeroForOne ? "bg-green-600" : "bg-slate-600"} hover:bg-green-700`}
                      onClick={handleBuy}
                      disabled={isTradingAvailable}
                    >
                      Buy
                    </Button>
                    <Button
                      className={`w-1/2 ${!zeroForOne ? "bg-red-600" : "bg-slate-600"} hover:bg-red-700`}
                      onClick={handleSell}
                      disabled={isTradingAvailable}
                    >
                      Sell
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-col">
                      <div className="w-full bg-transparent text-white flex items-center rounded-md h-[40px] gap-2">
                        <Input
                          type="text"
                          placeholder="0"
                          value={inputPrice}
                          onChange={handlePriceChange}
                          className="bg-transparent text-3xl md:text-4xl text-white font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          disabled={isTradingAvailable}
                        />
                        <div className="flex flex-col items-end gap-2">
                          <Badge className="bg-slate-800 text-xl w-fit">
                            {zeroForOne ? "ETH" : token?.ticker}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 min-w-[200px] text-right whitespace-nowrap">
                        Balance: {Number(currentBalance).toFixed(4)}{" "}
                        {zeroForOne ? "ETH" : token?.ticker}
                        <Button
                          variant="ghost"
                          className="text-sm p-0 text-indigo-600 font-bold ml-2 hover:bg-transparent hover:text-indigo-500"
                          onClick={() => {
                            setInputPrice(
                              zeroForOne
                                ? Number(currentBalance).toFixed(8)
                                : Number(tokenBalance || "0").toFixed(8),
                            );
                            setParsedInput(
                              parseEther(
                                zeroForOne
                                  ? currentBalance
                                  : tokenBalance?.toString() || "0",
                              ).toString(),
                            );
                          }}
                        >
                          Max
                        </Button>
                      </p>
                      <p className="text-lg text-center">
                        Swapping you will receive{" "}
                        <span className="text-indigo-400 font-bold">
                          {zeroForOne ? token?.ticker : "ETH"}
                        </span>
                        {/* {displayPrice} */}
                      </p>
                    </div>

                    <Button
                      onClick={handleSwap}
                      disabled={isSwapDisabled || isTradingAvailable}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isSwapPending || isSwapConfirming
                        ? "Processing..."
                        : "Execute Swap"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Button
                onClick={login}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Connect Wallet
              </Button>
            )}

            <div className="flex flex-col bg-gray-900 rounded-xl p-2">
              <p className="text-2xl font-bold mb-4 text-center my-4">
                Token Info
              </p>
              <hr className="border-gray-700 mb-4" />
              <div className="flex flex-row gap-4 justify-between">
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
              <div className="flex flex-col gap-4 justify-between my-4">
                <div className="flex flex-row gap-2 w-full">
                  <Link href={`/token/${token.id}`} className="w-1/2">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 w-full"
                      size="lg"
                    >
                      Share
                    </Button>
                  </Link>
                  <Link
                    href={`https://base-sepolia.blockscout.com/token/${token.address}`}
                    target="_blank"
                    className="w-1/2"
                  >
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 w-full"
                      size="lg"
                    >
                      Explorer
                    </Button>
                  </Link>
                </div>
                <Button
                  className="w-full bg-gray-700 hover:bg-gray-800 py-[1.8em] font-bold"
                  onClick={(e) => {
                    const element = e.currentTarget;
                    navigator.clipboard.writeText(token.address);
                    element.innerText = "Copied!";
                    setTimeout(() => {
                      if (element) {
                        element.innerText = `${token.address.slice(
                          0,
                          5,
                        )}...${token.address.slice(token.address.length - 4)} (Click to Copy)`;
                      }
                    }, 1500);
                  }}
                >
                  {`${token.address.slice(0, 5)}...${token.address.slice(token.address.length - 4)}`}{" "}
                  (Click to Copy)
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Status Notification */}
          {txStatus && (
            <div
              className={`fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-lg p-4 flex items-center gap-3 transition-all duration-500`}
            >
              {txStatus === "awaiting" && (
                <>
                  <div className="animate-pulse h-4 w-4 bg-yellow-500 rounded-full"></div>
                  <span>Awaiting Confirmation...</span>
                </>
              )}
              {txStatus === "processing" && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Processing Transaction...</span>
                </>
              )}
              {txStatus === "success" && (
                <>
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  <span>Transaction Successful!</span>
                </>
              )}
              {txStatus === "error" && (
                <>
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                  <span>Transaction Failed!</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TokenDetails;
