"use server";

import { database } from "~/server/database";

export async function getExaminationDetails({ slug }: { slug: string }) {
	return await database.query.examinationTable.findFirst({ where: { slug } });
}
