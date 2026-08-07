"use server";

import {
	ServerValidateError,
	createServerValidate
} from "@tanstack/react-form-nextjs";
import { DrizzleQueryError } from "drizzle-orm";
import {
	newExaminationFormOptions,
	newExaminationSchema
} from "~/options/forms/new-examination-options";
import { database } from "~/server/database";
import { examinationTable } from "~/server/database/schema";

import { SQLiteError } from "bun:sqlite";
import { refresh } from "next/cache";

const serverValidate = createServerValidate({
	...newExaminationFormOptions,
	onServerValidate: newExaminationSchema
});

export async function createNewExamination(_prev: unknown, formData: FormData) {
	try {
		const { code, description, name, slug } =
			await serverValidate(formData);

		const data = await database
			.insert(examinationTable)
			.values({
				code,
				name,
				slug,
				description
			})
			.returning();

		refresh();

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

		console.error("New Examination: ", error);

		return [];
	}
}
