import { defineRelations } from "drizzle-orm";
import * as schema from "~/server/database/schema";

export const relations = defineRelations(schema, (relation) => ({
	examinationTable: {
		papers: relation.many.paperTable({
			from: relation.examinationTable.id,
			to: relation.paperTable.examinationId
		})
	},

	paperTable: {
		examination: relation.one.examinationTable({
			from: relation.paperTable.examinationId,
			to: relation.examinationTable.id
		}),

		subjects: relation.many.subjectTable({
			from: relation.paperTable.id,
			to: relation.subjectTable.paperId
		})
	},

	subjectTable: {
		paper: relation.one.paperTable({
			from: relation.subjectTable.paperId,
			to: relation.paperTable.id
		}),

		chapters: relation.many.chapterTable({
			from: relation.subjectTable.id,
			to: relation.chapterTable.subjectId
		})
	},

	chapterTable: {
		subject: relation.one.subjectTable({
			from: relation.chapterTable.subjectId,
			to: relation.subjectTable.id
		})
	}
}));
