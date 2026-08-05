"use server";

import { database } from "~/server/database";

interface GetSubjectListProps {
	papers: string[];
}

export async function getSubjectList({ papers }: GetSubjectListProps) {
	return (
		await database.query.subjectTable.findMany({
			where: {
				paperId: {
					in: papers
				}
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
	).map((subject) => ({
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
