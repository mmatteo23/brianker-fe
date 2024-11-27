import { env } from "@/utils/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { tokenTable } from "./schemas/db.schema";

export const tursoClient = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(tursoClient, {
  schema: {
    tokenTable,
  },
});
