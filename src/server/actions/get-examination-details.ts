"use server";

import { eq } from "drizzle-orm";
import { database } from "~/server/database";
import { examinationTable } from "~/server/database/schema";

export async function getExaminationDetails({ slug }: { slug: string }) {
	return (
		await database
			.select()
			.from(examinationTable)
			.where(eq(examinationTable.slug, slug))
	).at(0);
}
