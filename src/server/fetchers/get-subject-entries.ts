import { database } from "~/server/database";

interface GetSubjectEntriesProps {
	examId: string;
}

export async function getSubjectEntries({ examId }: GetSubjectEntriesProps) {
	return (
		await database.query.paperTable.findMany({
			where: {
				examinationId: {
					eq: examId
				}
			},

			columns: {
				name: true
			},

			with: {
				subjects: {
					columns: {
						id: true,
						name: true,
						slug: true
					}
				}
			}
		})
	)
		.map((paper) => {
			return paper.subjects.map((subject) => ({
				value: subject.id,
				label: subject.name,
				key: subject.slug,
				description: paper.name
			}));
		})
		.flat();
}

export type GetSubjectEntriesType = Awaited<
	ReturnType<typeof getSubjectEntries>
>;
