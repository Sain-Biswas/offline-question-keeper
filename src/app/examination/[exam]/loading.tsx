import {
	CirclePlusIcon,
	ComponentIcon,
	ListFilterIcon,
	LogsIcon,
	NotepadTextIcon,
	TextSearchIcon
} from "lucide-react";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";
import { Button } from "~/shadcn/ui/button";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { ItemGroup } from "~/shadcn/ui/item";
import { Skeleton } from "~/shadcn/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "~/shadcn/ui/tabs";

export default function ExaminationLoadingPage() {
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
							<Skeleton className="h-4 w-40 rounded" />
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>
			<main>
				<section className="m-6 flex flex-col items-center gap-6 md:flex-row">
					<Skeleton className="size-30" />
					<article className="w-full">
						<div className="flex flex-col flex-wrap items-center justify-between gap-4 md:flex-row">
							<Skeleton className="h-8 w-100 max-w-10/12" />
							<Skeleton className="h-6 w-30" />
						</div>
						<Skeleton className="mt-4 h-4 w-140 max-w-11/12" />
					</article>
				</section>

				<Tabs
					defaultValue="papers"
					className="m-0 sm:m-6"
				>
					<TabsList variant="line">
						<TabsTrigger
							value="papers"
							disabled
						>
							<NotepadTextIcon />
							Papers
						</TabsTrigger>

						<TabsTrigger
							value="subjects"
							disabled
						>
							<ComponentIcon />
							Subjects
						</TabsTrigger>

						<TabsTrigger
							value="chapters"
							disabled
						>
							<LogsIcon />
							Chapters
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<section className="m-6 mt-8 flex flex-col items-end gap-6 bg-card p-6 md:flex-row">
					<Field className="mr-auto w-full gap-0 md:max-w-72">
						<FieldLabel>Search for Paper</FieldLabel>
						<InputGroup>
							<InputGroupInput
								name="paperSearch"
								autoComplete="off"
								disabled
								placeholder="Search for name and description"
							/>
							<InputGroupAddon align="inline-start">
								<TextSearchIcon />
							</InputGroupAddon>
						</InputGroup>
					</Field>

					<Button
						disabled
						className="w-full md:w-fit"
					>
						<ListFilterIcon />
						Filter
					</Button>

					<Button
						disabled
						className="w-full md:w-fit"
					>
						<CirclePlusIcon />
						Add New Paper
					</Button>
				</section>

				<ItemGroup className="m-6">
					<Skeleton className="h-40 w-full" />
					<Skeleton className="h-40 w-full" />
				</ItemGroup>
			</main>
		</>
	);
}
