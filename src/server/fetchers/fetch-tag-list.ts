"use server";

import { database } from "~/server/database";

interface FetchTagListProps {
	examination: string;
	q: string;
}

export async function fetchTagList({ examination, q }: FetchTagListProps) {
	const pattern = `%${q.trim()}%`;

	return await database.query.tagsTable.findMany({
		where: {
			examinationId: {
				eq: examination
			},

			RAW: (t, { or, like }) =>
				or(like(t.name, pattern), like(t.description, pattern))!
		}
	});
}

export type FetchTagListType = Awaited<ReturnType<typeof fetchTagList>>;
