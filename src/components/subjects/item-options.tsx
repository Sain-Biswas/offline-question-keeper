"use client";

import {
	CircleQuestionMarkIcon,
	EllipsisIcon,
	PencilSparklesIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { GetSubjectListType } from "~/server/fetchers/get-subject-list";
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

interface SubjectListItemOptionsProps {
	subject: GetSubjectListType[number];
	examinationSlug: string;
}

export function SubjectListItemOptions({
	examinationSlug,
	subject
}: SubjectListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon"
							variant="ghost"
							aria-label={`Options for ${subject.name}`}
						>
							<EllipsisIcon />
						</Button>
					}
				/>

				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem
							render={
								<Link
									href={`/${examinationSlug}/question?paper=${subject.paperSlug}&subject=${subject.slug}`}
								>
									Questions
									<DropdownMenuShortcut>
										<CircleQuestionMarkIcon />
									</DropdownMenuShortcut>
								</Link>
							}
						/>
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
					<DialogContent showCloseButton={false}>
						<DialogHeader>
							<DialogTitle>Edit subject details</DialogTitle>
							<DialogDescription>
								Only the following listed fields can be updated.
								If current values are not visible please cancel
								and open again.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}
