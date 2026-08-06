"use server";

import { database } from "~/server/database";

interface GetPaperListProps {
	examinationId: string;
	search: string;
}

export async function getPaperList({
	examinationId,
	search
}: GetPaperListProps) {
	return (
		await database.query.paperTable.findMany({
			where: {
				examinationId: {
					eq: examinationId
				},

				RAW: (p, { or, like }) =>
					or(
						like(p.name, `%${search.trim()}%`),
						like(p.description, `%${search.trim()}%`),
						like(p.note, `%${search.trim()}%`)
					)!
			},

			columns: {
				id: true,
				description: true,
				note: true,
				name: true,
				slug: true
			},

			with: {
				subjects: true,
				chapters: true
			}
		})
	).map((paper) => ({
		...paper,
		subjects: paper.subjects.length,
		chapters: paper.chapters.length
	}));
}

export type GetPaperListItemType = Awaited<
	ReturnType<typeof getPaperList>
>[number];
