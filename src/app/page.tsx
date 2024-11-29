import { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";

import { createExampleURL } from "@/utils/frames";
import { TokenExplorer } from "@/components/token-explorer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Brian Clanker",
    description: "Brian Clanker is better",
    other: {
      ...(await fetchMetadata(createExampleURL("/frames"))),
    },
  };
}

export default function Home() {
  return (
    <div>
      <TokenExplorer />
    </div>
  );
}
