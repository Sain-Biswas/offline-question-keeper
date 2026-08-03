import { cn } from "~/lib/utils";
import type { GetAllExaminationItemType } from "~/server/actions/get-all-examinations";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemMedia,
	ItemTitle
} from "~/shadcn/ui/item";
import { ExamItemOptions } from "~/components/examinations/exam-item-options";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import { Skeleton } from "~/shadcn/ui/skeleton";

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
			<ItemMedia
				variant="image"
				className="size-14"
			>
				<Avatar className="size-14 rounded-none after:content-none">
					<AvatarImage
						src={examination.image ?? null}
						alt={examination.code}
						className="size-14 rounded-none object-contain!"
					/>
					<AvatarFallback
						className="size-14 rounded-none"
						render={<Skeleton />}
					/>
				</Avatar>
			</ItemMedia>
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
			<ItemFooter className="flex-col">
				<div
					className={cn(
						"w-full bg-linear-to-r from-transparent via-transparent via-30% font-extrabold uppercase",
						examination.isActive ?
							"to-primary text-primary"
						:	"to-destructive text-destructive"
					)}
				>
					{examination.isActive ? "Preparing" : "Not Preparing"}
				</div>
			</ItemFooter>
		</Item>
	);
}
