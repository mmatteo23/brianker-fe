"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { TokenWithRequestor } from "@/utils/db";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

export const columns: ColumnDef<TokenWithRequestor>[] = [
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
    accessorKey: "availableFrom",
    header: "Available From",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-4">
        {row.original.createdAt
          ? new Date(row.original.dateTime) < new Date(new Date().toUTCString())
            ? formatDistanceToNow(new Date(row.original.createdAt))
            : ` ${new Date(row.original.dateTime).toLocaleString()}`
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "tradable",
    header: "Tradable",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 px-4">
        {new Date(row.original.dateTime) <
        new Date(new Date().toUTCString()) ? (
          <Badge className="bg-green-500">Tradable</Badge>
        ) : (
          <Badge className="bg-red-500">Not Tradable</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "requestedBy",
    header: "Requested By",
    cell: ({ row }) => (
      <div className="px-4">
        <Link
          href={`https://warpcast.com/${row.original.requestedBy.username}`}
          target="_blank"
        >
          <div className="flex flex-row">
            <Image
              src={row.original.requestedBy.profileImage}
              alt={row.original.requestedBy.username}
              width={24}
              height={24}
              className="w-[24px] h-[24px] rounded-full"
            />
            <span className="ml-2">{row.original.requestedBy.displayName}</span>
          </div>
        </Link>
      </div>
    ),
  },
];
