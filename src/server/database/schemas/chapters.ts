import { randomUUIDv7 } from "bun";
import { index, sqliteTable, uniqueIndex } from "drizzle-orm/sqlite-core";
import { subjectTable } from "~/server/database/schemas/subjects";

export const chapterTable = sqliteTable(
	"chapters",
	(table) => ({
		id: table
			.text("id")
			.primaryKey()
			.$defaultFn(() => randomUUIDv7("hex")),
		subjectId: table
			.text("subject_id")
			.references(() => subjectTable.id, { onDelete: "cascade" }),
		slug: table.text("slug").unique().notNull(),

		name: table.text("name").notNull(),

		note: table.text("note").notNull().default(""),
		description: table.text("description").notNull().default("")
	}),
	(table) => [
		uniqueIndex("idx_chapters_id").on(table.id),
		index("idx_chapters_on_subjects_id").on(table.subjectId),
		uniqueIndex("idx_chapters_slug").on(table.slug)
	]
);
