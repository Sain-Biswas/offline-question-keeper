import Link from "next/link";
import { notFound } from "next/navigation";
import { getExaminationDetails } from "~/server/actions/get-examination-details";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";

export default async function ExaminationPage({
	params
}: PageProps<"/[exam]">) {
	const { exam } = await params;
	const examination = await getExaminationDetails({ slug: exam });

	if (!examination) notFound();

	return (
		<>
			<header className="m-6">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								render={<Link href="/">Home</Link>}
							/>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{examination?.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main></main>
		</>
	);
}
