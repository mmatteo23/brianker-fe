"use client";
import React, { useState, useEffect } from 'react';
import { Token } from "@/utils/schemas/db.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { baseSepolia } from 'viem/chains';
import { formatUnits, parseEther } from 'viem';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance
} from 'wagmi';

import { SwapRouterABI, SwapRouterAddress } from '@/abis/SwapRouter';
import { ierc20ABI } from '@/abis/ierc20ABI';

interface SwapParams {
  zeroForOne: boolean;
  amountSpecified: bigint;
  sqrtPriceLimitX96: bigint;
}

interface TestSettings {
  takeClaims: boolean;
  settleUsingBurn: boolean;
}

type TransactionStatus = 'awaiting' | 'processing' | 'success' | 'error' | null;

const MIN_PRICE_LIMIT = BigInt(4295128740);
const MAX_PRICE_LIMIT = BigInt(146144670348521010328727305220398882237872397034);

const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  }
] as const;

export const TokenDetails = ({ token }: { token: Token | undefined }) => {
  const { authenticated, user, login, logout } = usePrivy();
  const { address } = useAccount();
  const [zeroForOne, setZeroForOne] = useState<boolean>(true);
  const [inputPrice, setInputPrice] = useState<string>('0');
  const [parsedInput, setParsedInput] = useState<string>('0');
  const [displayPrice, setDisplayPrice] = useState<string>('0');
  const [currentBalance, setCurrentBalance] = useState<string>('0');
  const [allowance, setAllowance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>(null);

  const { data: swapTxHash, writeContract: swap, isPending: isSwapPending, isSuccess: isSwapSuccess, error: swapError } = useWriteContract();
  const { data: approveTxHash, writeContract: approve, isPending: isApprovePending, isSuccess: isApproveSuccess, error: approveError } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed, isError: isApproveErrored } = useWaitForTransactionReceipt({
    hash: approveTxHash
  });

  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed, isError: isSwapErrored } = useWaitForTransactionReceipt({
    hash: swapTxHash
  });

  const { data: ethBalance } = useBalance({
    address: address,
  });

  const { data: tokenBalance } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ierc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
   
  });

  const { data: allowanceResult } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ierc20ABI,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      SwapRouterAddress as `0x${string}`
    ],

  });

  // Handle transaction status updates
  useEffect(() => {
    if (isApprovePending || isSwapPending) {
      setTxStatus('awaiting');
    } else if (isApproveConfirming || isSwapConfirming) {
      setTxStatus('processing');
    } else if (isApproveConfirmed || isSwapConfirmed) {
      setTxStatus('success');
      setTimeout(() => setTxStatus(null), 3000);
    } else if (isApproveErrored || isSwapErrored) {
      setTxStatus('error');
      setTimeout(() => setTxStatus(null), 3000);
    }
  }, [
    isApprovePending, isSwapPending,
    isApproveConfirming, isSwapConfirming,
    isApproveConfirmed, isSwapConfirmed,
    isApproveErrored, isSwapErrored
  ]);

  // Handle automatic swap after approval
  useEffect(() => {
    if (isApproveConfirmed) {
      const params: SwapParams = {
        zeroForOne: false,
        amountSpecified: BigInt(-parsedInput),
        sqrtPriceLimitX96: MAX_PRICE_LIMIT
      };

      const testSettings: TestSettings = {
        takeClaims: false,
        settleUsingBurn: false
      };

      swap({
        address: SwapRouterAddress as `0x${string}`,
        abi: SwapRouterABI,
        functionName: 'swap',
        args: [
          {
            currency0: "0x0000000000000000000000000000000000000000",
            currency1: "0xA788b3D74CE0125263BDaF4Ebe726dd78FE54954" as `0x${string}`,
            fee: 3000,
            tickSpacing: 60,
            hooks: '0x50e8CED6ca2FA2840827b7DcC748C775277a48C0'
          },
          params,
          testSettings,
          "0x"
        ],
        chain: baseSepolia,
        account: address
      });
    }
  }, [isApproveConfirmed]);

  // Update allowance when result changes
  useEffect(() => {
    if (allowanceResult) {
      setAllowance(allowanceResult.toString());
    }
  }, [allowanceResult]);

  // Update current balance based on selected token
  useEffect(() => {
    if (zeroForOne && ethBalance) {
      setCurrentBalance(formatUnits(ethBalance.value, 18));
    } else if (!zeroForOne && tokenBalance) {
      setCurrentBalance(formatUnits(tokenBalance as bigint, 18));
    }
  }, [zeroForOne, ethBalance, tokenBalance]);

  const handleBuy = () => {
    setZeroForOne(true);
    setDisplayPrice('0');
    setInputPrice('0');
  };

  const handleSell = () => {
    setZeroForOne(false);
    setDisplayPrice('0');
    setInputPrice('0');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputPrice(value);
    setParsedInput(parseEther(value).toString());
  };

  const handleSwap = async () => {
    if (!address || !token) return;
    setIsLoading(true);
    
    try {
      if (zeroForOne) {
        const params: SwapParams = {
          zeroForOne,
          amountSpecified: BigInt(-parsedInput),
          sqrtPriceLimitX96: MIN_PRICE_LIMIT
        };

        const testSettings: TestSettings = {
          takeClaims: false,
          settleUsingBurn: false
        };

        await swap({
          address: SwapRouterAddress as `0x${string}`,
          abi: SwapRouterABI,
          functionName: 'swap',
          args: [
            {
              currency0: "0x0000000000000000000000000000000000000000",
              currency1: "0xA788b3D74CE0125263BDaF4Ebe726dd78FE54954" as `0x${string}`,
              fee: 3000,
              tickSpacing: 60,
              hooks: '0x50e8CED6ca2FA2840827b7DcC748C775277a48C0'
            },
            params,
            testSettings,
            "0x"
          ],
          chain: baseSepolia,
          account: address,
          value: BigInt(parsedInput)
        });
      } else {
        if (BigInt(allowance) < parseEther(inputPrice)) {
          approve({
            address: "0xA788b3D74CE0125263BDaF4Ebe726dd78FE54954" as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [SwapRouterAddress, parseEther(inputPrice)],
          });
        } else {
          const params: SwapParams = {
            zeroForOne: false,
            amountSpecified: BigInt(-parsedInput),
            sqrtPriceLimitX96: MAX_PRICE_LIMIT
          };

          const testSettings: TestSettings = {
            takeClaims: false,
            settleUsingBurn: false
          };

          swap({
            address: SwapRouterAddress as `0x${string}`,
            abi: SwapRouterABI,
            functionName: 'swap',
            args: [
              {
                currency0: "0x0000000000000000000000000000000000000000",
                currency1: "0xA788b3D74CE0125263BDaF4Ebe726dd78FE54954" as `0x${string}`,
                fee: 3000,
                tickSpacing: 60,
                hooks: '0x50e8CED6ca2FA2840827b7DcC748C775277a48C0'
              },
              params,
              testSettings,
              "0x"
            ],
            chain: baseSepolia,
            account: address
          });
        }
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setTxStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const isSwapDisabled = isLoading || isSwapPending || isSwapConfirming ||
    isApprovePending || isApproveConfirming || !authenticated;

  return (
    <>
      {token && (
        <div className="flex flex-col-reverse md:flex-row w-full gap-2">
          <div className="flex flex-col gap-2 bg-slate-400 p-2 rounded-xl w-full md:w-[60%]">
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
            <div className="h-96 w-full bg-slate-300 rounded-lg" />
          </div>

          <div className="flex gap-2 w-full md:w-[40%] flex-col-reverse md:flex-col">
            {authenticated ? (
              <>
                <div className="flex flex-col gap-2 bg-slate-400 rounded-xl p-2">
                  <div className="flex flex-row gap-2 justify-between h-12">
                    <Button
                      className={`w-1/2 ${zeroForOne ? 'bg-blue-600' : 'bg-slate-600'}`}
                      onClick={handleBuy}
                    >
                      Buy
                    </Button>
                    <Button
                      className={`w-1/2 ${!zeroForOne ? 'bg-blue-600' : 'bg-slate-600'}`}
                      onClick={handleSell}
                    >
                      Sell
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-col gap-2">
                      <div className="w-full bg-slate-300 flex items-center rounded-md">
                        <span className="text-gray-500 pl-3">
                          {zeroForOne ? 'ETH' : token?.ticker}
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter price"
                          value={inputPrice}
                          onChange={handlePriceChange}
                          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-1"
                        />
                        <span className="text-sm text-gray-500 pr-3 min-w-[150px] text-right whitespace-nowrap">
                          Max: {Number(currentBalance).toFixed(4)} {zeroForOne ? 'ETH' : token?.ticker}
                        </span>
                      </div>
                      <div className="bg-slate-300 p-2 rounded-md">
                        <p className="text-lg">{zeroForOne ? token?.ticker : 'ETH'} {displayPrice}</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleSwap}
                      disabled={isSwapDisabled}
                      className="w-full mt-2"
                    >
                      {isSwapPending || isSwapConfirming ? 'Processing...' : 'Execute Swap'}
                    </Button>

                    <Button onClick={logout} className="w-full">
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={login} className="w-full">
                Connect Wallet
              </Button>
            )}

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

          {/* Transaction Status Notification */}
          {txStatus && (
            <div 
              className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 transition-all duration-500`}
            >
              {txStatus === 'awaiting' && (
                <>
                  <div className="animate-pulse h-4 w-4 bg-yellow-500 rounded-full"></div>
                  <span>Awaiting Confirmation...</span>
                </>
              )}
              {txStatus === 'processing' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Processing Transaction...</span>
                </>
              )}
              {txStatus === 'success' && (
                <>
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  <span>Transaction Successful!</span>
                </>
              )}
              {txStatus === 'error' && (
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