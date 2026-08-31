import { randomUUIDv7 } from "bun";
import { sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { examinationTable } from "./examinations";

export const tagsTable = sqliteTable(
	"tags",
	(table) => ({
		id: table
			.text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7("hex")),

		name: table.text("name").notNull(),
		description: table.text("description"),

		examinationId: table
			.text("examination_id")
			.notNull()
			.references(() => examinationTable.id, { onDelete: "cascade" }),

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

	(table) => [index("idx_tags_on_examination_id").on(table.examinationId)]
);
