import {
	ComponentIcon,
	LogsIcon,
	NotepadTextIcon,
	TagsIcon
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { ChapterListItem } from "~/components/chapters/item";
import { ChapterListFilters } from "~/components/chapters/list-filters";
import { NewChapterDialog } from "~/components/forms/new-chapter-dialog";
import { NewPaperDialog } from "~/components/forms/new-paper-dialog";
import { NewSubjectDialog } from "~/components/forms/new-subject-dialog";
import { NewTagDialog } from "~/components/forms/new-tag-dialog";
import { PaperListItem } from "~/components/papers/item";
import { PaperListFilters } from "~/components/papers/list-filters";
import { SubjectListItem } from "~/components/subjects/item";
import { SubjectListFilters } from "~/components/subjects/list-filters";
import { TagListItem } from "~/components/tags/item";
import { fetchChapterList } from "~/server/fetchers/fetch-chapter-list";
import { fetchExaminationDetails } from "~/server/fetchers/fetch-examination-details";
import { fetchPaperList } from "~/server/fetchers/fetch-paper-list";
import { fetchSubjectList } from "~/server/fetchers/fetch-subject-list";
import { fetchTagList } from "~/server/fetchers/fetch-tag-list";
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
	paperQ: parseAsString.withDefault(""),

	subjectQ: parseAsString.withDefault(""),
	byPaper: parseAsString.withDefault(""),

	chapterQ: parseAsString.withDefault(""),
	bySubject: parseAsString.withDefault(""),

	tagQ: parseAsString.withDefault("")
});

export default async function ExaminationPage({
	params,
	searchParams
}: PageProps<"/examination/[slug]">) {
	const { slug } = await params;

	const examination = await fetchExaminationDetails({ slug });
	if (!examination) notFound();

	const { paperQ, subjectQ, byPaper, chapterQ, bySubject, tagQ } =
		await searchParamCache.parse(searchParams);

	const [papers, subjects, chapters, tags] = await Promise.all([
		fetchPaperList({
			examination: examination.id,
			q: paperQ
		}),
		fetchSubjectList({
			examination: examination.id,
			paper: byPaper,
			q: subjectQ
		}),
		fetchChapterList({
			examination: examination.id,
			q: chapterQ,
			subject: bySubject
		}),
		fetchTagList({ examination: examination.id, q: tagQ })
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

						<TabsTrigger
							value="tags"
							className="items-center gap-3"
						>
							<TagsIcon />
							Tags{" "}
							<Badge className="text-xs font-extrabold text-chart-1">
								{examination.tagCount}
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
						<section className="flex flex-col flex-wrap items-end gap-6 bg-card p-6 md:flex-row">
							<SubjectListFilters
								papers={subjects.paperEntries}
							/>
							<NewSubjectDialog papers={subjects.paperEntries} />
						</section>

						{subjects.subjects.length === 0 && (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<ComponentIcon />
									</EmptyMedia>

									<EmptyTitle>No Subjects to show</EmptyTitle>

									<EmptyDescription>
										Add new subjects or try changing the
										filters applied.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}

						<ItemGroup className="my-6">
							{subjects.subjects.map((subject) => (
								<SubjectListItem
									subject={subject}
									key={subject.id}
								/>
							))}
						</ItemGroup>
					</TabsContent>

					<TabsContent
						value="chapters"
						className="m-6 sm:mx-0"
					>
						<section className="flex flex-col flex-wrap items-end gap-6 bg-card p-6 md:flex-row">
							<ChapterListFilters subjects={chapters.subjects} />

							<NewChapterDialog subjects={chapters.subjects} />
						</section>

						{chapters.chapters.length === 0 && (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<LogsIcon />
									</EmptyMedia>

									<EmptyTitle>No Chapters to show</EmptyTitle>

									<EmptyDescription>
										Add new chapters or try changing the
										filters applied.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}

						<ItemGroup className="my-6">
							{chapters.chapters.map((chapter) => (
								<ChapterListItem
									chapter={chapter}
									key={chapter.id}
								/>
							))}
						</ItemGroup>
					</TabsContent>

					<TabsContent
						value="tags"
						className="m-6 sm:mx-0"
					>
						<section className="flex flex-col items-end gap-6 bg-card p-6 md:flex-row">
							{/* <PaperListFilters /> */}
							<NewTagDialog examinationId={examination.id} />
						</section>

						{tags.length === 0 && (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<TagsIcon />
									</EmptyMedia>

									<EmptyTitle>No Tags to show</EmptyTitle>

									<EmptyDescription>
										Add new tags or try changing the filters
										applied.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						)}

						<ItemGroup className="my-6">
							{tags.map((tag) => (
								<TagListItem
									tag={tag}
									key={tag.id}
								/>
							))}
						</ItemGroup>
					</TabsContent>
				</Tabs>
			</main>
		</>
	);
}
