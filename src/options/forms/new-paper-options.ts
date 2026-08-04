import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

/* Kebab-case slug: lowercase English letters, numbers, separated by single hyphens */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const newPaperSchema = z.object({
	examinationId: z.uuidv7({
		error: "Please provide a valid Examination ID."
	}),
	examinationSlug: z
		.string()
		.min(1, { message: " Examination Slug is required." })
		.regex(SLUG_REGEX, {
			error: "Examination Slug must contain only lowercase letters, numbers, and hyphens."
		}),
	name: z.string().min(1, { error: "Paper name is required." }),

	slug: z.string().min(1, { error: "Slug is required." }).regex(SLUG_REGEX, {
		error: "Slug must contain only lowercase letters, numbers, and hyphens."
	}),

	note: z
		.string()
		.trim()
		.max(100, { error: "Short note can be at most 100 characters long." }),
	description: z
		.string()
		.trim()
		.max(250, { error: "Description can be at most 250 characters long." })
});

export const newPaperFormOptions = formOptions({
	defaultValues: {
		description: "",
		name: "",
		note: "",
		slug: ""
	} as z.infer<typeof newPaperSchema>
});
