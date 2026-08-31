"use server";

import { database } from "~/server/database";

interface FetchChapterListProps {
	examination: string;
	q: string;
	subject: string;
}

export async function fetchChapterList({
	examination,
	q,
	subject
}: FetchChapterListProps) {
	const pattern = `%${q.trim()}%`;

	const subjects = await database.query.subjectTable.findMany({
		where: {
			paper: {
				examinationId: { eq: examination }
			}
		},

		columns: {
			id: true,
			name: true
		},

		with: {
			paper: {
				columns: {
					name: true
				}
			}
		}
	});

	const chapters = await database.query.chapterTable.findMany({
		where: {
			subjectId: { in: subjects.map((s) => s.id) },

			RAW: (t, { and, like, or, eq }) =>
				and(
					subject ? eq(t.subjectId, subject) : undefined,
					or(
						like(t.name, pattern),
						like(t.description, pattern),
						like(t.note, pattern)
					)
				)!
		},

		with: {
			subject: { columns: { name: true, slug: true } },
			paper: { columns: { name: true, slug: true } }
		}
	});

	return {
		subjects: subjects.map((subject) => ({
			description: subject.paper?.name,
			label: subject.name,
			value: subject.id
		})),

		chapters: chapters.map((c) => ({
			id: c.id,
			name: c.name,
			slug: c.slug,
			description: c.description,
			note: c.note,

			paper: c.paper?.name,
			paperSlug: c.paper?.slug,

			subject: c.subject?.name,
			subjectSlug: c.subject?.slug
		}))
	};
}

export type FetchChapterListType = Awaited<ReturnType<typeof fetchChapterList>>;
