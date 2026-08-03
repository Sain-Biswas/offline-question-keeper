import { randomUUIDv7 } from "bun";
import { index, sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { examinationTable } from "~/server/database/schemas/examinations";

export const paperTable = sqliteTable(
	"papers",
	(table) => ({
		id: table
			.text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7("hex")),
		examinationId: table
			.text("examination_id")
			.references(() => examinationTable.id, { onDelete: "cascade" }),
		slug: table.text("slug").unique().notNull(),

		name: table.text("name").notNull(),

		note: table.text("note").notNull().default(""),
		description: table.text("description").notNull().default("")
	}),
	(table) => [
		uniqueIndex("idx_papers_id").on(table.id),
		index("idx_papers_on_examination_id").on(table.examinationId),
		uniqueIndex("idx_papers_slug").on(table.slug)
	]
);
