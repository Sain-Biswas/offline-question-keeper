import { useMemo } from "react";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel
} from "~/shadcn/ui/field";
import { Switch } from "~/shadcn/ui/switch";
import { useFieldContext, useFormContext } from "../../contexts";
import { cn } from "~/lib/utils";

interface SwitchFieldProps {
	fieldClassName?: string;
	fieldDescription?: string;

	label: string;
}

export function SwitchField({
	label,
	fieldClassName,
	fieldDescription
}: SwitchFieldProps) {
	const {
		state: { isSubmitted }
	} = useFormContext();

	const {
		state: {
			meta: { isTouched, isValid, errors },
			value
		},
		name,
		handleChange
	} = useFieldContext();

	const isInvalid = useMemo(() => {
		return (isTouched || isSubmitted) && errors.length > 0 && !isValid;
	}, [errors.length, isSubmitted, isTouched, isValid]);

	return (
		<Field
			orientation="horizontal"
			data-invalid={isInvalid}
			className={cn("gap-0", fieldClassName)}
		>
			<FieldContent>
				<FieldLabel htmlFor={name}>{label}</FieldLabel>
				{!!fieldDescription && (
					<FieldDescription>{fieldDescription}</FieldDescription>
				)}
				{isInvalid && <FieldError errors={errors} />}
			</FieldContent>

			<Switch
				id={name}
				name={name}
				checked={value === "on"}
				onCheckedChange={(checked) =>
					handleChange(checked ? "on" : undefined)
				}
				aria-invalid={isInvalid}
			/>
		</Field>
	);
}
