"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import {
	updatePaperFormOptions,
	updatePaperSchema
} from "~/options/forms/update-paper-options";
import { database } from "~/server/database";
import { paperTable } from "~/server/database/schema";

const serverValidate = createServerValidate({
	...updatePaperFormOptions,
	onServerValidate: updatePaperSchema
});

export async function updatePaperDetails(_prev: unknown, formData: FormData) {
	try {
		const { description, name, note, paperId } =
			await serverValidate(formData);

		const data = await database
			.update(paperTable)
			.set({ description, name, note })
			.where(eq(paperTable.id, paperId))
			.returning();

		refresh();

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.log("Update Paper: ", error);
		return [];
	}
}
