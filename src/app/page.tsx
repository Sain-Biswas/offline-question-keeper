import {
	LandmarkIcon,
	ListFilterIcon,
	RotateCwIcon,
	TextSearchIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { ExaminationItem } from "~/components/examinations/exam-item";
import { NewExaminationDialog } from "~/components/forms/new-examination-dialog";
import { getAllExamination } from "~/server/actions/get-all-examinations";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from "~/shadcn/ui/breadcrumb";
import { Button } from "~/shadcn/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { ItemGroup } from "~/shadcn/ui/item";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/shadcn/ui/select";

const currentStatus = [
	{
		label: "All",
		value: ""
	},
	{
		label: "Preparing",
		value: "on"
	},
	{
		label: "Not Preparing",
		value: "off"
	}
] as const;

export default async function IndexPage({ searchParams }: PageProps<"/">) {
	const params = await searchParams;

	const search = (params["search"] as string) || "";
	const status = (params["status"] as string) || "";

	const examinations = await getAllExamination({ search, status });

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

				<section className="m-6 bg-card p-6">
					<Form
						action="/"
						className="flex flex-col flex-wrap items-center gap-6 md:flex-row"
					>
						<Field className="mr-auto w-full gap-0 md:max-w-72">
							<FieldLabel>Search for Examination</FieldLabel>
							<InputGroup>
								<InputGroupInput
									key={search}
									name="search"
									autoComplete="off"
									placeholder="Search for name and description"
									defaultValue={search}
								/>
								<InputGroupAddon align="inline-start">
									<TextSearchIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>

						<Field
							className="w-full gap-0 md:max-w-48"
							defaultValue={status}
						>
							<FieldLabel>Current Status</FieldLabel>
							<Select
								key={status}
								items={currentStatus}
								name="status"
								defaultValue={status}
							>
								<SelectTrigger className="w-full md:max-w-48">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{currentStatus.map((stat) => (
										<SelectItem
											key={stat.value}
											value={stat.value}
										>
											{stat.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Button
							type="reset"
							size="lg"
							variant="destructive"
							className="w-full md:w-fit"
							nativeButton={false}
							render={
								<Link href="/">
									<RotateCwIcon />
									Reset
								</Link>
							}
						/>

						<Button
							type="submit"
							size="lg"
							className="w-full md:w-fit"
						>
							<ListFilterIcon />
							Filter
						</Button>
					</Form>
				</section>

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
