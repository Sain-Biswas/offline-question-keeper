"use server";

import { database } from "~/server/database";
import { examinationReferenceView } from "../database/schema";

interface FetchExaminationDetailsProps {
	slug: string;
}

export async function fetchExaminationDetails({
	slug
}: FetchExaminationDetailsProps) {
	return await database.query.examinationTable.findFirst({
		where: { slug: { eq: slug } },

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

export type FetchExaminationDetailsType = Awaited<
	ReturnType<typeof fetchExaminationDetails>
>;
