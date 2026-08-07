import { Field } from "~/shadcn/ui/field";
import { Input } from "~/shadcn/ui/input";
import { useFieldContext } from "~/integrations/tanstack/forms/contexts";

export function LiteralField() {
	const {
		name,
		state: { value }
	} = useFieldContext<string>();

	return (
		<Field className="hidden">
			<Input
				id={name}
				key={name}
				name={name}
				contentEditable={false}
				value={value}
			/>
		</Field>
	);
}
