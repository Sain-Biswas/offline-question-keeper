import { CirclePlusIcon, TargetIcon } from "lucide-react";
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
import { Combobox, ComboboxInput } from "~/shadcn/ui/combobox";
import { Field, FieldLabel } from "~/shadcn/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from "~/shadcn/ui/input-group";
import { ItemGroup } from "~/shadcn/ui/item";
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

				<section className="m-6 flex flex-col gap-6 bg-card p-6 sm:flex-row sm:items-end">
					<Field className="w-full gap-0 sm:max-w-80">
						<FieldLabel>Search for Examination</FieldLabel>
						<InputGroup>
							<InputGroupInput
								type="text"
								disabled
								placeholder="Search..."
								autoComplete="off"
							/>
						</InputGroup>
					</Field>

					<Field className="mr-auto w-full gap-0 sm:max-w-40">
						<FieldLabel>Current Status</FieldLabel>
						<Combobox>
							<ComboboxInput
								placeholder="All"
								disabled
							>
								<InputGroupAddon>
									<TargetIcon />
								</InputGroupAddon>
							</ComboboxInput>
						</Combobox>
					</Field>
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
