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
	ComponentIcon,
	EllipsisIcon,
	PencilSparklesIcon,
	RotateCcwIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useEffectEvent, useState } from "react";
import { z } from "zod";
import {
	updateSubjectFormOptions,
	updateSubjectSchema
} from "~/options/forms/update-subject-options";
import { updateSubjectDetails } from "~/server/actions/update-subject";
import type { GetSubjectListType } from "~/server/fetchers/get-subject-list";
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

interface SubjectListItemOptionsProps {
	subject: GetSubjectListType[number];
	examinationSlug: string;
}

export function SubjectListItemOptions({
	examinationSlug,
	subject
}: SubjectListItemOptionsProps) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const [state, action] = useActionState(
		updateSubjectDetails,
		initialFormState
	);

	const form = useForm({
		...updateSubjectFormOptions,

		defaultValues: {
			subjectId: subject.id,
			examinationSlug,
			name: subject.name ?? "",
			description: subject.description ?? "",
			note: subject.note ?? ""
		} as z.infer<typeof updateSubjectSchema>,

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, state),
			[state]
		)
	});

	const handleSuccess = useEffectEvent(() => {
		toast.add({
			type: "success",
			title: "Subject Updated Successfully",
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
		console.log(state);
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
							aria-label={`Options for ${subject.name}`}
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
									href={`/${examinationSlug}/question?paper=${subject.paperSlug}&subject=${subject.slug}`}
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
					<DialogContent showCloseButton={false}>
						<DialogHeader>
							<DialogTitle>Edit subject details</DialogTitle>
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
								<form.Field name="subjectId">
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
												className="hidden gap-0"
											>
												<FieldLabel>
													Subject ID
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														value={
															field.state.value
														}
														aria-invalid={isInvalid}
														autoComplete="off"
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
												className="hidden gap-0"
											>
												<FieldLabel>
													Examination Slug
												</FieldLabel>
												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														value={
															field.state.value
														}
														aria-invalid={isInvalid}
														autoComplete="off"
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
											>
												<FieldLabel>
													Subject Name
												</FieldLabel>

												<InputGroup>
													<InputGroupInput
														id={field.name}
														name={field.name}
														aria-invalid={isInvalid}
														placeholder="English"
														autoComplete="off"
														value={
															field.state.value
														}
														onChange={(event) =>
															field.handleChange(
																event.target
																	.value
															)
														}
													/>
													<InputGroupAddon align="inline-start">
														<ComponentIcon />
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
											>
												<FieldLabel>
													Description
												</FieldLabel>

												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														name={field.name}
														aria-invalid={isInvalid}
														placeholder="Optional summary or reference tags to help filter this exam."
														autoComplete="off"
														maxLength={250}
														value={
															field.state.value
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
											>
												<FieldLabel>Note</FieldLabel>

												<InputGroup>
													<InputGroupTextarea
														id={field.name}
														name={field.name}
														aria-invalid={isInvalid}
														placeholder="Optional short note for future reference."
														autoComplete="off"
														maxLength={100}
														value={
															field.state.value
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
													type="button"
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
															type="button"
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
