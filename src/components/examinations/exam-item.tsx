import { cn } from "~/lib/utils";
import type { GetAllExaminationItemType } from "~/server/actions/get-all-examinations";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemTitle
} from "~/shadcn/ui/item";
import { ExamItemOptions } from "~/components/examinations/exam-item-options";

export function ExaminationItem({
	examination
}: {
	examination: GetAllExaminationItemType;
}) {
	return (
		<Item
			key={examination.id}
			variant="muted"
			aria-label={examination.name}
		>
			<ItemHeader className="text-base/loose font-medium">
				{examination.name}
			</ItemHeader>
			<ItemContent>
				<ItemTitle className="text-lg/relaxed">
					{examination.code}
				</ItemTitle>
				<ItemDescription className="line-clamp-none text-justify text-sm/relaxed">
					{examination.description}
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<ExamItemOptions examination={examination} />
			</ItemActions>
			<ItemFooter
				className={cn(
					"bg-linear-to-r from-transparent via-transparent via-30% font-extrabold uppercase",
					examination.isActive ?
						"to-primary text-primary"
					:	"to-destructive text-destructive"
				)}
			>
				{examination.isActive ? "Preparing" : "Not Preparing"}
			</ItemFooter>
		</Item>
	);
}
