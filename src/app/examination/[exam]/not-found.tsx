import { LandmarkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/shadcn/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "~/shadcn/ui/empty";

export default async function ExaminationNotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<LandmarkIcon />
					</EmptyMedia>

					<EmptyTitle>404 - Examination not found</EmptyTitle>

					<EmptyDescription>
						No examination found in database with the following
						slug.
					</EmptyDescription>
				</EmptyHeader>

				<EmptyContent>
					<Button
						nativeButton={false}
						size="lg"
						render={<Link href="/">Go to Home</Link>}
					/>
				</EmptyContent>
			</Empty>
		</main>
	);
}
