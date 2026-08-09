"use server";

import { database } from "~/server/database";
import { examinationReferenceView } from "~/server/database/schema";

interface FetchExaminationListProps {
	q: string;
	status: "all" | "preparing" | "not-preparing";
}

export async function fetchExaminationList({
	q,
	status
}: FetchExaminationListProps) {
	const trimmedSearch = q.trim();
	const pattern = `%${trimmedSearch}%`;

	return await database.query.examinationTable.findMany({
		columns: {
			createdAt: false,
			updatedAt: false
		},

		where: {
			RAW: (t, { and, like, or, eq }) =>
				and(
					trimmedSearch ?
						or(
							like(t.name, pattern),
							like(t.code, pattern),
							like(t.description, pattern)
						)
					:	undefined,
					status !== "all" ?
						eq(t.isActive, status === "preparing")
					:	undefined
				)!
		},

		extras: {
			paperCount: (t, { sql }) =>
				sql<number>`(
        SELECT COUNT(DISTINCT ${examinationReferenceView.paperId}) 
        FROM ${examinationReferenceView} 
        WHERE ${examinationReferenceView.examinationId} = ${t.id}
      )`.as("paper_count"),

			subjectCount: (t, { sql }) =>
				sql<number>`(
        SELECT COUNT(DISTINCT ${examinationReferenceView.subjectId}) 
        FROM ${examinationReferenceView} 
        WHERE ${examinationReferenceView.examinationId} = ${t.id}
      )`.as("subject_count"),

			chapterCount: (t, { sql }) =>
				sql<number>`(
        SELECT COUNT(DISTINCT ${examinationReferenceView.chapterId}) 
        FROM ${examinationReferenceView} 
        WHERE ${examinationReferenceView.examinationId} = ${t.id}
      )`.as("chapter_count")
		}
	});
}

export type FetchExaminationListType = Awaited<
	ReturnType<typeof fetchExaminationList>
>;
