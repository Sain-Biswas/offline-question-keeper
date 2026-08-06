"use server";

import { database } from "../database";

interface GetChapterListProps {
	examinationId: string;
	search: string;
	subjectId: string;
}

export async function getChapterList({
	examinationId,
	search,
	subjectId
}: GetChapterListProps) {
	const pattern = `%${search.trim()}%`;

	return (
		await database.query.paperTable.findMany({
			where: {
				examinationId: {
					eq: examinationId
				}
			},

			columns: {
				name: true,
				slug: true
			},

			with: {
				subjects: {
					columns: {
						name: true,
						slug: true
					},

					where: {
						id: {
							like: `%${subjectId === "all" ? "" : subjectId.trim()}%`
						}
					},

					with: {
						chapters: {
							columns: {
								id: true,
								name: true,
								note: true,
								description: true,
								slug: true
							},

							where: {
								RAW: (p, { or, like }) =>
									or(
										like(p.name, pattern),
										like(p.description, pattern),
										like(p.note, pattern)
									)!
							}
						}
					}
				}
			}
		})
	)
		.map((paper) => {
			return paper.subjects.map((subject) => {
				return subject.chapters.map((chapter) => ({
					...chapter,
					subject: subject.name,
					subjectSlug: subject.slug,
					paper: paper.name,
					paperSlug: paper.slug
				}));
			});
		})
		.flat(2);
}

export type GetChapterListType = Awaited<ReturnType<typeof getChapterList>>;
