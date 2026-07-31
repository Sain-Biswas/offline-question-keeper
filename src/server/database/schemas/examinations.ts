import { sqliteTable } from "drizzle-orm/sqlite-core";
import { randomUUIDv7 } from "bun";
import { sql } from "drizzle-orm";

export const examinationTable = sqliteTable("examinations", (table) => ({
	id: table
		.text("id")
		.primaryKey()
		.$defaultFn(() => randomUUIDv7("hex")),
	name: table.text("name").notNull(),

	code: table.text("code").notNull(),
	slug: table.text("slug").unique().notNull(),

	description: table.text("description"),
	isActive: table.integer("is_active", { mode: "boolean" }).default(true),

	createdAt: table
		.integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: table
		.integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
}));
