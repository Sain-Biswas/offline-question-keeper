"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import {
	updateSubjectFormOptions,
	updateSubjectSchema
} from "~/options/forms/update-subject-options";
import { database } from "~/server/database";
import { subjectTable } from "~/server/database/schema";

const serverValidate = createServerValidate({
	...updateSubjectFormOptions,
	onServerValidate: updateSubjectSchema
});

export async function updateSubjectDetails(_prev: unknown, formData: FormData) {
	try {
		const { subjectId, description, name, note } =
			await serverValidate(formData);

		const data = await database
			.update(subjectTable)
			.set({ description, name, note })
			.where(eq(subjectTable.id, subjectId))
			.returning();

		refresh();

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.error("Update Subject: ", error);
		return [];
	}
}
