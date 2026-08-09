import { LandmarkIcon } from "lucide-react";
import Link from "next/link";
import {
	createSearchParamsCache,
	parseAsString,
	parseAsStringLiteral
} from "nuqs/server";
import { ExaminationItem } from "~/components/examinations/item";
import { ExaminationListFilters } from "~/components/examinations/list-filters";
import { NewExaminationDialog } from "~/components/forms/new-examination-dialog";
import { fetchExaminationList } from "~/server/fetchers/fetch-examination-list";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";
import { ItemGroup } from "~/shadcn/ui/item";

const searchParamCache = createSearchParamsCache({
	q: parseAsString.withDefault(""),
	status: parseAsStringLiteral([
		"all",
		"preparing",
		"not-preparing"
	]).withDefault("all")
});

export default async function IndexPage({ searchParams }: PageProps<"/">) {
	const { q, status } = await searchParamCache.parse(searchParams);

	const examinations = await fetchExaminationList({ q, status });

	return (
		<>
			<header className="m-6 flex items-center justify-between">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								render={<Link href="/">Home</Link>}
							/>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Examination</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main>
				<section className="m-6 flex flex-wrap items-center justify-between gap-6">
					<article>
						<h1 className="text-xl/loose font-extrabold uppercase">
							Examinations
						</h1>
						<p className="text-sm/relaxed font-medium text-muted-foreground">
							List of all examinations added by the user for
							preparation.
						</p>
					</article>

					<NewExaminationDialog />
				</section>

				<ExaminationListFilters />

				{examinations.length === 0 && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<LandmarkIcon />
							</EmptyMedia>

							<EmptyTitle>No Examinations to show</EmptyTitle>

							<EmptyDescription>
								Add new examinations or try changing the filters
								applied.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}

				<ItemGroup className="my-6 px-6">
					{examinations.map((exam) => (
						<ExaminationItem
							key={exam.id}
							examination={exam}
						/>
					))}
				</ItemGroup>
			</main>
		</>
	);
}
