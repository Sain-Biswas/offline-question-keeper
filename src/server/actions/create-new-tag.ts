"use server";

import {
	createServerValidate,
	ServerValidateError
} from "@tanstack/react-form-nextjs";
import {
	newTagFormOptions,
	newTagSchema
} from "~/options/forms/new-tag-options";
import { database } from "../database";
import { tagsTable } from "../database/schema";
import { refresh } from "next/cache";

const serverValidate = createServerValidate({
	...newTagFormOptions,
	onServerValidate: newTagSchema
});

export async function createNewTag(_prev: unknown, formData: FormData) {
	try {
		const { name, description, examinationId } =
			await serverValidate(formData);

		const data = await database
			.insert(tagsTable)
			.values({ description, name, examinationId })
			.returning();

		refresh();

		return data;
	} catch (error) {
		if (error instanceof ServerValidateError) {
			return error.formState;
		}

		console.error("New Tag: ", error);

		return [];
	}
}
