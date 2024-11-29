import { createPimlicoClient } from "permissionless/clients/pimlico";
import { Chain, http } from "viem";
import { entryPoint07Address } from "viem/account-abstraction";

if (!process.env.NEXT_PUBLIC_PIMLICO_API_KEY)
  throw new Error("Missing NEXT_PUBLIC_PIMLICO_API_KEY");

export const pimlicoRpcUrl = (chain: Chain) =>
  `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`;

export const pimlicoClient = (chain: Chain) =>
  createPimlicoClient({
    transport: http(pimlicoRpcUrl(chain)),
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
  });
