import { sqliteTable, AnySQLiteColumn, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const briankerRequests = sqliteTable("brianker_requests", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	status: text().default("pending").notNull(),
	errorMessage: text("error_message"),
	inputCast: text("input_cast"),
	brianInputOriginWallet: text("brian_input_origin_wallet"),
	brianResponse: text("brian_response"),
	grokResponse: text("grok_response"),
	redisOperationId: text("redis_operation_id"),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`"),
});

export const token = sqliteTable("token", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	address: text().notNull(),
	name: text().notNull(),
	ticker: text().notNull(),
	requestedBy: integer().notNull(),
	image: text().notNull(),
	dateTime: text("date_time").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`"),
},
(table) => {
	return {
		addressUnique: uniqueIndex("token_address_unique").on(table.address),
	}
});

