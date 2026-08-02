import { z } from "zod";
import { formOptions } from "@tanstack/react-form-nextjs";

export const updateExaminationSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Examination name is required." })
		.min(3, {
			error: "Examination name must be at least 3 characters long."
		}),
	description: z.string().trim().max(250, {
		message: "Description can be at most 250 characters long."
	}),
	examinationId: z.uuidv7({ error: "Please provide a valid ID." }),
	isActive: z.literal("on").optional()
});

export const updateExaminationFormOptions = formOptions({
	defaultValues: {
		name: "",
		description: "",
		examinationId: "",
		isActive: "on"
	} as z.infer<typeof updateExaminationSchema>
});
