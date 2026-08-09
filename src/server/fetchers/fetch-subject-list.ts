"use server";

import { database } from "~/server/database";

interface FetchSubjectListProps {
	examination: string;
	q: string;
	paper: string;
}

export async function fetchSubjectList({
	examination,
	paper,
	q
}: FetchSubjectListProps) {
	const pattern = `%${q.trim()}%`;

	const papers = await database.query.paperTable.findMany({
		where: {
			examinationId: {
				eq: examination
			}
		},

		columns: {
			id: true,
			name: true
		}
	});

	const subjects = await database.query.subjectTable.findMany({
		where: {
			paperId: {
				in: papers.map((p) => p.id)
			},
			RAW: (t, { or, like, and, eq }) =>
				and(
					paper ? eq(t.paperId, paper) : undefined,
					or(
						like(t.name, pattern),
						like(t.description, pattern),
						like(t.note, pattern)
					)
				)!
		},
		with: {
			paper: {
				columns: {
					name: true,
					slug: true
				}
			},

			chapters: { columns: { id: true } }
		}
	});

	return {
		paperEntries: papers.map((p) => ({ label: p.name, value: p.id })),

		subjects: subjects.map((s) => ({
			paper: s.paper?.name,
			paperSlug: s.paper?.slug,
			chapterCount: s.chapters.length,

			id: s.id,
			name: s.name,
			slug: s.slug,
			description: s.description,
			note: s.note
		}))
	};
}

export type FetchSubjectListType = Awaited<ReturnType<typeof fetchSubjectList>>;
