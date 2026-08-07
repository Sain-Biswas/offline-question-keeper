import type { LucideProps } from "lucide-react";
import type {
	ForwardRefExoticComponent,
	HTMLInputAutoCompleteAttribute,
	RefAttributes
} from "react";
import { useMemo } from "react";
import {
	useFieldContext,
	useFormContext
} from "~/integrations/tanstack/forms/contexts";
import { cn } from "~/lib/utils";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel
} from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";

interface TextFieldProps {
	fieldClassName?: string;
	fieldDescription?: string;

	label: string;
	placeHolder: string;
	autoComplete?: HTMLInputAutoCompleteAttribute;

	iconClassName?: string;
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
}

export function TextField({
	fieldClassName,
	label,
	placeHolder,
	autoComplete = "off",
	fieldDescription,
	iconClassName,
	icon: Icon
}: TextFieldProps) {
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
				<InputGroupInput
					id={name}
					key={name}

					name={name}
					placeholder={placeHolder}

					value={value}
					onBlur={handleBlur}
					onChange={(event) => handleChange(event.target.value)}

					aria-invalid={isInvalid}
					autoComplete={autoComplete}
				/>
				{!!Icon && (
					<InputGroupAddon align="inline-start">
						<Icon className={cn("size-4", iconClassName)} />
					</InputGroupAddon>
				)}
			</InputGroup>

			{!!fieldDescription && (
				<FieldDescription className="pt-2">
					{fieldDescription}
				</FieldDescription>
			)}

			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
