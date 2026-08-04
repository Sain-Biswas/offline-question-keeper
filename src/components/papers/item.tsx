import type { GetPaperListItemType } from "~/server/fetchers/get-paper-list";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";

interface PaperListItemProps {
	paper: GetPaperListItemType;
}

export function PaperListItem({ paper }: PaperListItemProps) {
	return (
		<Item
			variant="muted"
			aria-label={paper.name}
		>
			<ItemHeader className="text-sm/relaxed font-medium text-muted-foreground">
				{paper.note}
			</ItemHeader>
			<ItemContent>
				<ItemTitle className="text-xl/relaxed">{paper.name}</ItemTitle>
				<ItemDescription className="line-clamp-none text-justify text-sm/relaxed font-medium">
					{paper.description}
				</ItemDescription>
			</ItemContent>
			<ItemFooter className="justify-start text-xs/relaxed font-extrabold uppercase">
				<span className="text-muted-foreground">Subjects</span>{" "}
				{paper.subjects}{" "}
				<span className="ml-4 text-muted-foreground">Chapters</span>{" "}
				{paper.chapters}
			</ItemFooter>
		</Item>
	);
}
