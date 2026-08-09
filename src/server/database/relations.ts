import { defineRelations } from "drizzle-orm";
import * as schema from "~/server/database/schema";

export const relations = defineRelations(schema, (relation) => ({
	examinationTable: {
		papers: relation.many.paperTable({
			from: relation.examinationTable.id,
			to: relation.paperTable.examinationId
		}),

		subjects: relation.many.subjectTable({
			from: relation.examinationTable.id.through(
				relation.examinationReferenceView.examinationId
			),
			to: relation.subjectTable.id.through(
				relation.examinationReferenceView.subjectId
			)
		}),

		chapters: relation.many.chapterTable({
			from: relation.examinationTable.id.through(
				relation.examinationReferenceView.examinationId
			),
			to: relation.chapterTable.id.through(
				relation.examinationReferenceView.chapterId
			)
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
		}),

		chapters: relation.many.chapterTable({
			from: relation.paperTable.id.through(
				relation.examinationReferenceView.paperId
			),
			to: relation.chapterTable.id.through(
				relation.examinationReferenceView.chapterId
			)
		})
	},

	subjectTable: {
		examinations: relation.many.examinationTable({
			from: relation.subjectTable.id.through(
				relation.examinationReferenceView.subjectId
			),
			to: relation.examinationTable.id.through(
				relation.examinationReferenceView.examinationId
			)
		}),

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
		examinations: relation.many.examinationTable({
			from: relation.chapterTable.id.through(
				relation.examinationReferenceView.chapterId
			),
			to: relation.examinationTable.id.through(
				relation.examinationReferenceView.examinationId
			)
		}),

		papers: relation.many.paperTable({
			from: relation.chapterTable.id.through(
				relation.examinationReferenceView.chapterId
			),
			to: relation.paperTable.id.through(
				relation.examinationReferenceView.paperId
			)
		}),

		subject: relation.one.subjectTable({
			from: relation.chapterTable.subjectId,
			to: relation.subjectTable.id
		})
	},

	examinationReferenceView: {
		examinations: relation.one.examinationTable({
			from: relation.examinationReferenceView.examinationId,
			to: relation.examinationTable.id
		}),

		papers: relation.one.paperTable({
			from: relation.examinationReferenceView.paperId,
			to: relation.paperTable.id
		}),

		subjects: relation.one.subjectTable({
			from: relation.examinationReferenceView.subjectId,
			to: relation.subjectTable.id
		}),

		chapters: relation.one.chapterTable({
			from: relation.examinationReferenceView.chapterId,
			to: relation.chapterTable.id
		})
	}
}));
