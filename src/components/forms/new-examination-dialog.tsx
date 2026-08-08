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
	LandmarkIcon,
	SignatureIcon
} from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { slugify } from "transliteration";
import { useAppForm } from "~/integrations/tanstack/forms/app-form";
import { newExaminationFormOptions } from "~/options/forms/new-examination-options";
import { createNewExamination } from "~/server/actions/create-new-examination";
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

export function NewExaminationDialog() {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(
		createNewExamination,
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
		...newExaminationFormOptions,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			title: "Examination created successfully!",
			description: "You can now start preparation for this examination.",
			type: "success"
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
					<Button size="lg">
						<CirclePlusIcon />
						Add New Examination
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 scrollbar-none overflow-scroll sm:max-w-3xl"
			>
				<DialogHeader>
					<DialogTitle>Add New Examination</DialogTitle>
					<DialogDescription>
						Fill in these information to start preparation
					</DialogDescription>
				</DialogHeader>

				<Form
					action={action}
					onSubmit={() => handleSubmit()}
				>
					<AppForm>
						<FieldGroup>
							<AppField name="name">
								{({ TextField }) => (
									<TextField
										label="Examination Name"
										placeHolder="Joint Entrance Examination"
										fieldDescription="Enter the official full title of the examination."
										icon={SignatureIcon}
									/>
								)}
							</AppField>

							<div className="space-y-3">
								<div className="grid gap-3 md:grid-cols-2">
									<AppField
										name="code"
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
												label="Examination Code"
												placeHolder="JEE"
												fieldDescription="Short identifier or acronym used across tests."
												icon={LandmarkIcon}
											/>
										)}
									/>

									<AppField name="slug">
										{({ TextField }) => (
											<TextField
												label="Examination Slug"
												placeHolder="jee"
												fieldDescription="URL-friendly key auto-generated from the code."
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
								<SubmitButton purpose="Create" />
							</DialogFooter>
						</FieldGroup>
					</AppForm>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
