"use client";

import {
	initialFormState,
	mergeForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CircleQuestionMarkIcon,
	CircleXIcon,
	EllipsisIcon,
	LogsIcon,
	PencilSparklesIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { updateChapterSchema } from "~/options/forms/update-chapter-options";
import { updateChapterDetails } from "~/server/actions/update-chapter";
import type { GetChapterListType } from "~/server/fetchers/get-chapter-list";
import { Button } from "~/shadcn/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { FieldGroup } from "~/shadcn/ui/field";
import { toast } from "~/shadcn/ui/toast";

interface ChapterListItemOptionsProps {
	chapter: GetChapterListType[number];
	examinationSlug: string;
}

export function ChapterListItemOptions({
	examinationSlug,
	chapter
}: ChapterListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updateChapterDetails,
		initialFormState
	);

	const {
		AppField,
		AppForm,
		handleSubmit,
		reset,
		SubmitButton,
		ResetButton
	} = useAppForm({
		defaultValues: {
			chapterId: chapter.id,
			name: chapter.name ?? "",
			description: chapter.description ?? "",
			note: chapter.note ?? ""
		} as z.infer<typeof updateChapterSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Chapter Updated Successfully",
			description: "If new information is not visible, refresh the page"
		});
		reset();
		setOpenDialog(false);
	});

	const handleFailure = useEffectEvent(() => {
		toast.add({
			type: "error",
			title: "Something went wrong",
			description: "Please check log for finding the reason"
		});
	});

	useEffect(() => {
		console.log(state);
		if (Array.isArray(state)) {
			if (state.length > 0) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				handleSuccess();
			} else {
				handleFailure();
			}
		}
	}, [state]);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							size="icon"
							variant="ghost"
							aria-label={`Options for ${chapter.name}`}
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
									href={`/${examinationSlug}/question?paper=${chapter.paperSlug}&subject=${chapter.subjectSlug}&chapter=${chapter.slug}`}
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
					<DialogContent
						showCloseButton={false}
						className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
					>
						<DialogHeader>
							<DialogTitle>Edit chapter details</DialogTitle>
							<DialogDescription>
								Only the following listed fields can be updated.
								If current values are not visible please cancel
								and open again.
							</DialogDescription>
						</DialogHeader>

						<Form
							action={action}
							onSubmit={() => handleSubmit()}
						>
							<AppForm>
								<FieldGroup>
									<AppField name="chapterId">
										{({ LiteralField }) => <LiteralField />}
									</AppField>

									<AppField name="name">
										{({ TextField }) => (
											<TextField
												label="Subject Name"
												placeHolder="English"
												fieldDescription="Paper name associated with this examination."
												icon={LogsIcon}
											/>
										)}
									</AppField>

									<AppField name="description">
										{({ TextareaField }) => (
											<TextareaField
												label="Description"
												maxLength={250}
												placeHolder="Optional summary or reference tags to help filter this exam."
											/>
										)}
									</AppField>

									<AppField name="note">
										{({ TextareaField }) => (
											<TextareaField
												label="Note"
												maxLength={100}
												placeHolder="Optional short note for future reference."
											/>
										)}
									</AppField>

									<DialogFooter>
										<ResetButton />
										<DialogClose
											render={
												<Button
													type="button"
													variant="outline"
													onClick={(event) => {
														event.preventDefault();
														event.stopPropagation();
														reset();
													}}
												>
													<CircleXIcon />
													Cancel
												</Button>
											}
										/>
										<SubmitButton purpose="Update" />
									</DialogFooter>
								</FieldGroup>
							</AppForm>
						</Form>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}
