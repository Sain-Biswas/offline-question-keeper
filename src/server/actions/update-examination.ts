"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import {
	updateExaminationFormOptions,
	updateExaminationSchema
} from "~/options/forms/update-examination-options";
import { database } from "~/server/database";
import { examinationTable } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const serverValidate = createServerValidate({
	...updateExaminationFormOptions,
	onServerValidate: updateExaminationSchema
});

export async function updateExaminationDetails(
	_prev: unknown,
	formData: FormData
) {
	try {
		const { description, name, examinationId, isActive } =
			await serverValidate(formData);

		const data = await database
			.update(examinationTable)
			.set({ description, name, isActive: isActive === "on" })
			.where(eq(examinationTable.id, examinationId))
			.returning();

		revalidatePath("/");

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) return error.formState;

		console.log("Update Examination: ", error);
		return [];
	}
}
