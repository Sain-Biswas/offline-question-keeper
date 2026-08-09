import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchExaminationDetails } from "~/server/fetchers/fetch-examination-details";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";

export default async function ExaminationQuestionPage({
	params,
	searchParams
}: PageProps<"/examination/[slug]">) {
	const { slug } = await params;

	const examination = await fetchExaminationDetails({ slug });
	if (!examination) notFound();

	const param = await searchParams;

	const paper = (param["paper"] as string | undefined) ?? "";
	const subject = (param["subject"] as string | undefined) ?? "";
	const chapter = (param["chapter"] as string | undefined) ?? "";

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
									<Link href="/examination">Examination</Link>
								}
							/>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								render={
									<Link
										href={`/examination/${examination.slug}`}
									>
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
