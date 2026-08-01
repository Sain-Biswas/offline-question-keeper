"use client";

import {
	EllipsisIcon,
	ExternalLinkIcon,
	PencilSparklesIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { GetAllExaminationItemType } from "~/server/actions/get-all-examinations";
import { Button } from "~/shadcn/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogPortal,
	DialogTitle
} from "~/shadcn/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "~/shadcn/ui/dropdown-menu";

export function ExamItemOptions({
	examination
}: {
	examination: GetAllExaminationItemType;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon"
							variant="ghost"
							aria-label={`Options for ${examination.code}`}
						>
							<EllipsisIcon />
						</Button>
					}
				/>

				<DropdownMenuPortal>
					<DropdownMenuContent>
						<Link href={`/${examination.slug}`}>
							<DropdownMenuItem>
								Open
								<DropdownMenuShortcut>
									<ExternalLinkIcon />
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem onClick={() => setOpenDialog(true)}>
							Edit
							<DropdownMenuShortcut>
								<PencilSparklesIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>

			<Dialog
				open={openDialog}
				onOpenChange={setOpenDialog}
			>
				<DialogPortal>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit examination details</DialogTitle>
							<DialogDescription>
								Only the following listed fields can be updated
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}
