import type { FetchTagListType } from "~/server/fetchers/fetch-tag-list";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle
} from "~/shadcn/ui/item";

interface TagListItemProps {
	tag: FetchTagListType[number];
}

export function TagListItem({ tag }: TagListItemProps) {
	return (
		<Item
			className="bg-card"
			aria-label={tag.name}
		>
			<ItemContent>
				<ItemTitle className="text-xl/relaxed">{tag.name}</ItemTitle>
				<ItemDescription className="line-clamp-none font-bold">
					{tag.description}
				</ItemDescription>
			</ItemContent>
		</Item>
	);
}
