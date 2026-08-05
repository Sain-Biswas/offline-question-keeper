"use server";

import { database } from "~/server/database";

interface GetSubjectListProps {
	papers: string[];
	paperId: string;
	search: string;
}

export async function getSubjectList({
	papers,
	paperId,
	search
}: GetSubjectListProps) {
	const pattern = `%${search.trim()}%`;

	return (
		await database.query.subjectTable.findMany({
			where: {
				paperId: {
					in: papers
				},

				RAW: (p, { or, like }) =>
					or(
						like(p.name, pattern),
						like(p.description, pattern),
						like(p.note, pattern)
					)!
			},

			columns: {
				id: true,
				name: true,
				slug: true,
				description: true,
				note: true
			},

			with: {
				paper: {
					columns: {
						id: true,
						name: true,
						slug: true
					}
				},
				chapters: {
					columns: {
						id: true
					}
				}
			}
		})
	)
		.filter((subject) =>
			paperId === "all" ? true : subject.paper?.id === paperId
		)
		.map((subject) => ({
			id: subject.id,
			name: subject.name,
			slug: subject.slug,
			description: subject.description,
			note: subject.note,

			chapterCount: subject.chapters.length,

			paperId: subject.paper?.id,
			paperName: subject.paper?.name,
			paperSlug: subject.paper?.slug
		}));
}

export type GetSubjectListType = Awaited<ReturnType<typeof getSubjectList>>;
