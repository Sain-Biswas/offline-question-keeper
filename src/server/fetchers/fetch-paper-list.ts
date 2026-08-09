"use server";

import { database } from "~/server/database";
import { examinationReferenceView } from "../database/schema";

interface FetchPaperListProps {
	examination: string;
	q: string;
}

export async function fetchPaperList({ examination, q }: FetchPaperListProps) {
	const pattern = `%${q.trim()}%`;

	return await database.query.paperTable.findMany({
		where: {
			examinationId: {
				eq: examination
			},

			RAW: (t, { or, like }) =>
				or(
					like(t.name, pattern),
					like(t.description, pattern),
					like(t.note, pattern)
				)!
		},

		extras: {
			subjectCount: (t, { sql }) =>
				sql<number>`(
                    SELECT COUNT(DISTINCT ${examinationReferenceView.subjectId})
                    FROM ${examinationReferenceView}
                    WHERE ${examinationReferenceView.paperId} = ${t.id}
                )`.as("subject_count"),

			chapterCount: (t, { sql }) =>
				sql<number>`(
                    SELECT COUNT(DISTINCT ${examinationReferenceView.chapterId})
                    FROM ${examinationReferenceView}
                    WHERE ${examinationReferenceView.paperId} = ${t.id}
                )`.as("chapter_count")
		}
	});
}

export type FetchPaperListType = Awaited<ReturnType<typeof fetchPaperList>>;
