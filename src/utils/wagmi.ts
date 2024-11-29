import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [baseSepolia, mainnet],
  transports: {
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
