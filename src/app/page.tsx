import { PencilSparklesIcon } from "lucide-react";
import { ModeToggleDropMenu } from "~/components/dark-mode/mode-toggle-dropmenu";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from "~/shadcn/ui/breadcrumb";
import { Button } from "~/shadcn/ui/button";

export default function Home() {
	return (
		<>
			<header className="m-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Home</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main className="m-6">
				<Button>
					<PencilSparklesIcon />
					Click
				</Button>

				<ModeToggleDropMenu />
			</main>
		</>
	);
}
