import type { FetchSubjectListType } from "~/server/fetchers/fetch-subject-list";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";
import { SubjectListItemOptions } from "./item-options";

interface SubjectListItemProps {
	subject: FetchSubjectListType["subjects"][number];
}

export function SubjectListItem({ subject }: SubjectListItemProps) {
	return (
		<Item
			className="bg-card"
			aria-label={subject.name}
		>
			<ItemHeader className="text-xs font-extrabold uppercase">
				{subject.paper}
			</ItemHeader>
			<ItemContent className="gap-0">
				<ItemTitle className="mb-1 text-xl/relaxed">
					{subject.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-none font-bold">
					{subject.description ?? "No description available"}
				</ItemDescription>
				<ItemDescription className="line-clamp-none">
					{subject.note ?? "No note available"}
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<SubjectListItemOptions
					subject={subject}
					key={`Menu: ${subject.id}`}
				/>
			</ItemActions>
			<ItemFooter className="justify-start text-xs/relaxed font-extrabold uppercase">
				<span className="text-muted-foreground">Chapters</span>{" "}
				{subject.chapterCount}{" "}
			</ItemFooter>
		</Item>
	);
}
