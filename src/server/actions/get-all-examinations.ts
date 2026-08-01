"use server";

import { database } from "~/server/database";
import { examinationTable } from "~/server/database/schema";

export async function getAllExamination() {
	return await database.select().from(examinationTable);
}

export type GetAllExaminationItemType = Awaited<ReturnType<typeof getAllExamination>>[number];