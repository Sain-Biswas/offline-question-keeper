import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

/* Kebab-case slug: lowercase English letters, numbers, separated by single hyphens */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const newChapterSchema = z.object({
	subjectId: z.uuidv7({ error: "Please provide a valid Subject ID." }),

	name: z.string().min(1, { error: "Subject name is required." }),

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

export const newChapterFormOptions = formOptions({
	defaultValues: {
		subjectId: "",
		name: "",
		description: "",
		note: "",
		slug: ""
	} as z.infer<typeof newChapterSchema>
});
