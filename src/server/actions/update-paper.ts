"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import {
	updatePaperFormOptions,
	updatePaperSchema
} from "~/options/forms/update-paper-options";
import { database } from "../database";
import { paperTable } from "../database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
	...updatePaperFormOptions,
	onServerValidate: updatePaperSchema
});

export async function updatePaperDetails(_prev: unknown, formData: FormData) {
	try {
		const { description, examinationSlug, name, note, paperId } =
			await serverValidate(formData);

		const data = await database
			.update(paperTable)
			.set({ description, name, note })
			.where(eq(paperTable.id, paperId))
			.returning();

		revalidatePath(`/${examinationSlug}`);

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.log("Update Paper: ", error);
		return [];
	}
}
