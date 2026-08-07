import { createFormHook } from "@tanstack/react-form-nextjs";
import {
	fieldContext,
	formContext
} from "~/integrations/tanstack/forms/contexts";

import { TextField } from "~/integrations/tanstack/forms/components/field/text";
import { TextareaField } from "~/integrations/tanstack/forms/components/field/textarea";
import { LiteralField } from "~/integrations/tanstack/forms/components/field/literal";
import { SwitchField } from "~/integrations/tanstack/forms/components/field/switch";
import { ImageDataField } from "~/integrations/tanstack/forms/components/field/image";
import { ComboboxField } from "~/integrations/tanstack/forms/components/field/combobox";

import { SubmitButton } from "~/integrations/tanstack/forms/components/form/button-submit";
import { ResetButton } from "~/integrations/tanstack/forms/components/form/button-reset";

export const { useAppForm } = createFormHook({
	fieldContext,
	fieldComponents: {
		TextField,
		TextareaField,
		LiteralField,
		SwitchField,
		ImageDataField,
		ComboboxField
	},

	formContext,
	formComponents: {
		SubmitButton,
		ResetButton
	}
});
