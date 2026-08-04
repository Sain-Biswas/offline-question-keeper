import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

/* Kebab-case slug: lowercase English letters, numbers, separated by single hyphens */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const updatePaperSchema = z.object({
	paperId: z.uuidv7({ error: "Please provide a valid Paper ID" }),
	examinationSlug: z
		.string()
		.min(1, { message: " Examination Slug is required." })
		.regex(SLUG_REGEX, {
			error: "Examination Slug must contain only lowercase letters, numbers, and hyphens."
		}),

	name: z.string().min(1, { error: "Paper name is required." }),

	note: z
		.string()
		.trim()
		.max(100, { error: "Short note can be at most 100 characters long." }),
	description: z
		.string()
		.trim()
		.max(250, { error: "Description can be at most 250 characters long." })
});

export const updatePaperFormOptions = formOptions({
	defaultValues: {
		examinationSlug: "",
		description: "",
		name: "",
		note: "",
		paperId: ""
	} as z.infer<typeof updatePaperSchema>
});
