"use client";

import {
	initialFormState,
	mergeForm,
	useForm,
	useTransform
} from "@tanstack/react-form-nextjs";
import {
	CircleQuestionMarkIcon,
	CircleXIcon,
	EllipsisIcon,
	NotepadTextIcon,
	PencilSparklesIcon,
	RotateCcwIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import {
	updatePaperFormOptions,
	updatePaperSchema
} from "~/options/forms/update-paper-options";
import { updatePaperDetails } from "~/server/actions/update-paper";
import type { GetPaperListItemType } from "~/server/fetchers/get-paper-list";
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

interface PaperListItemOptionsProps {
	paper: GetPaperListItemType;
	examinationSlug: string;
}

export function PaperListItemOptions({
	paper,
	examinationSlug
}: PaperListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updatePaperDetails,
		initialFormState
	);

	const form = useForm({
		...updatePaperFormOptions,

		defaultValues: {
			paperId: paper.id,
			examinationSlug,
			name: paper.name,
			description: paper.description,
			note: paper.note
		} as z.infer<typeof updatePaperSchema>,

		validators: {
			onBlur: updatePaperSchema
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state!),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Paper Updated Successfully",
			description: "If new information is not visible, refresh the page"
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
							aria-label={`Options for `}
						>
							<EllipsisIcon />
						</Button>
					}
				/>

				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem
							render={
								<Link
									href={`/${examinationSlug}/question?paper=${paper.slug}`}
								>
									Questions
									<DropdownMenuShortcut>
										<CircleQuestionMarkIcon />
									</DropdownMenuShortcut>
								</Link>
							}
						/>
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
							<DialogTitle>Edit paper details</DialogTitle>
							<DialogDescription>
								Only the following listed fields can be updated.
								If current values are not visible please cancel
								and open again.
							</DialogDescription>
						</DialogHeader>

						<Form
							action={action}
							onSubmit={() => form.handleSubmit()}
						>
							<FieldGroup>
								<form.Field name="paperId">
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
												key={paper.id}
											>
												<FieldLabel>
													Paper ID
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														key={paper.id}
														id={field.name}
														name={field.name}
														value={paper.id}
														aria-invalid={isInvalid}
														autoComplete="off"
														onBlur={
															field.handleBlur
														}
													/>
												</InputGroup>
											</Field>
										);
									}}
								</form.Field>
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
												className="hidden"
												key={examinationSlug}
											>
												<FieldLabel>
													Examination Slug
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														key={examinationSlug}
														id={field.name}
														name={field.name}
														value={examinationSlug}
														aria-invalid={isInvalid}
														autoComplete="off"
														onBlur={
															field.handleBlur
														}
													/>
												</InputGroup>
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
												key={field.name}
											>
												<FieldLabel>
													Paper Name
												</FieldLabel>

												<InputGroup>
													<InputGroupInput
														key={field.name}
														id={field.name}
														name={field.name}
														aria-invalid={isInvalid}
														placeholder="English"
														autoComplete="off"
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
													/>
													<InputGroupAddon align="inline-start">
														<NotepadTextIcon />
													</InputGroupAddon>
												</InputGroup>

												<FieldDescription>
													Paper name associated with
													this examination.
												</FieldDescription>

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
												key={field.name}
											>
												<FieldLabel>
													Description
												</FieldLabel>

												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														key={field.name}
														name={field.name}
														aria-invalid={isInvalid}
														placeholder="Optional summary or reference tags to help filter this exam."
														autoComplete="off"
														maxLength={250}
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
												key={field.name}
											>
												<FieldLabel>Note</FieldLabel>

												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														name={field.name}
														key={field.name}
														aria-invalid={isInvalid}
														placeholder="Optional short note for future reference."
														autoComplete="off"
														maxLength={100}
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
													/>
													<InputGroupAddon align="block-end">
														<InputGroupText>
															{field.state.value
																?.length ?? 0}
															/100 Character(s)
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
													disabled={
														!canSubmit
														|| isSubmitting
													}
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
