"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import {
	updateSubjectFormOptions,
	updateSubjectSchema
} from "~/options/forms/update-subject-options";
import { database } from "~/server/database";
import { subjectTable } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
	...updateSubjectFormOptions,
	onServerValidate: updateSubjectSchema
});

export async function updateSubjectDetails(_prev: unknown, formData: FormData) {
	try {
		const { subjectId, description, examinationSlug, name, note } =
			await serverValidate(formData);

		const data = await database
			.update(subjectTable)
			.set({ description, name, note })
			.where(eq(subjectTable.id, subjectId))
			.returning();

		revalidatePath(`/${examinationSlug}`);

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.error("Update Subject: ", error);
		return [];
	}
}
