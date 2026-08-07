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
	NotepadTextIcon,
	PencilSparklesIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { updatePaperSchema } from "~/options/forms/update-paper-options";
import { updatePaperDetails } from "~/server/actions/update-paper";
import type { GetPaperListItemType } from "~/server/fetchers/get-paper-list";
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

interface PaperListItemOptionsProps {
	paper: GetPaperListItemType;
	examinationSlug: string;
}

export function PaperListItemOptions({
	paper,
	examinationSlug
}: PaperListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updatePaperDetails,
		initialFormState
	);

	const {
		handleSubmit,
		AppField,
		AppForm,
		SubmitButton,
		ResetButton,
		reset
	} = useAppForm({
		defaultValues: {
			paperId: paper.id,
			name: paper.name,
			description: paper.description,
			note: paper.note
		} as z.infer<typeof updatePaperSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Paper Updated Successfully",
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
							aria-label={`Options for ${paper.name}`}
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
									href={`/${examinationSlug}/question?paper=${paper.slug}`}
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
							<DialogTitle>Edit paper details</DialogTitle>
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
									<AppField name="paperId">
										{({ LiteralField }) => <LiteralField />}
									</AppField>

									<AppField name="name">
										{({ TextField }) => (
											<TextField
												label="Paper Name"
												placeHolder="English"
												fieldDescription="Paper name associated with this examination."
												icon={NotepadTextIcon}
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
													variant="outline"
													onClick={() => reset()}
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
