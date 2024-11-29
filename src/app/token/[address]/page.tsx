import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { getAddress, isAddress } from "viem";

import { createExampleURL } from "@/utils/frames";
import { TokenDetails } from "@/components/token-details";
import { getTokenFromAddress } from "@/utils/db";

export async function generateMetadata({
  params,
}: {
  params: { address: string };
}): Promise<Metadata> {
  return {
    title: "Brian Clanker",
    description: "Brian Clanker is better",
    other: {
      ...(await fetchMetadata(
        createExampleURL(`/frames/token/${params.address}`),
      )),
    },
  };
}

export default async function TokenPage({
  params,
}: {
  params: { address: string };
}) {
  const address = params.address;
  if (!address || !isAddress(address, { strict: false })) {
    return <div>Invalid address</div>;
  }
  const token = await getTokenFromAddress(getAddress(address));

  return (
    <div className="p-4 bg-slate-200 rounded-xl w-full">
      <TokenDetails token={token} />
    </div>
  );
}
