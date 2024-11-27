import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tokenTable = sqliteTable("token", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  address: text("address").unique().notNull(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  requestedBy: integer("requestedBy").notNull(), // user Farcaster FID
  image: text("image").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
