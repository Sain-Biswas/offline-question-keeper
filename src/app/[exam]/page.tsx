import Link from "next/link";
import { notFound } from "next/navigation";
import { getExaminationDetails } from "~/server/actions/get-examination-details";
import { Avatar, AvatarFallback, AvatarImage } from "~/shadcn/ui/avatar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "~/shadcn/ui/breadcrumb";
import { Skeleton } from "~/shadcn/ui/skeleton";

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
			<main>
				<section className="m-6 flex flex-col items-center gap-6 md:flex-row">
					<Avatar className="size-30 rounded-none after:content-none">
						<AvatarImage
							src={examination.image ?? null}
							alt={examination.code}
							className="size-30 rounded-none object-contain!"
						/>
						<AvatarFallback
							render={<Skeleton />}
							className="size-30 rounded-none"
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
						<p className="text-base/relaxed font-medium whitespace-pre-wrap text-muted-foreground">
							{examination.description}
						</p>
					</article>
				</section>
			</main>
		</>
	);
}
