"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { sepolia } from "viem/chains";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const queryClient = new QueryClient();

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "all-users",
  },
  loginMethods: ["email", "google", "farcaster"],
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
    showWalletLoginFirst: true,
  },
  defaultChain: sepolia,
  supportedChains: [sepolia],
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId="cm1ursrn606y7c56nfnh2j8oi" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            // enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </NextThemesProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default Providers;
