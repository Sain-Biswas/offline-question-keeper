import { DotIcon } from "lucide-react";
import type { FetchChapterListType } from "~/server/fetchers/fetch-chapter-list";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";
import { ChapterListItemOptions } from "./item-options";

interface ChapterListItemProps {
	chapter: FetchChapterListType["chapters"][number];
}

export function ChapterListItem({ chapter }: ChapterListItemProps) {
	return (
		<Item
			className="bg-card"
			aria-label={chapter.name}
		>
			<ItemHeader className="flex-wrap justify-start gap-0 text-xs font-extrabold uppercase">
				<span>{chapter.subject}</span>
				<DotIcon />
				<span className="text-muted-foreground">{chapter.paper}</span>
			</ItemHeader>

			<ItemContent className="gap-0">
				<ItemTitle className="mb-1 text-xl/relaxed">
					{chapter.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-none font-bold">
					{chapter.description || "No description available"}
				</ItemDescription>
				<ItemDescription className="line-clamp-none">
					{chapter.note || "No note available"}
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				<ChapterListItemOptions chapter={chapter} />
			</ItemActions>

			<ItemFooter className="justify-start text-xs/relaxed font-extrabold uppercase">
				<span className="text-muted-foreground">Questions</span>{" "}
				{0}{" "}
			</ItemFooter>
		</Item>
	);
}
