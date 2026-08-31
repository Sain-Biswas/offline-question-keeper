import { formOptions } from "@tanstack/react-form-nextjs";
import { z } from "zod";

export const newTagSchema = z.object({
	examinationId: z.uuidv7({
		error: "Please provide a valid Examination ID."
	}),

	name: z.string().min(1, { error: "Paper name is required." }),
	description: z
		.string()
		.trim()
		.max(250, { error: "Description can be at most 250 characters long." })
});

export const newTagFormOptions = formOptions({
	defaultValues: {
		description: "",
		examinationId: "",
		name: ""
	} as z.infer<typeof newTagSchema>
});
