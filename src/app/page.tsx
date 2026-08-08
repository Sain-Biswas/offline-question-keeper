import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from "~/shadcn/ui/breadcrumb";
import { Button } from "~/shadcn/ui/button";

export default async function HomePage() {
	return (
		<>
			<header className="m-6 flex items-center justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Home</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main>
				<Button
					variant="link"
					size="lg"
					nativeButton={false}
					render={<Link href="/examination">Examination</Link>}
				/>
			</main>
		</>
	);
}
