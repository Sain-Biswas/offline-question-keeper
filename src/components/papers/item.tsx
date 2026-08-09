import type { FetchPaperListType } from "~/server/fetchers/fetch-paper-list";
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
	paper: FetchPaperListType[number];
}

export function PaperListItem({ paper }: PaperListItemProps) {
	return (
		<Item
			className="bg-card"
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
				<PaperListItemOptions paper={paper} />
			</ItemActions>
			<ItemFooter className="justify-start text-xs/relaxed font-extrabold uppercase">
				<span className="text-muted-foreground">Subjects</span>{" "}
				{paper.subjectCount}{" "}
				<span className="ml-4 text-muted-foreground">Chapters</span>{" "}
				{paper.chapterCount}
			</ItemFooter>
		</Item>
	);
}
