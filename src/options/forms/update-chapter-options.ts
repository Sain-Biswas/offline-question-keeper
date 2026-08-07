import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

export const updateChapterSchema = z.object({
	chapterId: z.uuidv7({ error: "Please provide a valid Chapter ID" }),

	name: z.string().min(1, { error: "Chapter name is required." }),

	note: z
		.string()
		.trim()
		.max(100, { error: "Short note can be at most 100 characters long." }),
	description: z
		.string()
		.trim()
		.max(250, { error: "Description can be at most 250 characters long." })
});

export const updateChapterFormOptions = formOptions({
	defaultValues: {
		chapterId: "",
		description: "",
		name: "",
		note: ""
	} as z.infer<typeof updateChapterSchema>
});
