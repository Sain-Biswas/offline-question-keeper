"use client";

import {
	initialFormState,
	mergeForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CircleXIcon,
	EllipsisIcon,
	ExternalLinkIcon,
	LandmarkIcon,
	PencilSparklesIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { updateExaminationSchema } from "~/options/forms/update-examination-options";
import { updateExaminationDetails } from "~/server/actions/update-examination";
import type { FetchExaminationListType } from "~/server/fetchers/fetch-examination-list";
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

interface ExaminationItemOptionsProps {
	examination: Omit<
		FetchExaminationListType[number],
		"paperCount" | "subjectCount" | "chapterCount"
	>;
}

export function ExaminationItemOptions({
	examination
}: ExaminationItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updateExaminationDetails,
		initialFormState
	);

	const {
		AppField,
		AppForm,
		reset,
		handleSubmit,
		SubmitButton,
		ResetButton
	} = useAppForm({
		defaultValues: {
			examinationId: examination.id,
			name: examination.name,
			description: examination.description,
			isActive: examination.isActive ? "on" : undefined,
			image: examination.image
		} as z.infer<typeof updateExaminationSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Examination Updated Successfully",
			description: "If new data is not visible, refresh the page"
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
							aria-label={`Options for ${examination.code}`}
						>
							<EllipsisIcon />
						</Button>
					}
				/>

				<DropdownMenuPortal>
					<DropdownMenuContent>
						<Link href={`/examination/${examination.slug}`}>
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
					<DialogContent
						className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
						showCloseButton={false}
					>
						<DialogHeader>
							<DialogTitle>Edit examination details</DialogTitle>
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
									<AppField name="examinationId">
										{({ LiteralField }) => <LiteralField />}
									</AppField>

									<AppField name="image">
										{({ ImageDataField }) => (
											<ImageDataField label="Examination Image" />
										)}
									</AppField>

									<AppField name="name">
										{({ TextField }) => (
											<TextField
												label="Examination Name"
												placeHolder=""
												fieldDescription=""
												icon={LandmarkIcon}
											/>
										)}
									</AppField>

									<AppField name="isActive">
										{({ SwitchField }) => (
											<SwitchField
												label="Current Preparing"
												fieldDescription="Changing the status won't delete any data, but helps in filtering focused Examination."
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
