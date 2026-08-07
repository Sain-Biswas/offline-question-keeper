import { CirclePlusIcon, PencilSparklesIcon } from "lucide-react";
import { useFormContext } from "~/integrations/tanstack/forms/contexts";
import { Button } from "~/shadcn/ui/button";
import { Spinner } from "~/shadcn/ui/spinner";

interface SubmitButtonProps {
	purpose: "Create" | "Update";
}

export function SubmitButton({ purpose }: SubmitButtonProps) {
	const { Subscribe } = useFormContext();

	return (
		<Subscribe
			selector={(state) => ({
				isSubmitting: state.isSubmitting,
				canSubmit: state.canSubmit
			})}
		>
			{({ isSubmitting, canSubmit }) => (
				<Button
					type="submit"
					disabled={isSubmitting || !canSubmit}
				>
					{isSubmitting ?
						<Spinner />
					: purpose === "Create" ?
						<CirclePlusIcon />
					:	<PencilSparklesIcon />}
					{purpose}
				</Button>
			)}
		</Subscribe>
	);
}
