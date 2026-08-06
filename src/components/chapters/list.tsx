import { getSubjectEntries } from "~/server/fetchers/get-subject-entries";
import { NewChapterDialog } from "../forms/new-chapter-dialog";

interface ChapterListProps {
	examinationSlug: string;
	examinationId: string;
}

export async function ChapterList({
	examinationId,
	examinationSlug
}: ChapterListProps) {
	const subjects = await getSubjectEntries({ examId: examinationId });

	return (
		<>
			<section className="bg-card p-6">
				<NewChapterDialog
					examSlug={examinationSlug}
					subjects={subjects}
				/>
			</section>
		</>
	);
}
