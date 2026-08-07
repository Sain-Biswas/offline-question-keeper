import { useMemo } from "react";
import type { HTMLInputAutoCompleteAttribute } from "react";
import {
	useFieldContext,
	useFormContext
} from "~/integrations/tanstack/forms/contexts";
import { cn } from "~/lib/utils";
import { Field, FieldError, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea
} from "~/shadcn/ui/input-group";

interface TextareaFieldProps {
	fieldClassName?: string;

	label: string;
	placeHolder?: string;
	autoComplete?: HTMLInputAutoCompleteAttribute;
	maxLength: number;
}

export function TextareaField({
	label,
	autoComplete = "off",
	fieldClassName,
	maxLength,
	placeHolder
}: TextareaFieldProps) {
	const {
		state: { isSubmitted }
	} = useFormContext();

	const {
		state: {
			meta: { isTouched, isValid, errors },
			value
		},
		name,
		handleBlur,
		handleChange
	} = useFieldContext<string>();

	const isInvalid = useMemo(() => {
		return (isTouched || isSubmitted) && errors.length > 0 && !isValid;
	}, [errors.length, isSubmitted, isTouched, isValid]);

	return (
		<Field
			data-invalid={isInvalid}
			className={cn("gap-0", fieldClassName)}
		>
			<FieldLabel htmlFor={name}>{label}</FieldLabel>

			<InputGroup>
				<InputGroupTextarea
					id={name}
					key={name}

					name={name}
					placeholder={placeHolder}

					value={value}
					onBlur={handleBlur}
					onChange={(event) => handleChange(event.target.value)}

					aria-invalid={isInvalid}
					autoComplete={autoComplete}
					maxLength={maxLength}
				/>
				<InputGroupAddon align="block-end">
					<InputGroupText>
						{value?.length || 0}/250 Character(s)
					</InputGroupText>
				</InputGroupAddon>
			</InputGroup>

			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
