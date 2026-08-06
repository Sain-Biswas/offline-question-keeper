import Link from "next/link";
import { notFound } from "next/navigation";
import { getExaminationDetails } from "~/server/fetchers/get-examination-details";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";

export default async function QuestionPage({
	params,
	searchParams
}: PageProps<"/[exam]/question">) {
	const { exam } = await params;
	const param = await searchParams;

	const examination = await getExaminationDetails({ slug: exam });

	const paper = (param["paper"] as string | undefined) ?? "";
	const subject = (param["subject"] as string | undefined) ?? "";
	const chapter = (param["chapter"] as string | undefined) ?? "";

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
							<BreadcrumbLink
								render={
									<Link href={`/${examination.slug}`}>
										{examination.name}
									</Link>
								}
							/>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Question</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main className="m-6">
				<p>{paper}</p>
				<p>{subject}</p>
				<p>{chapter}</p>
			</main>
		</>
	);
}
