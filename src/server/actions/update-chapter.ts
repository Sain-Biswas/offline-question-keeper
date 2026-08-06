"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import {
	updateChapterFormOptions,
	updateChapterSchema
} from "~/options/forms/update-chapter-options";
import { database } from "../database";
import { chapterTable } from "../database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
	...updateChapterFormOptions,
	onServerValidate: updateChapterSchema
});

export async function updateChapterDetails(_prev: unknown, formData: FormData) {
	try {
		const { chapterId, description, examinationSlug, name, note } =
			await serverValidate(formData);

		const data = await database
			.update(chapterTable)
			.set({ name, note, description })
			.where(eq(chapterTable.id, chapterId))
			.returning();

		revalidatePath(`/${examinationSlug}`);

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.error("Update Subject: ", error);
		return [];
	}
}
