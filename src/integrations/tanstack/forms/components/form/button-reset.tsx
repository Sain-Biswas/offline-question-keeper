import { RotateCwIcon } from "lucide-react";
import { useFormContext } from "~/integrations/tanstack/forms/contexts";
import { Button } from "~/shadcn/ui/button";

export function ResetButton() {
	const { Subscribe, reset } = useFormContext();

	return (
		<Subscribe
			selector={(state) => ({
				isSubmitting: state.isSubmitting
			})}
		>
			{({ isSubmitting }) => (
				<Button
					onClick={() => reset()}
					variant="destructive"
					disabled={isSubmitting}
				>
					<RotateCwIcon />
					Reset
				</Button>
			)}
		</Subscribe>
	);
}
