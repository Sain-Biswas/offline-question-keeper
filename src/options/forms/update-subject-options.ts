import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

export const updateSubjectSchema = z.object({
	subjectId: z.uuidv7({ error: "Please provide a valid Subject ID" }),

	name: z.string().min(1, { error: "Subject name is required." }),

	note: z
		.string()
		.trim()
		.max(100, { error: "Short note can be at most 100 characters long." }),
	description: z
		.string()
		.trim()
		.max(250, { error: "Description can be at most 250 characters long." })
});

export const updateSubjectFormOptions = formOptions({
	defaultValues: {
		subjectId: "",
		name: "",
		description: "",
		note: ""
	} as z.infer<typeof updateSubjectSchema>
});
