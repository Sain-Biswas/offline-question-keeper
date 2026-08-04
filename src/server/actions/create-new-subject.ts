"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import { SQLiteError } from "bun:sqlite";
import { DrizzleQueryError } from "drizzle-orm";
import {
	newSubjectFormOptions,
	newSubjectSchema
} from "~/options/forms/new-subject-options";
import { database } from "~/server/database";
import { subjectTable } from "~/server/database/schema";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
	...newSubjectFormOptions,
	onServerValidate: newSubjectSchema
});

export async function createNewSubject(_prev: unknown, formData: FormData) {
	try {
		const { description, examinationSlug, name, note, paperId, slug } =
			await serverValidate(formData);

		const data = await database
			.insert(subjectTable)
			.values({ paperId, name, slug, description, note })
			.returning();

		revalidatePath(`/${examinationSlug}`);

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) {
			return error.formState;
		} else if (error instanceof DrizzleQueryError) {
			if (error.cause instanceof SQLiteError) {
				if (error.cause.code === "SQLITE_CONSTRAINT_UNIQUE") {
					const slugError = {
						code: "custom",
						path: ["slug"],
						message: "An examination with this slug already exists."
					};

					return {
						values: Object.fromEntries(formData.entries()),
						errorMap: {
							onServer: {
								form: {
									slug: [slugError]
								},
								fields: {
									slug: [slugError]
								}
							}
						},
						errors: [
							{
								slug: [slugError]
							}
						]
					};
				}
			}
		}

		console.error("New Paper: ", error);

		return [];
	}
}
