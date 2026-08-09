"use client";

import {
	initialFormState,
	mergeForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	ArrowUpRight,
	CirclePlusIcon,
	CircleXIcon,
	NotepadTextIcon
} from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { slugify } from "transliteration";
import { z } from "zod";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { newSubjectSchema } from "~/options/forms/new-subject-options";
import { createNewSubject } from "~/server/actions/create-new-subject";
import type { FetchSubjectListType } from "~/server/fetchers/fetch-subject-list";
import { Button } from "~/shadcn/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/shadcn/ui/dialog";
import { FieldDescription, FieldGroup } from "~/shadcn/ui/field";
import { toast } from "~/shadcn/ui/toast";

interface NewSubjectDialogProps {
	papers: FetchSubjectListType["paperEntries"];
}

export function NewSubjectDialog({ papers }: NewSubjectDialogProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(createNewSubject, initialFormState);

	const {
		AppField,
		AppForm,
		reset,
		handleSubmit,
		SubmitButton,
		ResetButton
	} = useAppForm({
		defaultValues: {
			paperId: "",
			name: "",
			slug: "",
			description: "",
			note: ""
		} as z.infer<typeof newSubjectSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Subject added successfully!",
			description: "You can now add chapters to proceed further."
		});
		reset();
		setOpen(false);
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
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger
				render={
					<Button
						className="w-full md:w-fit"
						size="lg"
					>
						<CirclePlusIcon />
						Add Subject Paper
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
			>
				<DialogHeader>
					<DialogTitle>Add New Subject</DialogTitle>
					<DialogDescription>
						Fill in the following details to proceed further
					</DialogDescription>
				</DialogHeader>

				<Form
					action={action}
					onSubmit={() => handleSubmit()}
				>
					<AppForm>
						<FieldGroup>
							<AppField name="paperId">
								{({ ComboboxField }) => (
									<ComboboxField
										items={papers}
										label="Associated Paper"
										icon={NotepadTextIcon}
										placeHolder="Select a Paper"
									/>
								)}
							</AppField>

							<div className="space-y-3">
								<div className="grid gap-3 md:grid-cols-2">
									<AppField
										name="name"
										listeners={{
											onChange: ({ fieldApi, value }) => {
												fieldApi.form.setFieldValue(
													"slug",
													slugify(value)
												);
											}
										}}
										// eslint-disable-next-line react/no-children-prop
										children={({ TextField }) => (
											<TextField
												label="Subject Name"
												placeHolder="English"
												fieldDescription="Subject name associated with this examination."
												icon={NotepadTextIcon}
											/>
										)}
									/>

									<AppField name="slug">
										{({ TextField }) => (
											<TextField
												label="Subject Slug"
												placeHolder="english"
												fieldDescription="URL-friendly key auto-generated from the name."
												icon={ArrowUpRight}
											/>
										)}
									</AppField>
								</div>
								<FieldDescription className="text-chart-1">
									If slug don&apos;t auto update cancel the
									form and start again.
								</FieldDescription>
							</div>

							<AppField name="description">
								{({ TextareaField }) => (
									<TextareaField
										label="Description"
										maxLength={250}
										placeHolder="Optional summary or reference tags to help filter this Subject."
									/>
								)}
							</AppField>

							<AppField name="note">
								{({ TextareaField }) => (
									<TextareaField
										label="Note"
										maxLength={100}
										placeHolder="Optional short note on this subject for future reference."
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
		</Dialog>
	);
}
