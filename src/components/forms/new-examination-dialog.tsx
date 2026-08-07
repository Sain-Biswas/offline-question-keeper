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
	LandmarkIcon,
	LinkIcon,
	RotateCcwIcon,
	SignatureIcon
} from "lucide-react";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { slugify } from "transliteration";
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
} from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea
} from "~/shadcn/ui/input-group";
import { Spinner } from "~/shadcn/ui/spinner";
import { toast } from "~/shadcn/ui/toast";

export function NewExaminationDialog() {
	const [open, setOpen] = useState<boolean>(false);

	const [state, action] = useActionState(
		createNewExamination,
		initialFormState
	);

	const form = useForm({
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
						Add New Examination
					</Button>
				}
			/>

			<DialogContent
				showCloseButton={false}
				className="max-h-11/12 w-11/12 max-w-lg scrollbar-none overflow-scroll"
			>
				<DialogHeader>
					<DialogTitle>Add New Examination</DialogTitle>
					<DialogDescription>
						Fill in these information to start preparation
					</DialogDescription>
				</DialogHeader>

				<form
					action={action}
					onSubmit={() => form.handleSubmit()}
				>
					<FieldGroup>
						<form.Field name="name">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched
									&& !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Examination Name
										</FieldLabel>

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
												placeholder="Joint Entrance Examination"
												autoComplete="off"
											/>
											<InputGroupAddon align="inline-start">
												<SignatureIcon />
											</InputGroupAddon>
										</InputGroup>

										<FieldDescription>
											Enter the official full title of the
											examination.
										</FieldDescription>

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
								name="code"
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
									const isInvalid =
										field.state.meta.isTouched
										&& !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>
												Examination Code
											</FieldLabel>

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
													placeholder="JEE"
													autoComplete="off"
												/>
												<InputGroupAddon align="inline-start">
													<LandmarkIcon />
												</InputGroupAddon>
											</InputGroup>

											<FieldDescription>
												Short identifier or acronym used
												across tests.
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
									const isInvalid =
										field.state.meta.isTouched
										&& !field.state.meta.isValid;

									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel>
												Examination Slug
											</FieldLabel>

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
													placeholder="jee"
													autoComplete="off"
												/>
												<InputGroupAddon align="inline-start">
													<LinkIcon />
												</InputGroupAddon>
											</InputGroup>

											<FieldDescription>
												URL-friendly key auto-generated
												from the code.
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
								const isInvalid =
									field.state.meta.isTouched
									&& !field.state.meta.isValid;

								return (
									<Field data-invalid={isInvalid}>
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
											onClick={(event) => {
												event.preventDefault();
												event.stopPropagation();
												form.reset();
											}}
											disabled={isSubmitting}
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
											disabled={!canSubmit}
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
				</form>
			</DialogContent>
		</Dialog>
	);
}
