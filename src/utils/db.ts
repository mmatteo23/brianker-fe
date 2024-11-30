import { env } from "@/utils/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { tokenTable } from "./schemas/db.schema";
import { eq } from "drizzle-orm";

export const tursoClient = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoClient, {
  schema: {
    tokenTable,
  },
});

export type TokenWithRequestor = {
  id: number;
  name: string;
  ticker: string;
  image: string;
  requestedBy: {
    fid: number;
    username: string;
    displayName: string;
    profileImage: string;
  };
  address: string;
  dateTime: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export const getTokens = async (
  limit: number = 10,
): Promise<TokenWithRequestor[]> => {
  const tokens = await db.query.tokenTable.findMany({
    limit,
  });
  // for each token I need to do JSON.parse(token.requestedBy)
  return tokens.map((token) => {
    return {
      ...token,
      requestedBy: JSON.parse(token.requestedBy) as {
        fid: number;
        username: string;
        displayName: string;
        profileImage: string;
      },
    };
  });
};

export const getTokenFromAddress = async (
  address: string,
): Promise<TokenWithRequestor | undefined> => {
  const token = await db.query.tokenTable.findFirst({
    where: eq(tokenTable.address, address),
  });
  return token
    ? {
        ...token,
        requestedBy: JSON.parse(token.requestedBy) as {
          fid: number;
          username: string;
          displayName: string;
          profileImage: string;
        },
      }
    : undefined;
};
