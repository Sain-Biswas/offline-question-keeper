import type { GetPaperListItemType } from "~/server/fetchers/get-paper-list";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
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
			<ItemContent className="gap-0">
				<ItemTitle className="mb-1 text-xl/relaxed">
					{paper.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-none font-bold">
					{paper.description ?? "No description available"}
				</ItemDescription>
				<ItemDescription className="line-clamp-none">
					{paper.note ?? "No note available"}
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
