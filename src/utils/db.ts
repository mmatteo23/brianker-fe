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

export const getTokens = async (limit: number = 10) => {
  const tokens = await db.query.tokenTable.findMany({
    limit,
  });
  return tokens;
};

export const getTokenFromAddress = async (address: string) => {
  const token = await db.query.tokenTable.findFirst({
    where: eq(tokenTable.address, address),
  });
  return token;
};
