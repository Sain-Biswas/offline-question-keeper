"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import {
	updateChapterFormOptions,
	updateChapterSchema
} from "~/options/forms/update-chapter-options";
import { database } from "~/server/database";
import { chapterTable } from "~/server/database/schema";

const serverValidate = createServerValidate({
	...updateChapterFormOptions,
	onServerValidate: updateChapterSchema
});

export async function updateChapterDetails(_prev: unknown, formData: FormData) {
	try {
		const { chapterId, description, name, note } =
			await serverValidate(formData);

		const data = await database
			.update(chapterTable)
			.set({ name, note, description })
			.where(eq(chapterTable.id, chapterId))
			.returning();

		refresh();

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.error("Update Subject: ", error);
		return [];
	}
}
