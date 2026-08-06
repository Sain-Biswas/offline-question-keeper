import { DotIcon } from "lucide-react";
import type { GetChapterListType } from "~/server/fetchers/get-chapter-list";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";

interface ChapterListItemProps {
	chapter: GetChapterListType[number];
	examinationSlug: string;
}

export function ChapterListItem({
	chapter,
	examinationSlug
}: ChapterListItemProps) {
	return (
		<Item
			variant="muted"
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
					{chapter.description ?? "No description available"}
				</ItemDescription>
				<ItemDescription className="line-clamp-none">
					{chapter.note ?? "No note available"}
				</ItemDescription>
			</ItemContent>
		</Item>
	);
}
