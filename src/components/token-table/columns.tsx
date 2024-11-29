"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Token } from "@/utils/schemas/db.schema";

export const columns: ColumnDef<
  Token & {
    marketCap: number;
    price: number;
  }
>[] = [
  {
    accessorKey: "token",
    header: "Token",
    filterFn: (row, columnId, filterValue) => {
      const foundTokenName = row.original.name
        .toLowerCase()
        .includes(filterValue.toLowerCase());
      const foundTokenTicker = row.original.ticker
        .toLowerCase()
        .includes(filterValue.toLowerCase());
      return foundTokenName || foundTokenTicker;
    },
    cell: ({ row }) => {
      const token = row.original;
      return (
        <div className="flex items-center gap-2 px-2">
          <Image
            src={token.image}
            alt={token.name}
            width={48}
            height={48}
            className="rounded-xl object-cover"
          />
          <div>
            <div className="font-medium">{token.ticker}</div>
            <span className="text-indigo-400 text-sm font-semibold">
              {token.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => (
      <Button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="rounded-xl text-white"
      >
        Market Cap
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-4">
        $
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          compactDisplay: "short",
        }).format(row.original.marketCap)}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-4">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.original.price)}
      </div>
    ),
  },
];
