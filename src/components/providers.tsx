"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig } from "@/utils/wagmi";
import { baseSepolia, mainnet } from "viem/chains";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  loginMethods: ["wallet"],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    showWalletLoginFirst: true,
  },
  defaultChain: baseSepolia,
  supportedChains: [baseSepolia, mainnet],
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <PrivyProvider appId="cm4342c9g0b4913p8n08eiswg" config={privyConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            {children}
            <Toaster />
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </NextThemesProvider>
  );
};

export default Providers;
