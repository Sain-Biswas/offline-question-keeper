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
	LandmarkIcon,
	PencilSparklesIcon,
	RotateCcwIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import {
	updateExaminationFormOptions,
	updateExaminationSchema
} from "~/options/forms/update-examination-options";
import type { GetAllExaminationItemType } from "~/server/actions/get-all-examinations";
import { updateExaminationDetails } from "~/server/actions/update-examination";
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
			isActive: examination.isActive ? "on" : undefined
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
																.length ?? 0}
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
