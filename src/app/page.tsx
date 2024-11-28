import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { createExampleURL } from "./utils";
import { HeroHighlightLanding } from "./components/hero";
import { TokenExplorer } from "@/app/components/token-explorer";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Brian Clanker",
    description: "Brian Clanker is better",
    other: {
      ...(await fetchMetadata(createExampleURL("/frames"))),
    },
  };
}

export default async function Home() {
  return (
    <>
      {/* <HeroHighlightLanding /> */}
      <TokenExplorer />
    </>
  );
}
