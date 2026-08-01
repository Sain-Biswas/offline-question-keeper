import { ExaminationItem } from "~/components/examinations/exam-item";
import { NewExaminationDialog } from "~/components/forms/new-examination-dialog";
import { getAllExamination } from "~/server/actions/get-all-examinations";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage
} from "~/shadcn/ui/breadcrumb";
import { ItemGroup } from "~/shadcn/ui/item";

export default async function IndexPage() {
	const examinations = await getAllExamination();

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

				<ItemGroup className="p-6">
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
