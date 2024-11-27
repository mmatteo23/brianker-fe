import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { createExampleURL } from "./utils";

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
    <div className="flex flex-col max-w-[600px] w-full gap-2 mx-auto p-2">
      Something will be here
    </div>
  );
}
