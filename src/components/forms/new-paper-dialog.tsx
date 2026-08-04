"use client";

import {
	initialFormState,
	mergeForm,
	useForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CirclePlusIcon,
	CircleXIcon,
	LinkIcon,
	NotepadTextIcon,
	RotateCcwIcon
} from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { slugify } from "transliteration";
import { z } from "zod";
import {
	newPaperFormOptions,
	newPaperSchema
} from "~/options/forms/new-paper-options";
import { createNewPaper } from "~/server/actions/create-new-paper";
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
} from "~/shadcn/ui/field";
import { Input } from "~/shadcn/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea
} from "~/shadcn/ui/input-group";
import { Spinner } from "~/shadcn/ui/spinner";
import { toast } from "~/shadcn/ui/toast";

interface NewPaperDialogProps {
	examinationId: string;
}

export function NewPaperDialog({ examinationId }: NewPaperDialogProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(createNewPaper, initialFormState);

	const form = useForm({
		...newPaperFormOptions,
		defaultValues: {
			examinationId,
			name: "",
			slug: "",
			description: "",
			note: ""
		} as z.infer<typeof newPaperSchema>,
		validators: {
			onBlur: newPaperSchema
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Paper added successfully!",
			description: "You can now add subjects to proceed further."
		});
		form.reset();
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
						Add New Paper
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 max-w-xl scrollbar-none overflow-scroll"
			>
				<DialogHeader>
					<DialogTitle>Add New Paper</DialogTitle>
					<DialogDescription>
						Fill in the following details to proceed further
					</DialogDescription>
				</DialogHeader>

				<Form
					action={action}
					onSubmit={() => form.handleSubmit()}
				>
					<FieldGroup>
						<form.Field name="examinationId">
							{(field) => {
								const hasErrors =
									field.state.meta.errors.length > 0;
								const isInvalid =
									(field.state.meta.isTouched
										|| form.state.isSubmitted)
									&& hasErrors;

								return (
									<Field
										data-invalid={isInvalid}
										key={examinationId}
										className="hidden"
									>
										<FieldLabel>Examination ID</FieldLabel>
										<Input
											id={field.name}
											key={examinationId}
											name={field.name}
											value={examinationId}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(
													event.target.value
												)
											}
											aria-invalid={isInvalid}
											autoComplete="off"
										/>
									</Field>
								);
							}}
						</form.Field>

						<div className="grid gap-6 md:grid-cols-2">
							<form.Field
								name="name"
								listeners={{
									onChange: ({ fieldApi, value }) => {
										fieldApi.form.setFieldValue(
											"slug",
											slugify(value)
										);
									}
								}}
							>
								{(field) => {
									const hasErrors =
										field.state.meta.errors.length > 0;
									const isInvalid =
										(field.state.meta.isTouched
											|| form.state.isSubmitted)
										&& hasErrors;

									return (
										<Field
											data-invalid={isInvalid}
											className="gap-0"
										>
											<FieldLabel>Paper Name</FieldLabel>

											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(event) =>
														field.handleChange(
															event.target.value
														)
													}
													aria-invalid={isInvalid}
													placeholder="English"
													autoComplete="off"
												/>
												<InputGroupAddon align="inline-start">
													<NotepadTextIcon />
												</InputGroupAddon>
											</InputGroup>

											<FieldDescription>
												Paper name associated with this
												examination.
											</FieldDescription>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="slug">
								{(field) => {
									const hasErrors =
										field.state.meta.errors.length > 0;
									const isInvalid =
										(field.state.meta.isTouched
											|| form.state.isSubmitted)
										&& hasErrors;

									return (
										<Field
											data-invalid={isInvalid}
											className="gap-0"
										>
											<FieldLabel>Paper Slug</FieldLabel>

											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(event) =>
														field.handleChange(
															event.target.value
														)
													}
													aria-invalid={isInvalid}
													placeholder="english"
													autoComplete="off"
												/>
												<InputGroupAddon align="inline-start">
													<LinkIcon />
												</InputGroupAddon>
											</InputGroup>

											<FieldDescription>
												URL-friendly key auto-generated
												from the name.
											</FieldDescription>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							</form.Field>
						</div>

						<form.Field name="description">
							{(field) => {
								const hasErrors =
									field.state.meta.errors.length > 0;
								const isInvalid =
									(field.state.meta.isTouched
										|| form.state.isSubmitted)
									&& hasErrors;

								return (
									<Field
										data-invalid={isInvalid}
										className="gap-0"
									>
										<FieldLabel>Description</FieldLabel>

										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												maxLength={250}
												onChange={(event) =>
													field.handleChange(
														event.target.value
													)
												}
												aria-invalid={isInvalid}
												placeholder="Optional summary or reference tags to help filter this exam."
												autoComplete="off"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText>
													{field.state.value?.length
														?? 0}
													/250 Character(s)
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>

										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="note">
							{(field) => {
								const hasErrors =
									field.state.meta.errors.length > 0;
								const isInvalid =
									(field.state.meta.isTouched
										|| form.state.isSubmitted)
									&& hasErrors;

								return (
									<Field
										data-invalid={isInvalid}
										className="gap-0"
									>
										<FieldLabel>Note</FieldLabel>

										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												maxLength={100}
												onChange={(event) =>
													field.handleChange(
														event.target.value
													)
												}
												aria-invalid={isInvalid}
												placeholder="Optional short note for future reference."
												autoComplete="off"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText>
													{field.state.value?.length
														?? 0}
													/100 Character(s)
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>

										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						</form.Field>

						<DialogFooter>
							<form.Subscribe
								selector={(formState) => [
									formState.canSubmit,
									formState.isSubmitting
								]}
							>
								{([canSubmit, isSubmitting]) => (
									<>
										<Button
											variant="destructive"
											disabled={isSubmitting}
											onClick={(event) => {
												event.preventDefault();
												event.stopPropagation();
												form.reset();
											}}
										>
											<RotateCcwIcon />
											Reset
										</Button>

										<DialogClose
											render={
												<Button
													variant="outline"
													onClick={(event) => {
														event.preventDefault();
														event.stopPropagation();
														form.reset();
													}}
												>
													<CircleXIcon />
													Cancel
												</Button>
											}
										/>

										<Button
											type="submit"
											disabled={
												!canSubmit || isSubmitting
											}
										>
											{isSubmitting ?
												<Spinner />
											:	<CirclePlusIcon />}
											Create
										</Button>
									</>
								)}
							</form.Subscribe>
						</DialogFooter>
					</FieldGroup>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
