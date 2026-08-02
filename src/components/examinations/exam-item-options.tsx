"use client";

import {
	initialFormState,
	mergeForm,
	useForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CircleXIcon,
	EllipsisIcon,
	ExternalLinkIcon,
	ImageIcon,
	LandmarkIcon,
	PencilSparklesIcon,
	RotateCcwIcon,
	Trash2Icon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import type { ChangeEvent } from "react";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import {
	updateExaminationFormOptions,
	updateExaminationSchema
} from "~/options/forms/update-examination-options";
import type { GetAllExaminationItemType } from "~/server/actions/get-all-examinations";
import { updateExaminationDetails } from "~/server/actions/update-examination";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
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
import {
	Field,
	FieldContent,
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
import { Switch } from "~/shadcn/ui/switch";
import { toast } from "~/shadcn/ui/toast";

export function ExamItemOptions({
	examination
}: {
	examination: GetAllExaminationItemType;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updateExaminationDetails,
		initialFormState
	);

	const form = useForm({
		...updateExaminationFormOptions,

		defaultValues: {
			examinationId: examination.id,
			name: examination.name,
			description: examination.description,
			isActive: examination.isActive ? "on" : undefined,
			image: examination.image ?? "" // Standard Data URL or URL string
		} as z.infer<typeof updateExaminationSchema>,

		validators: {
			onBlur: updateExaminationSchema
		},

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
		form.reset();
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

	// File to Base64 Data URL converter
	const handleImageChange = (
		e: ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64String = reader.result as string;
			onChange(base64String); // Set field state to data:image/...;base64,
		};
		reader.readAsDataURL(file);
	};

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
						<Link href={`/${examination.slug}`}>
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
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit examination details</DialogTitle>
							<DialogDescription>
								Only the following listed fields can be updated
							</DialogDescription>
						</DialogHeader>

						<Form
							action={action}
							onSubmit={() => form.handleSubmit()}
						>
							<FieldGroup>
								<form.Field name="image">
									{(field) => (
										<input
											type="hidden"
											name={field.name}
											value={field.state.value ?? ""}
										/>
									)}
								</form.Field>

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
												className="hidden"
											>
												<FieldLabel>
													Examination ID
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														value={examination.id}
														aria-invalid={isInvalid}
														autoComplete="off"
														onBlur={
															field.handleBlur
														}
													/>
												</InputGroup>

												{isInvalid && (
													<FieldError
														errors={
															field.state.meta
																.errors
														}
													/>
												)}
											</Field>
										);
									}}
								</form.Field>

								<form.Field name="image">
									{(field) => {
										const hasErrors =
											field.state.meta.errors.length > 0;
										const isInvalid =
											(field.state.meta.isTouched
												|| form.state.isSubmitted)
											&& hasErrors;

										return (
											<div className="flex gap-6">
												<Avatar className="size-14 rounded-none after:content-none">
													<AvatarImage
														src={
															field.state.value
															?? examination.image
															?? null
														}
														className="rounded-none object-contain!"
													/>
													<AvatarFallback className="size-14 rounded-none">
														<ImageIcon />
													</AvatarFallback>
												</Avatar>
												<Field
													data-invalid={isInvalid}
													className="gap-0"
												>
													<FieldLabel>
														Examination Image
													</FieldLabel>

													<InputGroup>
														<InputGroupInput
															type="file"
															accept="image/*"
															id={field.name}
															onChange={(e) =>
																handleImageChange(
																	e,
																	field.handleChange
																)
															}
															onBlur={
																field.handleBlur
															}
														/>
														{field.state.value && (
															<InputGroupAddon align="inline-end">
																<Button
																	type="button"
																	variant="destructive"
																	size="icon-sm"
																	onClick={() =>
																		field.handleChange(
																			""
																		)
																	}
																>
																	<Trash2Icon />
																</Button>
															</InputGroupAddon>
														)}
													</InputGroup>

													{isInvalid && (
														<FieldError
															errors={
																field.state.meta
																	.errors
															}
														/>
													)}
												</Field>
											</div>
										);
									}}
								</form.Field>

								<form.Field name="name">
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
													Examination Name
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														value={
															field.state.value
														}
														onBlur={
															field.handleBlur
														}
														onChange={(event) =>
															field.handleChange(
																event.target
																	.value
															)
														}
														aria-invalid={isInvalid}
														autoComplete="off"
													/>
													<InputGroupAddon align="inline-start">
														<LandmarkIcon />
													</InputGroupAddon>
												</InputGroup>

												{isInvalid && (
													<FieldError
														errors={
															field.state.meta
																.errors
														}
													/>
												)}
											</Field>
										);
									}}
								</form.Field>

								<form.Field name="isActive">
									{(field) => {
										const hasErrors =
											field.state.meta.errors.length > 0;
										const isInvalid =
											(field.state.meta.isTouched
												|| form.state.isSubmitted)
											&& hasErrors;

										return (
											<Field
												orientation="horizontal"
												data-invalid={isInvalid}
											>
												<FieldContent>
													<FieldLabel
														htmlFor={field.name}
													>
														Current Status
													</FieldLabel>
													<FieldDescription>
														Changing the status
														won&apos;t delete any
														data, but helps in
														filtering focused
														Examination.
													</FieldDescription>
													{isInvalid && (
														<FieldError
															errors={
																field.state.meta
																	.errors
															}
														/>
													)}
												</FieldContent>

												<Switch
													id={field.name}
													name={field.name}
													checked={
														field.state.value
														=== "on"
													}
													onCheckedChange={(
														checked
													) =>
														field.handleChange(
															checked ? "on" : (
																undefined
															)
														)
													}
													aria-invalid={isInvalid}
												/>
											</Field>
										);
									}}
								</form.Field>

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
												<FieldLabel>
													Description
												</FieldLabel>

												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														name={field.name}
														value={
															field.state.value
														}
														onBlur={
															field.handleBlur
														}
														maxLength={250}
														onChange={(event) =>
															field.handleChange(
																event.target
																	.value
															)
														}
														aria-invalid={isInvalid}
														placeholder="Optional summary or reference tags to help filter this exam."
														autoComplete="off"
													/>
													<InputGroupAddon align="block-end">
														<InputGroupText>
															{field.state.value
																?.length ?? 0}
															/250 Character(s)
														</InputGroupText>
													</InputGroupAddon>
												</InputGroup>

												{isInvalid && (
													<FieldError
														errors={
															field.state.meta
																.errors
														}
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
															onClick={(
																event
															) => {
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
													:	<PencilSparklesIcon />}
													Update
												</Button>
											</>
										)}
									</form.Subscribe>
								</DialogFooter>
							</FieldGroup>
						</Form>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	);
}
