import { useMemo } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import {
	useFieldContext,
	useFormContext
} from "~/integrations/tanstack/forms/contexts";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel
} from "~/shadcn/ui/field";
import { cn } from "~/lib/utils";
import type { LucideProps } from "lucide-react";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from "~/shadcn/ui/combobox";
import { InputGroupAddon } from "~/shadcn/ui/input-group";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle
} from "~/shadcn/ui/item";

type ComboItems = {
	value: string;
	label: string;
	description?: string;
};

interface ComboboxFieldProps {
	items: ComboItems[];

	fieldClassName?: string;
	fieldDescription?: string;

	label: string;
	placeHolder?: string;

	iconClassName?: string;
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
}

export function ComboboxField({
	items,
	label,
	fieldClassName,
	placeHolder,
	fieldDescription,
	icon: Icon,
	iconClassName
}: ComboboxFieldProps) {
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
			data-invalid={isInvalid}
			className={cn("gap-0", fieldClassName)}
		>
			<FieldLabel htmlFor={name}>{label}</FieldLabel>

			<Combobox
				name={name}
				key={name}
				items={[{ value: "", label: placeHolder }, ...items]}
				value={items.findLast((i) => i.value === value)}
				onInputValueChange={handleChange}
				itemToStringValue={(subject: ComboItems) => subject.value}
			>
				<ComboboxInput placeholder={placeHolder}>
					{!!Icon && (
						<InputGroupAddon align="inline-start">
							<Icon className={cn("size-4", iconClassName)} />
						</InputGroupAddon>
					)}
				</ComboboxInput>
				<ComboboxContent>
					<ComboboxList>
						{(item: ComboItems) => (
							<ComboboxItem
								key={item.value}
								value={item}
								className="flex-col items-start text-left"
							>
								<Item className="m-0 p-0">
									<ItemContent>
										<ItemTitle>{item.label}</ItemTitle>
										{item.description && (
											<ItemDescription>
												{item.description}
											</ItemDescription>
										)}
									</ItemContent>
								</Item>
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>

			{!!fieldDescription && (
				<FieldDescription className="pt-2">
					{fieldDescription}
				</FieldDescription>
			)}

			{isInvalid && <FieldError errors={errors} />}
		</Field>
	);
}
