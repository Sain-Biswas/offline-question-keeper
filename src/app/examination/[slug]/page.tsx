import { ComponentIcon, LogsIcon, NotepadTextIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { ChapterList } from "~/components/chapters/list";
import { NewPaperDialog } from "~/components/forms/new-paper-dialog";
import { PaperListItem } from "~/components/papers/item";
import { PaperListFilters } from "~/components/papers/list-filters";
import { SubjectList } from "~/components/subjects/list";
import { fetchExaminationDetails } from "~/server/fetchers/fetch-examination-details";
import { fetchPaperList } from "~/server/fetchers/fetch-paper-list";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import { Badge } from "~/shadcn/ui/badge";
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
import { Skeleton } from "~/shadcn/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shadcn/ui/tabs";

const searchParamCache = createSearchParamsCache({
	paperQ: parseAsString.withDefault("")
});

export default async function ExaminationPage({
	params,
	searchParams
}: PageProps<"/examination/[slug]">) {
	const { slug } = await params;

	const examination = await fetchExaminationDetails({ slug });
	if (!examination) notFound();

	const { paperQ } = await searchParamCache.parse(searchParams);

	const param = await searchParams;

	const subjectSearch = (param["subjectSearch"] as string | undefined) || "";
	const chapterSearch = (param["chapterSearch"] as string | undefined) || "";

	const searchPaper = (param["searchPaper"] as string | undefined) || "all";
	const searchSubject =
		(param["searchSubject"] as string | undefined) || "all";

	const [papers] = await Promise.all([
		fetchPaperList({
			examination: examination.id,
			q: paperQ
		})
	]);

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
							<BreadcrumbPage>{examination?.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main>
				<section className="m-6 flex flex-col items-center gap-6 md:flex-row">
					<Avatar className="size-36 rounded-none after:content-none">
						<AvatarImage
							src={examination.image ?? null}
							alt={examination.code}
							className="size-36 rounded-none object-contain!"
						/>
						<AvatarFallback
							render={<Skeleton />}
							className="size-36 rounded-none"
						/>
					</Avatar>
					<article className="w-full text-center md:text-left">
						<div className="flex flex-col flex-wrap items-center justify-between md:flex-row">
							<h1 className="text-3xl/relaxed font-extrabold uppercase">
								{examination.name}
							</h1>
							<h3 className="text-xl/relaxed font-semibold text-muted-foreground uppercase">
								{examination.code}
							</h3>
						</div>
						{examination.isActive ?
							<Badge className="bg-chart-1/10 px-4 py-1 text-xs font-extrabold text-chart-1">
								Preparing
							</Badge>
						:	<Badge
								variant="destructive"
								className="bg-destructive/10 px-4 py-1 text-xs font-extrabold"
							>
								Not Preparing
							</Badge>
						}
						<p className="text-base/relaxed font-medium whitespace-pre-wrap text-muted-foreground">
							{examination.description}
						</p>
					</article>
				</section>

				<Tabs
					defaultValue="papers"
					className="m-0 sm:m-6"
				>
					<TabsList variant="line">
						<TabsTrigger
							value="papers"
							className="items-center gap-3"
						>
							<NotepadTextIcon />
							Papers{" "}
							<Badge className="text-xs font-extrabold text-chart-1">
								{examination.paperCount}
							</Badge>
						</TabsTrigger>

						<TabsTrigger
							value="subjects"
							className="items-center gap-3"
						>
							<ComponentIcon />
							Subjects{" "}
							<Badge className="text-xs font-extrabold text-chart-1">
								{examination.subjectCount}
							</Badge>
						</TabsTrigger>

						<TabsTrigger
							value="chapters"
							className="items-center gap-3"
						>
							<LogsIcon />
							Chapters{" "}
							<Badge className="text-xs font-extrabold text-chart-1">
								{examination.chapterCount}
							</Badge>
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="papers"
						className="m-6 sm:mx-0"
					>
						<section className="flex flex-col items-end gap-6 bg-card p-6 md:flex-row">
							<PaperListFilters />
							<NewPaperDialog examinationId={examination.id} />
						</section>

						{papers.length === 0 && (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<NotepadTextIcon />
									</EmptyMedia>

									<EmptyTitle>No Papers to show</EmptyTitle>

									<EmptyDescription>
										Add new papers or try changing the
										filters applied.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}

						<ItemGroup className="my-6">
							{papers.map((paper) => (
								<PaperListItem
									paper={paper}
									key={paper.id}
								/>
							))}
						</ItemGroup>
					</TabsContent>

					<TabsContent
						value="subjects"
						className="m-6 sm:mx-0"
					>
						<SubjectList
							examinationId={examination.id}
							examinationSlug={examination.slug}
							search={subjectSearch}
							selectedPaper={searchPaper}
						/>
					</TabsContent>

					<TabsContent
						value="chapters"
						className="m-6 sm:mx-0"
					>
						<ChapterList
							examinationId={examination.id}
							examinationSlug={examination.slug}
							search={chapterSearch}
							selectedSubject={searchSubject}
						/>
					</TabsContent>
				</Tabs>
			</main>
		</>
	);
}
