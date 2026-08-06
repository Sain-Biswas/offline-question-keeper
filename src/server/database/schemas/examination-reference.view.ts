import { sqliteView } from "drizzle-orm/sqlite-core";
import { chapterTable } from "./chapters";
import { subjectTable } from "./subjects";
import { eq } from "drizzle-orm";
import { paperTable } from "./papers";
import { examinationTable } from "./examinations";

export const examinationReferenceView = sqliteView("examination_reference").as(
	(ref) =>
		ref
			.select({
				chapterId: chapterTable.id.as("chapter_id"),
				subjectId: subjectTable.id.as("subject_id"),
				paperId: paperTable.id.as("paper_id"),
				examinationId: examinationTable.id.as("examination_id")
			})
			.from(chapterTable)
			.innerJoin(
				subjectTable,
				eq(chapterTable.subjectId, subjectTable.id)
			)
			.innerJoin(paperTable, eq(subjectTable.paperId, paperTable.id))
			.innerJoin(
				examinationTable,
				eq(paperTable.examinationId, examinationTable.id)
			)
);
