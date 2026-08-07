"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import { SQLiteError } from "bun:sqlite";
import { DrizzleQueryError } from "drizzle-orm";
import { refresh } from "next/cache";
import {
	newPaperFormOptions,
	newPaperSchema
} from "~/options/forms/new-paper-options";
import { database } from "~/server/database";
import { paperTable } from "~/server/database/schema";

const serverValidate = createServerValidate({
	...newPaperFormOptions,
	onServerValidate: newPaperSchema
});

export async function createNewPaper(_prev: unknown, formData: FormData) {
	try {
		const { name, description, note, slug, examinationId } =
			await serverValidate(formData);

		const data = await database
			.insert(paperTable)
			.values({ description, name, slug, note, examinationId })
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

		console.error("New Paper: ", error);

		return [];
	}
}
