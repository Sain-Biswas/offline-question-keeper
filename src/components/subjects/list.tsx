import { ListFilterIcon, RotateCwIcon, TextSearchIcon } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { Button } from "~/shadcn/ui/button";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { NewSubjectDialog } from "../forms/new-subject-dialog";
import { getPaperEntries } from "~/server/fetchers/get-paper-entries";

interface SubjectListProps {
	examinationId: string;
	examinationSlug: string;
	search: string;
}

export async function SubjectList({
	examinationId,
	examinationSlug,
	search
}: SubjectListProps) {
	const papers = await getPaperEntries({ examId: examinationId });

	return (
		<>
			<section className="flex flex-col items-end gap-6 bg-card p-6 md:flex-row">
				<Form
					action={`/${examinationSlug}`}
					className="flex w-full flex-col items-end gap-6 md:flex-row"
				>
					<Field
						className="mr-auto w-full gap-0 md:max-w-80"
						key={`subjectSearch:${search}`}
					>
						<FieldLabel>Search for Subject</FieldLabel>

						<InputGroup>
							<InputGroupInput
								name="subjectSearch"
								autoComplete="off"
								placeholder="Search for name, description and note"
								defaultValue={search}
							/>

							<InputGroupAddon align="inline-start">
								<TextSearchIcon />
							</InputGroupAddon>
						</InputGroup>
					</Field>

					{search && (
						<Button
							type="reset"
							variant="destructive"
							className="w-full md:w-fit"
							key={examinationSlug}
							nativeButton={false}
							render={
								<Link href={`/${examinationSlug}`}>
									<RotateCwIcon />
									Reset
								</Link>
							}
						/>
					)}

					<Button
						type="submit"
						className="w-full md:w-fit"
					>
						<ListFilterIcon />
						Filter
					</Button>
				</Form>

				<NewSubjectDialog
					examSlug={examinationSlug}
					papers={papers}
				/>
			</section>
		</>
	);
}
