import type { GetSubjectListType } from "~/server/fetchers/get-subject-list";
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
	subject: GetSubjectListType[number];
	examinationSlug: string;
}

export function SubjectListItem({
	examinationSlug,
	subject
}: SubjectListItemProps) {
	return (
		<Item
			className="bg-card"
			aria-label={subject.name}
		>
			<ItemHeader className="text-xs font-extrabold uppercase">
				{subject.paperName}
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
					examinationSlug={examinationSlug}
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
