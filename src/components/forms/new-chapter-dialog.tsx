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
	ComponentIcon,
	LogsIcon
} from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { slugify } from "transliteration";
import { z } from "zod";
import { newChapterSchema } from "~/options/forms/new-chapter-options";
import { createNewChapter } from "~/server/actions/create-new-chapter";
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

import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import type { FetchChapterListType } from "~/server/fetchers/fetch-chapter-list";

interface NewSubjectDialogProps {
	subjects: FetchChapterListType["subjects"];
}

export function NewChapterDialog({ subjects }: NewSubjectDialogProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(createNewChapter, initialFormState);

	const {
		AppField,
		AppForm,
		reset,
		handleSubmit,
		SubmitButton,
		ResetButton
	} = useAppForm({
		defaultValues: {
			subjectId: "",
			name: "",
			slug: "",
			description: "",
			note: ""
		} as z.infer<typeof newChapterSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Chapter added successfully!",
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
						Add New Chapter
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
			>
				<DialogHeader>
					<DialogTitle>Add New Chapter</DialogTitle>
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
							<AppField name="subjectId">
								{({ ComboboxField }) => (
									<ComboboxField
										items={subjects}
										label="Associated Subject"
										icon={ComponentIcon}
										placeHolder="Select a Subject"
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
												label="Chapter Name"
												placeHolder="Algebra"
												fieldDescription="Chapter name associated with this examination."
												icon={LogsIcon}
											/>
										)}
									/>

									<AppField name="slug">
										{({ TextField }) => (
											<TextField
												label="Chapter Slug"
												placeHolder="algebra"
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
										placeHolder="Optional summary or reference tags to help filter this Chapter."
									/>
								)}
							</AppField>

							<AppField name="note">
								{({ TextareaField }) => (
									<TextareaField
										label="Note"
										maxLength={100}
										placeHolder="Optional short note o this chapter for future reference."
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
