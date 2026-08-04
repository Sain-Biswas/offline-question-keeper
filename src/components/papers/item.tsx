import type { GetPaperListItemType } from "~/server/fetchers/get-paper-list";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";
import { PaperListItemOptions } from "./item-options";

interface PaperListItemProps {
	paper: GetPaperListItemType;
	examinationSlug: string;
}

export function PaperListItem({ paper, examinationSlug }: PaperListItemProps) {
	return (
		<Item
			variant="muted"
			aria-label={paper.name}
		>
			<ItemHeader className="text-sm/relaxed font-medium text-muted-foreground">
				{paper.note ?? "No note available"}
			</ItemHeader>
			<ItemContent>
				<ItemTitle className="text-xl/relaxed">{paper.name}</ItemTitle>
				<ItemDescription className="line-clamp-none text-justify text-sm/relaxed font-medium">
					{paper.description ?? "No description available"}
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<PaperListItemOptions
					examinationSlug={examinationSlug}
					paper={paper}
				/>
			</ItemActions>
			<ItemFooter className="justify-start text-xs/relaxed font-extrabold uppercase">
				<span className="text-muted-foreground">Subjects</span>{" "}
				{paper.subjects}{" "}
				<span className="ml-4 text-muted-foreground">Chapters</span>{" "}
				{paper.chapters}
			</ItemFooter>
		</Item>
	);
}
