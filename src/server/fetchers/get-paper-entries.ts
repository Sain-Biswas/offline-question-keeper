import { database } from "~/server/database";

interface GetPaperEntriesProps {
	examId: string;
}

export async function getPaperEntries({ examId }: GetPaperEntriesProps) {
	return (
		await database.query.paperTable.findMany({
			where: {
				examinationId: {
					eq: examId
				}
			},

			columns: {
				id: true,
				name: true,
				slug: true
			}
		})
	).map((paper) => ({
		value: paper.id,
		label: paper.name
	}));
}

export type GetPaperEntriesType = Awaited<ReturnType<typeof getPaperEntries>>;
