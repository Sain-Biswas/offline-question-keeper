import {
	ComponentIcon,
	ListFilterIcon,
	RotateCwIcon,
	TextSearchIcon
} from "lucide-react";
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
import { getSubjectList } from "~/server/fetchers/get-subject-list";
import { ItemGroup } from "~/shadcn/ui/item";
import { SubjectListItem } from "./item";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/shadcn/ui/select";

interface SubjectListProps {
	examinationId: string;
	examinationSlug: string;
	search: string;
	selectedPaper: string;
}

export async function SubjectList({
	examinationId,
	examinationSlug,
	search,
	selectedPaper
}: SubjectListProps) {
	const papers = await getPaperEntries({ examId: examinationId });
	const subjects = await getSubjectList({
		papers: papers.map((paper) => paper.value),
		paperId: selectedPaper,
		search
	});

	return (
		<>
			<section className="flex flex-col flex-wrap items-end gap-6 bg-card p-6 md:flex-row">
				<Form
					action={`/${examinationSlug}`}
					id="form-subject-filters"
					className="mr-auto flex w-full grow flex-col items-end gap-6 md:flex-row lg:w-fit"
				>
					<Field
						className="w-full gap-0 md:max-w-80"
						key={`subjectSearch:${search}`}
					>
						<FieldLabel>Search for Subject</FieldLabel>

						<InputGroup>
							<InputGroupInput
								key={`subjectSearch:${search}`}
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

					<Field className="gap-0">
						<FieldLabel>Select Paper</FieldLabel>
						<Select
							items={[...papers, { value: "all", label: "All" }]}
							name="searchPaper"
							defaultValue={selectedPaper}
							key={selectedPaper}
						>
							<SelectTrigger className="w-full md:max-w-64">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem
									key="all"
									value="all"
								>
									All
								</SelectItem>
								{papers.map((paper) => (
									<SelectItem
										key={paper.value}
										value={paper.value}
									>
										{paper.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</Form>

				{(search || selectedPaper !== "all") && (
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
					form="form-subject-filters"
					className="w-full md:w-fit"
				>
					<ListFilterIcon />
					Filter
				</Button>

				<NewSubjectDialog papers={papers} />
			</section>

			{subjects.length === 0 && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<ComponentIcon />
						</EmptyMedia>

						<EmptyTitle>No Subjects to show</EmptyTitle>

						<EmptyDescription>
							Add new subjects or try changing the filters
							applied.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			<ItemGroup className="my-6">
				{subjects.map((subject) => (
					<SubjectListItem
						examinationSlug={examinationSlug}
						subject={subject}
						key={subject.id}
					/>
				))}
			</ItemGroup>
		</>
	);
}
