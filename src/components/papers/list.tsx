import { getPaperList } from "~/server/fetchers/get-paper-list";
import { NewPaperDialog } from "../forms/new-paper-dialog";
import { ItemGroup } from "~/shadcn/ui/item";
import { PaperListItem } from "./item";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";
import {
	ListFilterIcon,
	NotepadTextIcon,
	RotateCwIcon,
	TextSearchIcon
} from "lucide-react";
import Form from "next/form";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { Button } from "~/shadcn/ui/button";
import Link from "next/link";

interface PaperListProps {
	examinationId: string;
	search: string;
	examinationSlug: string;
}

export async function PaperList({
	examinationId,
	examinationSlug,
	search
}: PaperListProps) {
	const papers = await getPaperList({ examinationId, search });

	return (
		<>
			<section className="flex flex-col items-end gap-6 bg-card p-6 md:flex-row">
				<Form
					action={`/examination/${examinationSlug}`}
					className="flex w-full flex-col items-end gap-6 md:flex-row"
				>
					<Field
						className="mr-auto w-full gap-0 md:max-w-72"
						key={`paperSearch:${search}`}
					>
						<FieldLabel>Search for Paper</FieldLabel>
						<InputGroup>
							<InputGroupInput
								name="paperSearch"
								autoComplete="off"
								placeholder="Search for name and description"
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
								<Link href={`/examination/${examinationSlug}`}>
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

				<NewPaperDialog examinationId={examinationId} />
			</section>

			{papers.length === 0 && (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<NotepadTextIcon />
						</EmptyMedia>

						<EmptyTitle>No Papers to show</EmptyTitle>

						<EmptyDescription>
							Add new papers or try changing the filters applied.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}

			<ItemGroup className="my-6">
				{papers.map((paper) => (
					<PaperListItem
						examinationSlug={examinationSlug}
						paper={paper}
						key={paper.id}
					/>
				))}
			</ItemGroup>
		</>
	);
}
