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
	ComponentIcon,
	LinkIcon,
	LogsIcon,
	RotateCcwIcon
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

import type { GetSubjectEntriesType } from "~/server/fetchers/get-subject-entries";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from "~/shadcn/ui/combobox";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle
} from "~/shadcn/ui/item";

interface NewSubjectDialogProps {
	subjects: GetSubjectEntriesType;
	examSlug: string;
}

export function NewChapterDialog({
	examSlug,
	subjects
}: NewSubjectDialogProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(createNewChapter, initialFormState);

	const form = useForm({
		defaultValues: {
			examinationSlug: examSlug,
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
					<Button className="w-full md:w-fit">
						<CirclePlusIcon />
						Add New Chapter
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 max-w-xl scrollbar-none overflow-scroll"
			>
				<DialogHeader>
					<DialogTitle>Add New Chapter</DialogTitle>
					<DialogDescription>
						Fill in the following details to proceed further
					</DialogDescription>
				</DialogHeader>

				<Form
					action={action}
					onSubmit={() => form.handleSubmit()}
				>
					<FieldGroup>
						<form.Field name="examinationSlug">
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
										key={examSlug}
										className="hidden"
									>
										<FieldLabel>
											Examination Slug
										</FieldLabel>
										<Input
											id={field.name}
											key={examSlug}
											name={field.name}
											value={
												field.state.value ?? examSlug
											}
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

						<form.Field name="subjectId">
							{(field) => {
								const hasErrors =
									field.state.meta.errors.length > 0;
								const isInvalid =
									(field.state.meta.isTouched
										|| form.state.isSubmitted)
									&& hasErrors;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel>
											Associated Subject
										</FieldLabel>

										<Combobox
											items={subjects}
											name={field.name}
											itemToStringValue={(
												subject: GetSubjectEntriesType[number]
											) => subject.value}
										>
											<ComboboxInput placeholder="Select a Subject">
												<InputGroupAddon>
													<ComponentIcon />
												</InputGroupAddon>
											</ComboboxInput>

											<ComboboxContent>
												<ComboboxEmpty>
													No subjects available.
												</ComboboxEmpty>

												<ComboboxList>
													{(
														item: GetSubjectEntriesType[number]
													) => (
														<ComboboxItem
															key={item.key}
															value={item}
															className="flex-col items-start text-left"
														>
															<Item className="m-0 p-0">
																<ItemContent>
																	<ItemTitle>
																		{
																			item.label
																		}
																	</ItemTitle>
																	<ItemDescription>
																		{
																			item.description
																		}
																	</ItemDescription>
																</ItemContent>
															</Item>
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>

										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
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
											<FieldLabel>
												Chapter Name
											</FieldLabel>

											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													value={field.state.value}
													key={field.name}
													onChange={(event) =>
														field.handleChange(
															event.target.value
														)
													}
													aria-invalid={isInvalid}
													placeholder="Algebra"
													autoComplete="off"
												/>
												<InputGroupAddon align="inline-start">
													<LogsIcon />
												</InputGroupAddon>
											</InputGroup>

											<FieldDescription>
												Subject name associated with
												this examination.
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
											<FieldLabel>
												Chapter Slug
											</FieldLabel>

											<InputGroup>
												<InputGroupInput
													id={field.name}
													name={field.name}
													key={field.name}
													value={field.state.value}
													onChange={(event) =>
														field.handleChange(
															event.target.value
														)
													}
													aria-invalid={isInvalid}
													placeholder="algebra"
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
