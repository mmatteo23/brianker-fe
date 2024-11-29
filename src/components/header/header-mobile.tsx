"use client";

import Link from "next/link";

import { usePrivy } from "@privy-io/react-auth";

import { LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const HeaderMobile = () => {
  const { authenticated, user, login, logout } = usePrivy();

  return (
    <header className="w-full flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-3">
        <span className="font-heading text-xl font-bold">NaaamoFit</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav className="flex flex-col space-y-4 mt-8">
            <Link
              href="/dashboard"
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
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
              className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              User
            </Link>
          </nav>
          <div className="mt-8">
            {authenticated && user ? (
              <div className="flex flex-col space-y-4">
                <span className="text-sm text-muted-foreground">
                  {`${user.wallet?.address?.slice(0, 6)}...${user.wallet?.address?.slice(-4)}`}
                </span>
                <Button variant="default" onClick={logout} className="w-full">
                  <LogOut size={16} className="mr-2" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={login}
                className="w-full bg-blue-500 hover:bg-blue-700"
              >
                Login
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export { HeaderMobile };
