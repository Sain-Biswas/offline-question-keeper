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
	const pattern = `%${search.trim()}%`;

	const result = await database.query.paperTable.findMany({
		where: {
			examinationId: {
				eq: examinationId
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
			description: true,
			note: true,
			name: true,
			slug: true
		},

		with: {
			subjects: {
				columns: {
					name: true
				},
				with: {
					chapters: {
						columns: {
							name: true
						}
					}
				}
			}
		}
	});

	return result.map((paper) => {
		let subCount = 0;
		let chapCount = 0;

		paper.subjects.map((sub) => {
			subCount++;

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			sub.chapters.map((_c) => {
				chapCount++;
			});
		});

		return {
			...paper,
			subjects: subCount,
			chapters: chapCount
		};
	});
}

export type GetPaperListItemType = Awaited<
	ReturnType<typeof getPaperList>
>[number];
