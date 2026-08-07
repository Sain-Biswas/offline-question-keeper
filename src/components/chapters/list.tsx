import { getSubjectEntries } from "~/server/fetchers/get-subject-entries";
import { NewChapterDialog } from "../forms/new-chapter-dialog";
import { getChapterList } from "~/server/fetchers/get-chapter-list";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";
import {
	ListFilterIcon,
	LogsIcon,
	RotateCwIcon,
	TextSearchIcon
} from "lucide-react";
import { ItemGroup } from "~/shadcn/ui/item";
import { ChapterListItem } from "./item";
import Form from "next/form";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/shadcn/ui/select";
import { Button } from "~/shadcn/ui/button";
import Link from "next/link";

interface ChapterListProps {
	examinationSlug: string;
	examinationId: string;
	search: string;
	selectedSubject: string;
}

export async function ChapterList({
	examinationId,
	examinationSlug,
	search,
	selectedSubject
}: ChapterListProps) {
	const subjects = await getSubjectEntries({ examId: examinationId });
	const chapters = await getChapterList({
		examinationId,
		search,
		subjectId: selectedSubject
	});

	return (
		<>
			<section className="flex flex-col flex-wrap items-end gap-6 bg-card p-6 md:flex-row">
				<Form
					action={`/${examinationSlug}`}
					id="form-chapter-filters"
					className="mr-auto flex w-full grow flex-col items-end gap-6 md:flex-row lg:w-fit"
				>
					<Field
						className="w-full gap-0 md:max-w-80"
						key={`chapterSearch:${search}`}
					>
						<FieldLabel>Search for Chapter</FieldLabel>

						<InputGroup>
							<InputGroupInput
								key={`chapterSearch:${search}`}
								name="chapterSearch"
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
						<FieldLabel>Search Subject</FieldLabel>
						<Select
							items={[
								...subjects,
								{ value: "all", label: "All" }
							]}
							name="searchSubject"
							defaultValue={selectedSubject}
							key={selectedSubject}
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
								{subjects.map((subject) => (
									<SelectItem
										key={subject.value}
										value={subject.value}
									>
										{subject.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</Form>

				{(search || selectedSubject !== "all") && (
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
					form="form-chapter-filters"
					className="w-full md:w-fit"
				>
					<ListFilterIcon />
					Filter
				</Button>

				<NewChapterDialog subjects={subjects} />
			</section>

			{chapters.length === 0 && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<LogsIcon />
						</EmptyMedia>

						<EmptyTitle>No Chapters to show</EmptyTitle>

						<EmptyDescription>
							Add new chapters or try changing the filters
							applied.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			<ItemGroup className="my-6">
				{chapters.map((chapter) => (
					<ChapterListItem
						chapter={chapter}
						examinationSlug={examinationSlug}
						key={chapter.id}
					/>
				))}
			</ItemGroup>
		</>
	);
}
