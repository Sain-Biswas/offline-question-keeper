"use server"

import { ServerValidateError, createServerValidate } from "@tanstack/react-form-nextjs"
import { newExaminationFormOptions, newExaminationSchema } from "~/options/forms/new-examination-options"

const serverValidate = createServerValidate(
    {
        ...newExaminationFormOptions,
        onServerValidate: newExaminationSchema
    }
)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export async function createNewExamination(_prev: unknown, formData: FormData){

    try {

        const validatedData = await serverValidate(formData)
        console.log("validatedData", validatedData)

    } catch (error) {
        if (error instanceof ServerValidateError) return error.formState

        throw error
    }

}