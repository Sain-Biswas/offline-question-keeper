import { ExaminationItemOptions } from "~/components/examinations/item-options";
import { cn } from "~/lib/utils";
import type { FetchExaminationListType } from "~/server/fetchers/fetch-examination-list";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
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
import { Skeleton } from "~/shadcn/ui/skeleton";

interface ExaminationItemProps {
	examination: FetchExaminationListType[number];
}

export function ExaminationItem({ examination }: ExaminationItemProps) {
	return (
		<Item
			key={examination.id}
			aria-label={examination.name}
			className="bg-card"
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
				<ExaminationItemOptions examination={examination} />
			</ItemActions>
			<ItemFooter className="flex-col">
				<div className="flex w-full flex-wrap justify-start gap-x-6 font-bold uppercase">
					<p>
						<span className="mr-2 text-muted-foreground">
							Papers
						</span>{" "}
						{examination.paperCount}
					</p>
					<p>
						<span className="mr-2 text-muted-foreground">
							Subjects
						</span>{" "}
						{examination.subjectCount}
					</p>
					<p>
						<span className="mr-2 text-muted-foreground">
							Chapters
						</span>{" "}
						{examination.chapterCount}
					</p>
				</div>
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
