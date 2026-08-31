"use client";

import {
	initialFormState,
	mergeForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import type { newTagSchema } from "~/options/forms/new-tag-options";
import { createNewTag } from "~/server/actions/create-new-tag";
import { z } from "zod";
import { toast } from "~/shadcn/ui/toast";
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
import { Button } from "~/shadcn/ui/button";
import { CircleXIcon, TagIcon, TagPlusIcon } from "lucide-react";
import Form from "next/form";
import { FieldGroup } from "~/shadcn/ui/field";

interface NewTagDialogProps {
	examinationId: string;
}

export function NewTagDialog({ examinationId }: NewTagDialogProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(createNewTag, initialFormState);

	const {
		AppField,
		AppForm,
		SubmitButton,
		ResetButton,
		reset,
		handleSubmit
	} = useAppForm({
		defaultValues: {
			examinationId,
			name: "",
			description: ""
		} as z.infer<typeof newTagSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Tag added successfully!",
			description: "Refresh page if you can't see new entry."
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
						<TagPlusIcon />
						Add New Tag
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
			>
				<DialogHeader>
					<DialogTitle>Add New Tag</DialogTitle>
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
							<AppField name="examinationId">
								{({ LiteralField }) => <LiteralField />}
							</AppField>

							<AppField name="name">
								{({ TextField }) => (
									<TextField
										label="Tag Name"
										placeHolder="Value Assumption"
										icon={TagIcon}
									/>
								)}
							</AppField>

							<AppField name="description">
								{({ TextareaField }) => (
									<TextareaField
										label="Description"
										maxLength={250}
										placeHolder="Optional summary or reference to help filter this tag."
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
								<SubmitButton purpose="Create" />
							</DialogFooter>
						</FieldGroup>
					</AppForm>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
