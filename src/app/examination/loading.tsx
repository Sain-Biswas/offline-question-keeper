import {
	CirclePlusIcon,
	ListFilterIcon,
	RotateCwIcon,
	TextSearchIcon
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
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
import { Select, SelectTrigger, SelectValue } from "~/shadcn/ui/select";
import { Skeleton } from "~/shadcn/ui/skeleton";

export default function IndexLoading() {
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

					<Button
						size="lg"
						disabled
					>
						<CirclePlusIcon />
						Add New Examination
					</Button>
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
									name="search"
									disabled
									placeholder="Search for name and description"
								/>
								<InputGroupAddon align="inline-start">
									<TextSearchIcon />
								</InputGroupAddon>
							</InputGroup>
						</Field>

						<Field className="w-full gap-0 md:max-w-48">
							<FieldLabel>Current Status</FieldLabel>
							<Select name="status">
								<SelectTrigger
									disabled
									className="w-full md:max-w-48"
								>
									<SelectValue placeholder="All" />
								</SelectTrigger>
							</Select>
						</Field>

						<Button
							type="reset"
							size="lg"
							disabled
							variant="destructive"
							className="w-full md:w-fit"
						>
							<RotateCwIcon />
							Reset
						</Button>
						<Button
							type="submit"
							size="lg"
							className="w-full md:w-fit"
							disabled
						>
							<ListFilterIcon />
							Filter
						</Button>
					</Form>
				</section>

				<ItemGroup className="my-6 px-6">
					<Skeleton className="h-42 w-full" />
					<Skeleton className="h-42 w-full" />
					<Skeleton className="h-42 w-full" />
				</ItemGroup>
			</main>
		</>
	);
}
