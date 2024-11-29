"use client";

import { useWallets } from "@privy-io/react-auth";
import { sepolia } from "viem/chains"; // Replace this with the chain used by your application
import { http } from "viem";
import { createSmartAccountClient, SmartAccountClient } from "permissionless";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { pimlicoClient, pimlicoRpcUrl } from "@/lib/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";

export default function usePimlico() {
  const { isConnected } = useAccount();
  const [smartAccountClient, setSmartAccountClient] =
    useState<SmartAccountClient | null>(null);
  const publicClient = usePublicClient();
  const { wallets } = useWallets();
  const { data: walletClient } = useWalletClient();
  const { setActiveWallet } = useSetActiveWallet();

  const embeddedWallet = useMemo(
    () => wallets.find((wallet) => wallet.walletClientType === "privy"),
    [wallets]
  );

  const fetchPimlicoSmartAccount = useCallback(async () => {
    if (!publicClient || !walletClient) return;

    const simpleSmartAccount = await toSimpleSmartAccount({
      client: publicClient,
      owner: walletClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      }, // global entrypoint
    });

    const smartAccountClient = createSmartAccountClient({
      account: simpleSmartAccount,
      chain: sepolia,
      bundlerTransport: http(pimlicoRpcUrl(sepolia), {}),
      paymaster: pimlicoClient(sepolia),
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient(sepolia).getUserOperationGasPrice()).fast;
        },
      },
    });
    setSmartAccountClient(smartAccountClient);
    return smartAccountClient;
  }, [publicClient, walletClient]);

  const predictSmartAccountAddress = async () => {
    if (!publicClient || !walletClient) return;

    const simpleSmartAccount = await toSimpleSmartAccount({
      client: publicClient,
      owner: walletClient,
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      }, // global entrypoint
    });
    return simpleSmartAccount.address;
  };

  useEffect(() => {
    if (embeddedWallet) {
      setActiveWallet(embeddedWallet);
    }
  }, [embeddedWallet, setActiveWallet]);

  useEffect(() => {
    if (isConnected && walletClient && publicClient) {
      fetchPimlicoSmartAccount();
    }
  }, [isConnected, walletClient, publicClient, fetchPimlicoSmartAccount]);

  return { smartAccountClient, predictSmartAccountAddress };
}
