"use server";

import { and, eq, like, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { database } from "~/server/database";
import { examinationTable } from "~/server/database/schema";

export async function getAllExamination({
	search,
	status
}: {
	search: string;
	status: string;
}) {
	const filters: SQL[] = [];

	const trimmedSearch = search.trim();
	if (trimmedSearch) {
		const pattern = `%${trimmedSearch}%`;
		filters.push(
			or(
				like(examinationTable.name, pattern),
				like(examinationTable.code, pattern),
				like(examinationTable.description, pattern)
			)!
		);
	}

	if (status === "on") filters.push(eq(examinationTable.isActive, true));
	if (status === "off") filters.push(eq(examinationTable.isActive, false));

	return await database
		.select()
		.from(examinationTable)
		.where(and(...filters));
}

export type GetAllExaminationItemType = Awaited<
	ReturnType<typeof getAllExamination>
>[number];
