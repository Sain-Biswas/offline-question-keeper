"use client";

import {
	initialFormState,
	mergeForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CircleQuestionMarkIcon,
	CircleXIcon,
	ComponentIcon,
	EllipsisIcon,
	PencilSparklesIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { updateSubjectSchema } from "~/options/forms/update-subject-options";
import { updateSubjectDetails } from "~/server/actions/update-subject";
import type { FetchSubjectListType } from "~/server/fetchers/fetch-subject-list";
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

interface SubjectListItemOptionsProps {
	subject: FetchSubjectListType["subjects"][number];
}

export function SubjectListItemOptions({
	subject
}: SubjectListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const { slug } = useParams<{ slug: string }>();

	const [state, action] = useActionState(
		updateSubjectDetails,
		initialFormState
	);

	const {
		handleSubmit,
		AppForm,
		AppField,
		reset,
		SubmitButton,
		ResetButton
	} = useAppForm({
		defaultValues: {
			subjectId: subject.id,
			name: subject.name ?? "",
			description: subject.description ?? "",
			note: subject.note ?? ""
		} as z.infer<typeof updateSubjectSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Subject Updated Successfully",
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
									href={`/examination/${slug}/question?paper=${subject.paperSlug}&subject=${subject.slug}`}
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
							<DialogTitle>Edit subject details</DialogTitle>
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
									<AppField name="subjectId">
										{({ LiteralField }) => <LiteralField />}
									</AppField>

									<AppField name="name">
										{({ TextField }) => (
											<TextField
												label="Subject Name"
												fieldDescription="Paper name associated with this examination."
												icon={ComponentIcon}
												placeHolder="English"
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
													key="form-dialog-subject-cancel"
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
