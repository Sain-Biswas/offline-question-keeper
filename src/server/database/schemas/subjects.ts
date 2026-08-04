import { randomUUIDv7 } from "bun";
import { sql } from "drizzle-orm";
import { index, sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { paperTable } from "~/server/database/schemas/papers";

export const subjectTable = sqliteTable(
	"subjects",
	(table) => ({
		id: table
			.text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7("hex")),
		paperId: table
			.text("paper_id")
			.references(() => paperTable.id, { onDelete: "cascade" }),
		slug: table.text("slug").unique().notNull(),

		name: table.text("name").notNull(),

		note: table.text("note").notNull().default(""),
		description: table.text("description").notNull().default(""),

		createdAt: table
			.integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: table
			.integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	}),
	(table) => [
		index("idx_subjects_on_papers_id").on(table.paperId),
		uniqueIndex("idx_subjects_slug").on(table.slug)
	]
);
