import { PencilSparklesIcon } from "lucide-react";
import { Button } from "~/shadcn/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Button>
				<PencilSparklesIcon />
				Click
			</Button>
		</main>
	);
}
