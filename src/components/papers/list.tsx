import { NewPaperDialog } from "../forms/new-paper-dialog";

interface PaperListProps {
	examinationId: string;
}

export async function PaperList({ examinationId }: PaperListProps) {
	return (
		<>
			<section className="bg-card p-6">
				<NewPaperDialog examinationId={examinationId} />
			</section>
		</>
	);
}
