"use client";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";

import Link from "next/link";
import { LogOut } from "lucide-react";

const HeaderDesktop = () => {
  const { authenticated, user, login, logout } = usePrivy();
  return (
    <header className="flex items-center justify-between gap-10 py-4">
      <Link href="/" className="flex flex-1 items-center gap-3">
        {/* <Image
          src="/images/6-sigma.png"
          alt="Naaamofit logo"
          width={36}
          height={36}
          className="overflow-hidden rounded-full"
          style={{ aspectRatio: "36/36", objectFit: "cover" }}
        /> */}
        <span className="font-heading text-xl font-bold">NaaamoFit</span>
      </Link>
      <nav className="flex flex-1 items-center justify-center gap-10">
        <Link
          href="/dashboard"
          className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/qr"
          className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          QR Codes
        </Link>
        <Link
          href="/user"
          className="flex cursor-pointer items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          User
        </Link>
      </nav>
      <div className="flex flex-1 items-center justify-end gap-2">
        {authenticated && user ? (
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">
              {`${user.wallet?.address?.slice(
                0,
                6,
              )}...${user.wallet?.address?.slice(-4)}`}
            </span>
            <Button variant="default" onClick={logout} className="p-2">
              <LogOut size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={login}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export { HeaderDesktop };
