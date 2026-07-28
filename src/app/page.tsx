import { PencilSparklesIcon } from "lucide-react";
import { ModeToggleDropMenu } from "~/components/dark-mode/mode-toggle-dropmenu";
import { Button } from "~/shadcn/ui/button";

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Button>
				<PencilSparklesIcon />
				Click
			</Button>

			<ModeToggleDropMenu />
		</main>
	);
}
