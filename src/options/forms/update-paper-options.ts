import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

export const updatePaperSchema = z.object({
	paperId: z.uuidv7({ error: "Please provide a valid Paper ID" }),

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
		paperId: "",
		name: "",
		note: "",
		description: ""
	} as z.infer<typeof updatePaperSchema>
});
