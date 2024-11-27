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
  const ethPrice = "3500";

  return (
    <div className="flex flex-col w-full h-screen gap-2 mx-auto">
      <header className="flex justify-between items-center p-4">
        <img src="/logo.png" alt="Logo" className="h-8" />
        <input
          type="text"
          placeholder="Token address..."
          className="border rounded p-2 w-full max-w-xs"
        />
      </header>
      <main className="flex-grow p-4">Something will be here</main>
      <footer className="p-4 sticky bottom-0 bg-black text-white">
        Current ETH Price: ${ethPrice}
      </footer>
    </div>
  );
}
