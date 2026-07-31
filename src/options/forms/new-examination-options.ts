import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

/* Kebab-case slug: lowercase English letters, numbers, separated by single hyphens */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const newExaminationSchema = z.object({
	name: z.string()
		.min(1, { message: "Examination name is required." })
		.min(3, {error: "Examination name must be at least 3 characters long."}),
	code: z.string()
		.min(1, { message: "Examination code is required." })
		.min(2, {error: "Examination code must be at least 2 characters long."}),
	slug: z
		.string()
		.min(1, { message: "Slug is required." })
		.regex(SLUG_REGEX, {
			message:
				"Slug must contain only lowercase letters, numbers, and hyphens."
		}),
	description: z.string()
		.trim()
		.max(250, {
			message: "Description can be at most 250 characters long."
		})
		.optional()
		.default("")
});

export const newExaminationFormOptions = formOptions(
    {
        defaultValues: {
            name: "",
            code: "",
            description: "",
            slug: ""
        } as z.infer<typeof newExaminationSchema>
    }
)